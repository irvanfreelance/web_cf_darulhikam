const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const dbUrl = envContent.match(/DATABASE_URL=["']?([^"'\n\r]+)["']?/)?.[1] || process.env.DATABASE_URL;

const sql = neon(dbUrl);

const defaultInstructions = {
  MIDTRANS_MANDIRI: [
    { title: "Pembayaran via Livin' by Mandiri", content: "<ol><li>Buka aplikasi Livin' by Mandiri dan pilih <strong>Bayar / Multi Payment</strong>.</li><li>Pilih penyedia jasa / masukkan kode perusahaan.</li><li>Masukkan Kode Pembayaran / Virtual Account Mandiri yang tertera.</li><li>Konfirmasi nominal tagihan dan selesaikan pembayaran dengan mPIN Anda.</li></ol>" },
    { title: "Pembayaran via ATM Mandiri", content: "<ol><li>Masukkan kartu ATM dan PIN Mandiri Anda.</li><li>Pilih <strong>Bayar/Beli</strong> &gt; <strong>Multi Payment</strong>.</li><li>Masukkan Kode Perusahaan (biller code) dan Nomor Kode Pembayaran.</li><li>Konfirmasi rincian tagihan dan tekan <strong>Ya</strong> untuk memproses.</li></ol>" }
  ],
  MIDTRANS_BNI: [
    { title: "Pembayaran via BNI Mobile Banking", content: "<ol><li>Buka aplikasi BNI Mobile Banking dan login.</li><li>Pilih menu <strong>Transfer</strong> &gt; <strong>Virtual Account Billing</strong>.</li><li>Masukkan nomor Virtual Account BNI yang tertera.</li><li>Konfirmasi rincian pembayaran dan masukkan PIN Transaksi Anda.</li></ol>" },
    { title: "Pembayaran via ATM BNI", content: "<ol><li>Masukkan kartu ATM BNI dan PIN Anda.</li><li>Pilih <strong>Menu Lainnya</strong> &gt; <strong>Transfer</strong> &gt; <strong>Virtual Account Billing</strong>.</li><li>Masukkan nomor Virtual Account BNI Anda lalu tekan <strong>Benar</strong>.</li><li>Konfirmasi rincian pembayaran dan selesaikan transaksi.</li></ol>" }
  ],
  MIDTRANS_PERMATA: [
    { title: "Pembayaran via PermataMobile X", content: "<ol><li>Buka aplikasi PermataMobile X dan login.</li><li>Pilih menu <strong>Transfer</strong> &gt; <strong>Virtual Account</strong>.</li><li>Masukkan nomor Permata Virtual Account yang tertera.</li><li>Konfirmasi rincian tagihan dan masukkan PIN / Response Code Anda.</li></ol>" },
    { title: "Pembayaran via ATM Permata / ATM Bersama", content: "<ol><li>Masukkan kartu ATM dan PIN Anda.</li><li>Pilih <strong>Transaksi Lainnya</strong> &gt; <strong>Pembayaran</strong> &gt; <strong>Virtual Account</strong>.</li><li>Masukkan nomor Virtual Account Permata Anda dan tekan <strong>Benar</strong>.</li><li>Konfirmasi rincian pembayaran dan selesaikan transaksi.</li></ol>" }
  ],
  MIDTRANS_BCA: [
    { title: "Pembayaran via m-BCA", content: "<ol><li>Buka aplikasi BCA Mobile dan login.</li><li>Pilih menu <strong>m-Transfer</strong> &gt; <strong>BCA Virtual Account</strong>.</li><li>Masukkan nomor Virtual Account BCA yang tertera lalu klik <strong>Send</strong>.</li><li>Konfirmasi rincian tagihan dan masukkan PIN m-BCA.</li></ol>" }
  ],
  MIDTRANS_BRI: [
    { title: "Pembayaran via BRImo", content: "<ol><li>Buka aplikasi BRImo dan login.</li><li>Pilih menu <strong>BRIVA</strong> &gt; <strong>Tambah Transaksi Baru</strong>.</li><li>Masukkan nomor Virtual Account BRI / BRIVA yang tertera.</li><li>Konfirmasi detail pembayaran dan masukkan PIN BRImo.</li></ol>" }
  ],
  MIDTRANS_CIMB: [
    { title: "Pembayaran via OCTO Mobile", content: "<ol><li>Buka aplikasi OCTO Mobile dan login.</li><li>Pilih menu <strong>Transfer</strong> &gt; <strong>Virtual Account</strong>.</li><li>Masukkan nomor Virtual Account CIMB Niaga yang tertera.</li><li>Konfirmasi rincian pembayaran dan masukkan PIN Mobile Anda.</li></ol>" }
  ],
  MIDTRANS_DANAMON: [
    { title: "Pembayaran via D-Bank PRO", content: "<ol><li>Buka aplikasi D-Bank PRO dan login.</li><li>Pilih menu <strong>Pembayaran</strong> &gt; <strong>Virtual Account</strong>.</li><li>Masukkan nomor Virtual Account Danamon yang tertera.</li><li>Konfirmasi pembayaran dan masukkan mPIN Anda.</li></ol>" }
  ],
  MIDTRANS_BSI: [
    { title: "Pembayaran via BSI Mobile", content: "<ol><li>Buka aplikasi BSI Mobile dan login.</li><li>Pilih menu <strong>Bayar / Transfer</strong> &gt; <strong>Virtual Account / BSI Vault</strong>.</li><li>Masukkan nomor Virtual Account BSI yang tertera.</li><li>Konfirmasi rincian pembayaran dan masukkan PIN BSI Mobile.</li></ol>" }
  ],
  MIDTRANS_QRIS_GOPAY: [
    { title: "Pembayaran via QRIS (Semua e-Wallet & M-Banking)", content: "<ol><li>Buka aplikasi e-Wallet (Gojek, DANA, OVO, ShopeePay, LinkAja) atau M-Banking Anda.</li><li>Pilih menu <strong>Scan / Bayar QRIS</strong>.</li><li>Scan QR Code yang tampil di layar atau buka Modal Pembayaran Snap.</li><li>Konfirmasi penerima dan jumlah nominal tagihan.</li><li>Masukkan PIN transaksi Anda untuk menyelesaikan pembayaran.</li></ol>" }
  ],
  GOPAY: [
    { title: "Pembayaran via GoPay / Gojek", content: "<ol><li>Klik tombol <strong>Bayar Sekarang</strong> atau tunggu modal Snap terbuka secara otomatis.</li><li>Aplikasi Gojek / GoPay akan terbuka secara otomatis di HP Anda.</li><li>Periksa rincian pembayaran donasi Anda.</li><li>Klik <strong>Bayar</strong> dan masukkan PIN GoPay Anda.</li></ol>" }
  ]
};

