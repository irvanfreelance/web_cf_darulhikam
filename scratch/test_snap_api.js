const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const getEnv = (key) => {
  const m = envContent.match(new RegExp(`${key}=["']?([^"'\n\r]+)["']?`));
  return m ? m[1] : process.env[key];
};

const serverKey = getEnv('MIDTRANS_SERVER_KEY');
const isProd = getEnv('MIDTRANS_IS_PRODUCTION') === 'true';

console.log("Testing Midtrans Snap API with ServerKey:", serverKey ? serverKey.slice(0, 10) + '...' : 'MISSING');

async function testSnap() {
  const snapUrl = isProd ? 'https://app.midtrans.com/snap/v1/transactions' : 'https://app.sandbox.midtrans.com/snap/v1/transactions';
  const authHeader = `Basic ${Buffer.from(serverKey + ':').toString('base64')}`;

  const body = {
    transaction_details: {
      order_id: `TEST-${Date.now()}`,
      gross_amount: 50000
    },
    enabled_payments: ['echannel'],
    customer_details: {
      first_name: 'Test Donatur',
      email: 'test@example.com',
      phone: '08123456789'
    }
  };

  const res = await fetch(snapUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  console.log("Snap Response Status:", res.status);
  console.log("Snap Response Data:", data);
}

testSnap().catch(console.error);
