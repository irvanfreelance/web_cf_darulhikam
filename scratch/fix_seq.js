const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const match = envContent.match(/DATABASE_URL=["']?([^"'\n\r]+)["']?/);
const dbUrl = match ? match[1] : process.env.DATABASE_URL;

const sql = neon(dbUrl);

async function fix() {
  console.log("Syncing payment_logs sequences...");
  try {
    await sql`SELECT setval('payment_logs_id_seq1', (SELECT COALESCE(MAX(id), 0) + 1 FROM payment_logs), false)`;
    console.log("Synced payment_logs_id_seq1");
  } catch (e) {
    console.error("Error setting payment_logs_id_seq1:", e.message);
  }
  
  try {
    await sql`SELECT setval('payment_logs_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM payment_logs), false)`;
    console.log("Synced payment_logs_id_seq");
  } catch (e) {
    console.error("Error setting payment_logs_id_seq:", e.message);
  }
}

fix().catch(console.error);
