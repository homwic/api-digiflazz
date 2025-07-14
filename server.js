const express = require("express");
const bodyParser = require("body-parser");
const Digiflazz = require("./Digiflazz");

const app = express();
app.use(bodyParser.json());

// Ganti dengan data akun Digiflazz kamu
const username = "linateWjqMOD";
const apiKey = "dev-3653ef90-2f10-11f0-9706-0fdf1090fc13";
const webhookKey = "ISI_WEBHOOK_KEY";

const digi = new Digiflazz(username, apiKey, webhookKey);

// ======= Endpoint Cek Saldo =======
app.get("/saldo", async (req, res) => {
  try {
    const saldo = await digi.cekSaldo();
    res.json({ success: true, saldo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ======= Endpoint Daftar Harga =======
app.get("/harga", async (req, res) => {
  try {
    const harga = await digi.daftarHarga();
    res.json({ success: true, data: harga });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ======= Endpoint Deposit =======
app.post("/deposit", async (req, res) => {
  const { amount, bank, name } = req.body;
  if (!amount || !bank || !name) {
    return res
      .status(400)
      .json({ success: false, error: "amount, bank, dan name harus diisi" });
  }
  try {
    const result = await digi.deposit(amount, bank, name);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ======= Endpoint Transaksi via POST JSON Body =======
app.post("/transaksi", async (req, res) => {
  const { sku, customer, refID, cmd, msg } = req.body;
  if (!sku || !customer || !refID) {
    return res
      .status(400)
      .json({ success: false, error: "sku, customer, dan refID harus diisi" });
  }
  try {
    const result = await digi.transaksi(sku, customer, refID, cmd, msg);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ======= Endpoint Transaksi via GET Query Params =======
app.get("/transaksi", async (req, res) => {
  const { sku, customer, refID, cmd, msg } = req.query;
  if (!sku || !customer || !refID) {
    return res
      .status(400)
      .json({ success: false, error: "sku, customer, dan refID harus diisi" });
  }
  try {
    const result = await digi.transaksi(sku, customer, refID, cmd, msg);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ======= Endpoint Webhook =======
app.post("/webhook", (req, res, next) => {
  digi.onWebhook(req, res, next);
});

// ======= Jalankan Server =======
const PORT = 1500;
app.listen(PORT, () => {
  console.log(`🚀 Server API Digiflazz berjalan di http://localhost:${PORT}`);
});
