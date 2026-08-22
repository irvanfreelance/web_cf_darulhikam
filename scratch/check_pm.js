const { NeonHttpDriver, neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const match = envContent.match(/DATABASE_URL=["']?([^"'\n\r]+)["']?/);
const dbUrl = match ? match[1] : process.env.DATABASE_URL;

const sql = neon(dbUrl);

async function main() {
  const rows = await sql`SELECT id, code, name, type, provider, is_active, sort_order FROM payment_methods ORDER BY sort_order ASC, id ASC`;
  console.log('Current Payment Methods in DB:');
  console.table(rows);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
