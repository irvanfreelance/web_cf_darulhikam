import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { redis } from '@/lib/redis';
import { Client } from '@upstash/workflow';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Standard Midtrans payload format extraction
    const { order_id, transaction_status, status_code, gross_amount, signature_key } = payload;
    
    if (!order_id) {
      return NextResponse.json({ message: "Invalid payload: missing order_id" }, { status: 400 });
    }

    // Optional: Signature verification if signature_key and SERVER_KEY exist
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (signature_key && serverKey && status_code && gross_amount) {
      const expectedSignature = crypto
        .createHash('sha512')
        .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
        .digest('hex');

      if (signature_key !== expectedSignature) {
        console.warn(`[Midtrans Webhook] Invalid signature for order ${order_id}`);
        // Log invalid attempt
        await query(`
          INSERT INTO payment_logs (invoice_code, endpoint, request_payload, response_payload, http_status)
          VALUES ($1, $2, $3, $4, $5)
        `, [order_id, '/api/webhooks/midtrans', JSON.stringify(payload), JSON.stringify({ error: 'Invalid signature' }), 403]).catch(() => {});

        return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
      }
    }

    // Determine status
    let newStatus = 'PENDING';
    if (['capture', 'settlement'].includes(transaction_status)) {
      newStatus = 'PAID';
    } else if (['deny', 'cancel', 'expire', 'failure'].includes(transaction_status)) {
      newStatus = 'FAILED';
    }

    if (newStatus === 'PAID') {
      await query(`
        UPDATE invoices
        SET status = $1, paid_at = CURRENT_TIMESTAMP
        WHERE invoice_code = $2 AND status != 'PAID'
      `, [newStatus, order_id]);

      // REAL-TIME UPDATES & WORKFLOW (mirrors the Xendit webhook)
      try {
        const invoiceDetails = await query(`
          SELECT i.id, i.created_at, i.base_amount, i.total_amount,
                 i.donor_name_snapshot, i.is_anonymous, i.doa,
                 t.campaign_id, t.affiliate_id,
                 c.slug
          FROM invoices i
          JOIN transactions t ON i.id = t.invoice_id AND i.created_at = t.invoice_created_at
          JOIN campaigns c ON t.campaign_id = c.id
          WHERE i.invoice_code = $1
          LIMIT 1
        `, [order_id]);

        if (invoiceDetails.length > 0) {
          const detail = invoiceDetails[0];
          const { id: invoiceId, created_at: invoiceCreatedAt, campaign_id, affiliate_id, base_amount, total_amount, donor_name_snapshot, is_anonymous, doa, slug } = detail;

          const statsKey = `campaign:${campaign_id}:stats`;
          await redis.hincrby(statsKey, 'collected_amount', Math.round(Number(total_amount)));
          await redis.hincrby(statsKey, 'donor_count', 1);

          const donorListKey = `campaign:${campaign_id}:donors`;
          const donorData = JSON.stringify({
            id: detail.id,
            name: is_anonymous ? 'Hamba Allah' : donor_name_snapshot,
            amount: Number(total_amount),
            date: new Date().toISOString(),
            message: doa
          });
          await redis.lpush(donorListKey, donorData);
          await redis.ltrim(donorListKey, 0, 99);

          const workflowClient = new Client({ token: process.env.QSTASH_TOKEN! });
          await workflowClient.trigger({
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/workflow/payment-success`,
            body: {
              campaignId: campaign_id,
              amount: Number(total_amount),
              invoiceCode: order_id,
              slug
            },
          });

          if (affiliate_id) {
            await workflowClient.trigger({
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/workflow/affiliate-commission`,
              body: {
                invoiceCode: order_id,
                invoiceId,
                invoiceCreatedAt,
                campaignId: campaign_id,
                affiliateId: affiliate_id,
                baseAmount: Number(base_amount),
              },
            });
          }
        }
      } catch (redisErr) {
        console.error("Midtrans Redis/Workflow update error:", redisErr);
      }
    } else {
      await query(`
        UPDATE invoices 
        SET status = $1
        WHERE invoice_code = $2 AND status != 'PAID'
      `, [newStatus, order_id]);
    }

    const responsePayload = { status: 'success', new_status: newStatus, transaction_status };

    // Log the payload and outcome to payment_logs
    try {
      await query(`
        INSERT INTO payment_logs (invoice_code, endpoint, request_payload, response_payload, http_status)
        VALUES ($1, $2, $3, $4, $5)
      `, [order_id, '/api/webhooks/midtrans', JSON.stringify(payload), JSON.stringify(responsePayload), 200]);
    } catch (err: any) {
      console.error("payment_logs insert error in webhook:", err);
      if (err.code === '23505' && err.constraint === 'payment_logs_pkey') {
        query(`SELECT setval('payment_logs_id_seq', (SELECT MAX(id) FROM payment_logs))`).catch(() => {});
      }
    }

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.error("Midtrans Webhook Error:", error);
    return NextResponse.json({ status: 'error', message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
