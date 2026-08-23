const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const match = envContent.match(/DATABASE_URL=["']?([^"'\n\r]+)["']?/);
const dbUrl = match ? match[1] : process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("DATABASE_URL is missing!");
  process.exit(1);
}

const sql = neon(dbUrl);

async function main() {
  console.log("Seeding Midtrans Payment Methods...");

  // Sync sequence to highest ID first
  await sql`SELECT setval('payment_methods_id_seq1', (SELECT COALESCE(MAX(id), 0) FROM payment_methods))`;

  // Define Active & Inactive Midtrans Methods
  const methods = [
    // ACTIVE METHODS (Shown in UI)
    { code: 'MIDTRANS_QRIS_GOPAY', name: 'QRIS Dinamis GoPay', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg', type: 'qr_code', provider: 'Midtrans', is_active: true, sort_order: 1 },
    { code: 'MIDTRANS_BNI', name: 'BNI Virtual Account', logo_url: 'https://4jgsaomzelkwriht.public.blob.vercel-storage.com/bni-YU2aAc67bEdD0QHeYCWqhRRmpAErd0.png', type: 'va', provider: 'Midtrans', is_active: true, sort_order: 2 },
    { code: 'GOPAY', name: 'GoPay', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg', type: 'E-Wallet', provider: 'Midtrans', is_active: true, sort_order: 3 },
    { code: 'MIDTRANS_MANDIRI', name: 'Bank Mandiri', logo_url: 'https://4jgsaomzelkwriht.public.blob.vercel-storage.com/mandiri-OiJcNXAXphLUz93kRkHBT0cDlelKq4.png', type: 'va', provider: 'Midtrans', is_active: true, sort_order: 4 },
    { code: 'MIDTRANS_PERMATA', name: 'PermataBank', logo_url: 'https://4jgsaomzelkwriht.public.blob.vercel-storage.com/permata-0IaHmiPhtQlQLBmBp1vtp6nmfwosK2.jpg', type: 'va', provider: 'Midtrans', is_active: true, sort_order: 5 },

    // INACTIVE METHODS (In Activation Process)
    { code: 'MIDTRANS_DANAMON', name: 'Danamon Virtual Account', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Danamon_logo.svg', type: 'va', provider: 'Midtrans', is_active: false, sort_order: 20 },
    { code: 'MIDTRANS_CIMB', name: 'CIMB Niaga Virtual Account', logo_url: 'https://4jgsaomzelkwriht.public.blob.vercel-storage.com/cimb-XgzzZPNYCj1lEgpL4qWDouCLTUwA4M.png', type: 'va', provider: 'Midtrans', is_active: false, sort_order: 21 },
    { code: 'MIDTRANS_BSI', name: 'BSI Virtual Account', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Bank_Syariah_Indonesia.svg', type: 'va', provider: 'Midtrans', is_active: false, sort_order: 22 },
    { code: 'MIDTRANS_BCA', name: 'BCA Virtual Account', logo_url: 'https://4jgsaomzelkwriht.public.blob.vercel-storage.com/bca9-IbKNyHu93Cn6SG23ej52n4WGSr9Q8i.jpg', type: 'va', provider: 'Midtrans', is_active: false, sort_order: 23 },
    { code: 'MIDTRANS_BRI', name: 'BRI Virtual Account', logo_url: 'https://4jgsaomzelkwriht.public.blob.vercel-storage.com/bri-PAGx45zIqEWTHhyJvBkbAXZouRYTfG.png', type: 'va', provider: 'Midtrans', is_active: false, sort_order: 24 },
    { code: 'MIDTRANS_QRIS_STATIS', name: 'QRIS Statis GoPay', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg', type: 'qr_code', provider: 'Midtrans', is_active: false, sort_order: 25 },
    { code: 'MIDTRANS_DANA', name: 'DANA', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg', type: 'E-Wallet', provider: 'Midtrans', is_active: false, sort_order: 26 },
    { code: 'MIDTRANS_SHOPEEPAY', name: 'ShopeePay', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg', type: 'E-Wallet', provider: 'Midtrans', is_active: false, sort_order: 27 },
    { code: 'MIDTRANS_OVO', name: 'OVO', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg', type: 'E-Wallet', provider: 'Midtrans', is_active: false, sort_order: 28 },
    { code: 'MIDTRANS_GOOGLEPAY', name: 'Google Pay', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg', type: 'E-Wallet', provider: 'Midtrans', is_active: false, sort_order: 29 },
    { code: 'MIDTRANS_CREDITCARD', name: 'Credit/Debit Card', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg', type: 'credit_card', provider: 'Midtrans', is_active: false, sort_order: 30 },
  ];

  for (const m of methods) {
    const existing = await sql`SELECT id FROM payment_methods WHERE code = ${m.code}`;
    if (existing.length > 0) {
      await sql`
        UPDATE payment_methods 
        SET name = ${m.name}, logo_url = ${m.logo_url}, type = ${m.type}, provider = ${m.provider}, is_active = ${m.is_active}, sort_order = ${m.sort_order}
        WHERE code = ${m.code}
      `;
      console.log(`Updated method: ${m.code} (${m.name})`);
    } else {
      await sql`
        INSERT INTO payment_methods (code, name, logo_url, type, provider, admin_fee_flat, admin_fee_pct, is_active, is_redirect, sort_order)
        VALUES (${m.code}, ${m.name}, ${m.logo_url}, ${m.type}, ${m.provider}, 0, 0.00, ${m.is_active}, false, ${m.sort_order})
      `;
      console.log(`Inserted method: ${m.code} (${m.name})`);
    }
  }

  // Deactivate Xendit / old duplicates of these active methods so user sees Midtrans versions
  await sql`
    UPDATE payment_methods
    SET is_active = false
    WHERE provider = 'Xendit' AND code IN ('QR_CODE', 'BNI', 'MANDIRI', 'PERMATA')
  `;
  console.log("Deactivated replaced Xendit methods to prioritize Midtrans.");

  console.log("Seeding complete!");
}

main().catch(err => {
  console.error("Seeding error:", err);
  process.exit(1);
});
