const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const dbUrl = envContent.match(/DATABASE_URL=["']?([^"'\n\r]+)["']?/)?.[1] || process.env.DATABASE_URL;

const sql = neon(dbUrl);

async function checkInstructions() {
  console.log("Checking payment_instructions for Midtrans methods...");
  const rows = await sql`
    SELECT pm.id as pm_id, pm.code, pm.name, pi.id as pi_id, pi.title, pi.content 
    FROM payment_methods pm 
    LEFT JOIN payment_instructions pi ON pi.payment_method_id = pm.id 
    WHERE pm.provider = 'Midtrans' AND pm.is_active = true
    ORDER BY pm.id, pi.sort_order
  `;
  console.table(rows);
}

checkInstructions().catch(console.error);
