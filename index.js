import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.ADMIN_CHAT_ID;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

app.get("/", (req, res) => {
  res.send("🤖 Sylphastore Bot is Running!");
});

app.post("/api/order", async (req, res) => {
  const { game, id, paket, pay } = req.body;
  const message = `
🧾 *Order Baru Masuk!*
━━━━━━━━━━━━━━━
🎮 *Game:* ${game}
🆔 *ID:* ${id}
💎 *Paket:* ${paket}
💰 *Pembayaran:* ${pay}
⏰ *Waktu:* ${new Date().toLocaleString('id-ID')}
━━━━━━━━━━━━━━━
🚀 *Segera proses pesanan ini ya admin!*
`;

  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "Markdown"
    })
  });

  res.json({ success: true });
});

app.post(`/webhook/${TOKEN}`, async (req, res) => {
  const msg = req.body.message;
  if (!msg) return res.sendStatus(200);

  const chatId = msg.chat.id;
  const text = msg.text?.toLowerCase() || "";

  if (text === "/start") {
    await sendMessage(chatId, "🌙 Halo, aku *Sylphastore Bot*! Gunakan perintah berikut:\n\n🧾 /pesanan — Lihat pesanan terbaru\n💬 /bantuan — Info admin");
  } else if (text === "/bantuan") {
    await sendMessage(chatId, "Untuk bantuan, hubungi admin: @Sylphaceyy ✨");
  } else if (text === "/pesanan") {
    await sendMessage(chatId, "📦 Fitur laporan pesanan akan tersedia di versi berikutnya ⚙️");
  }

  res.sendStatus(200);
});

async function sendMessage(chatId, text) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" })
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Bot aktif di port ${PORT}`));
