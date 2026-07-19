const { Pool } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envContent.match(/^DATABASE_URL=["']?([^"'\r\n]+)["']?/m);
const databaseUrl = dbUrlMatch[1];

const pool = new Pool({ connectionString: databaseUrl });

async function verify() {
  try {
    const tables = [
      'ngo_configs', 
      'admins', 
      'categories', 
      'campaigns', 
      'payment_methods', 
      'payment_instructions', 
      'donors', 
      'invoices',
      'invoices_y2026m05',
      'transactions_y2026m05',
      'invoices_y2026m10',
      'transactions_y2026m10'
    ];
    for (const table of tables) {
      const res = await pool.query(`SELECT COUNT(*) FROM "public"."${table}"`);
      console.log(`Table ${table} has ${res.rows[0].count} rows.`);
    }
  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    await pool.end();
  }
}

verify();
