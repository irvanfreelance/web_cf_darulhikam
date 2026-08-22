const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const match = envContent.match(/DATABASE_URL=["']?([^"'\n\r]+)["']?/);
const dbUrl = match ? match[1] : process.env.DATABASE_URL;

const sql = neon(dbUrl);

async function test() {
  console.log("Checking active Midtrans payment methods...");
  const methods = await sql`
    SELECT id, code, name, type, provider, is_active 
    FROM payment_methods 
    WHERE provider = 'Midtrans'
    ORDER BY sort_order ASC
  `;
  console.table(methods);

  console.log("Checking latest payment_logs...");
  const logs = await sql`
    SELECT id, invoice_code, endpoint, http_status, created_at 
    FROM payment_logs 
    ORDER BY id DESC 
    LIMIT 5
  `;
  console.table(logs);
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
