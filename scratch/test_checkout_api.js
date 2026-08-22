const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const getEnv = (key) => {
  const m = envContent.match(new RegExp(`${key}=["']?([^"'\n\r]+)["']?`));
  return m ? m[1] : process.env[key];
};

const dbUrl = getEnv('DATABASE_URL');
const sql = neon(dbUrl);

async function testCheckout() {
  // Find payment method ID for Bank Mandiri (Midtrans)
  const pm = await sql`SELECT id, code, name, provider FROM payment_methods WHERE code = 'MIDTRANS_MANDIRI' LIMIT 1`;
  console.log("Mandiri Payment Method:", pm);

  if (pm.length === 0) return;

  const payload = {
    campaignId: 1,
    amount: 50000,
    donorName: 'Tester Midtrans',
    donorEmail: 'test@example.com',
    donorPhone: '08123456789',
    isAnonymous: false,
    paymentMethodId: pm[0].id,
    paymentType: 'MIDTRANS_MANDIRI'
  };

  const res = await fetch('http://localhost:3000/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  console.log("Checkout Response Status:", res.status);
  console.log("Checkout Response Body:", text);
}

testCheckout().catch(console.error);
