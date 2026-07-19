const { Pool } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Read .env.local file to get DATABASE_URL
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('.env.local file not found!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envContent.match(/^DATABASE_URL=["']?([^"'\r\n]+)["']?/m);
if (!dbUrlMatch) {
  console.error('DATABASE_URL not found in .env.local!');
  process.exit(1);
}

const databaseUrl = dbUrlMatch[1];
console.log('Connecting to database...');

const pool = new Pool({ connectionString: databaseUrl });

async function run() {
  try {
    const sqlPath = path.join(__dirname, '..', 'refs', 'lenteradonasi_may2026.sql');
    if (!fs.existsSync(sqlPath)) {
      console.error('SQL file not found at:', sqlPath);
      process.exit(1);
    }
    
    console.log('Reading migration file...');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Clearing database tables...');
    // Drop all tables in public schema first to prevent constraint/dependency conflicts
    await pool.query(`
      DO $$ DECLARE
          r RECORD;
      BEGIN
          FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
              EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
          END LOOP;
      END $$;
    `);

    console.log('Running migrations and seeding database...');
    // We can run the entire multi-statement query at once using Neon pool
    await pool.query(sql);
    console.log('Migration and seeding completed successfully!');
  } catch (error) {
    console.error('Error running migration:', error);
  } finally {
    await pool.end();
  }
}

run();
