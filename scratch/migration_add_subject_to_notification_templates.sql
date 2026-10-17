-- Migration: Add subject column to notification_templates and add payment_paid EMAIL template
-- Run this once on the production DB

-- 1. Add subject column (safe: no-op if already exists)
ALTER TABLE notification_templates ADD COLUMN IF NOT EXISTS subject varchar(255);

-- 2. Insert payment_paid EMAIL template (skip if already exists via unique constraint on event_trigger)
-- The unique index is on event_trigger only, so we use ON CONFLICT DO NOTHING
INSERT INTO notification_templates (event_trigger, channel, subject, message_content, is_active)
VALUES (
  'payment_paid',
  'EMAIL',
  'Donasi Anda Telah Diterima – {invoice_code}',
  '<p>Assalamu''alaikum <strong>{nama}</strong>,</p>
<p>Alhamdulillah, donasi Anda sebesar <strong>{nominal}</strong> telah berhasil kami terima.</p>
<ul>
  <li><strong>Kode Invoice:</strong> {invoice_code}</li>
  <li><strong>Metode Pembayaran:</strong> {metode}</li>
  <li><strong>Total:</strong> {total_transfer}</li>
</ul>
<p>Jazakumullahu khairan atas kepercayaan dan kebaikan Anda. Semoga menjadi amal jariyah yang terus mengalir.</p>',
  true
)
ON CONFLICT DO NOTHING;

-- 3. Add checkout_pending EMAIL template (for checkout email flow)
INSERT INTO notification_templates (event_trigger, channel, subject, message_content, is_active)
VALUES (
  'checkout_pending',
  'EMAIL',
  'Instruksi Pembayaran Donasi – {invoice_code}',
  '<p>Assalamu''alaikum <strong>{nama}</strong>,</p>
<p>Terima kasih telah berdonasi sebesar <strong>{nominal}</strong>.</p>
<ul>
  <li><strong>Kode Invoice:</strong> {invoice_code}</li>
  <li><strong>Metode:</strong> {metode}</li>
  <li><strong>No. Rekening / VA:</strong> {va_number}</li>
  <li><strong>Total Transfer:</strong> {total_transfer}</li>
</ul>
<p>Silakan selesaikan pembayaran sebelum batas waktu yang ditentukan.</p>
<p>{instruksi}</p>',
  true
)
ON CONFLICT DO NOTHING;