async function seed() {
  console.log("Syncing payment_instructions sequences...");
  try {
    await sql`SELECT setval('payment_instructions_id_seq1', (SELECT COALESCE(MAX(id), 0) + 1 FROM payment_instructions), false)`;
  } catch (e) {
    try {
      await sql`SELECT setval('payment_instructions_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM payment_instructions), false)`;
    } catch (e2) {}
  }

  console.log("Seeding payment instructions for Midtrans payment methods...");
  
  const methods = await sql`SELECT id, code, name FROM payment_methods WHERE provider = 'Midtrans'`;
  
  for (const pm of methods) {
    const code = pm.code;
    const instList = defaultInstructions[code] || defaultInstructions['MIDTRANS_MANDIRI'];

    // Delete existing instructions for this payment_method_id first
    await sql`DELETE FROM payment_instructions WHERE payment_method_id = ${pm.id}`;

    let sortOrder = 1;
    for (const inst of instList) {
      // Sync sequence before each insert to be safe
      try {
        await sql`SELECT setval('payment_instructions_id_seq1', (SELECT COALESCE(MAX(id), 0) + 1 FROM payment_instructions), false)`;
      } catch (e) {}

      await sql`
        INSERT INTO payment_instructions (payment_method_id, title, content, sort_order, created_at)
        VALUES (${pm.id}, ${inst.title}, ${inst.content}, ${sortOrder}, NOW())
      `;
      sortOrder++;
    }
    console.log(`Seeded ${instList.length} instructions for ${pm.name} (${code}) [ID: ${pm.id}]`);
  }

  console.log("Payment instructions seeding finished successfully!");
}

seed().catch(console.error);
