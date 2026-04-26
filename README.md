# WanderlustID — Travel Chatbot 🌏

WanderlustID adalah chatbot travelling berbasis AI yang membantu pengguna merencanakan trip, menemukan destinasi wisata, dan mendapatkan tips traveling — semua dalam Bahasa Indonesia yang santai dan penuh semangat.

> Powered by Google Gemini AI · Built with Express.js · Runs on Bun or Node.js

---

## ✨ Features

- 💬 **AI Travel Assistant** — Didukung Google Gemini, chatbot ini menjawab pertanyaan seputar destinasi wisata lokal & internasional, itinerary, kuliner, transportasi, akomodasi, dan budgeting.
- ⚡ **Quick Reply Chips** — Tombol pertanyaan cepat untuk memulai percakapan (itinerary, budget trip, kuliner lokal, healing weekend).
- 📝 **Markdown Rendering** — Jawaban AI dirender sebagai Markdown yang rapi menggunakan `marked` + `DOMPurify` untuk keamanan.
- 🔄 **Retry on Error** — Tombol retry otomatis muncul ketika request gagal.
- 🌐 **CORS Configurable** — Origin CORS dapat dikonfigurasi lewat environment variable.

---

## 🗂️ Project Structure

```
wanderlustid-travel-chatbot/
├── index.js          # Express server & Gemini AI integration
├── package.json      # Dependencies & scripts
├── .env.example      # Template environment variables
├── .env              # Environment variables (tidak di-commit)
└── public/
    ├── index.html    # Frontend UI
    ├── script.js     # Frontend logic (fetch, render, retry)
    └── style.css     # Styling (Poppins font, chat bubbles, animations)
```

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) **atau** Node.js ≥ 18
- Google Gemini API Key ([dapatkan di sini](https://aistudio.google.com/app/apikey))

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/wanderlustid-travel-chatbot.git
cd wanderlustid-travel-chatbot

# Install dependencies (pilih salah satu)
bun install
# atau
npm install
```

### Configuration

Salin file `.env.example` menjadi `.env` dan isi nilai yang diperlukan:

```bash
cp .env.example .env
```

```env
GEMINI_API_KEY=your_gemini_api_key_here   # Wajib — API key dari Google AI Studio
GEMINI_MODEL=gemini-2.5-flash-lite        # Opsional — default: gemini-2.0-flash
CORS_ORIGIN=*                             # Opsional — default: * (semua origin)
PORT=3000                                 # Opsional — default: 3000
PUBLIC_APP_URL=http://localhost            # Opsional — URL publik aplikasi
```

### Running the App

```bash
# Menggunakan Bun
bun start

# Menggunakan Node.js
npm start
```

Buka browser dan akses: **http://localhost:3000**

---

## 🔌 API

### `POST /api/chat`

Mengirim pesan ke chatbot.

**Request Body:**
```json
{
  "prompt": "Rekomendasi tempat camping dekat Bandung"
}
```

**Response (200):**
```json
{
  "text": "Siap, Petualang! Dekat Bandung, aku rekomendasikan..."
}
```

**Response (400)** — prompt kosong atau bukan string:
```json
{
  "error": "Permintaan sedang bermasalah nih."
}
```

**Response (500)** — API key tidak ditemukan atau Gemini error:
```json
{
  "error": "Lagi ada gangguan nih."
}
```

---

## 🧠 Chatbot Behavior

Chatbot WanderlustID dirancang dengan **sistem prompt** yang membatasi topik hanya pada konteks traveling:

| ✅ Dijawab | ❌ Tidak Dijawab |
|---|---|
| Rekomendasi destinasi wisata | Politik, agama, SARA |
| Tips packing & persiapan | Kesehatan medis & diagnosa |
| Transportasi & rute perjalanan | Keuangan pribadi & investasi |
| Akomodasi (hotel, homestay, camping) | Tugas akademik & coding |
| Kuliner khas destinasi | Konten dewasa / kekerasan |
| Perencanaan itinerary & budgeting | Opini tentang figur publik |
| Cuaca, musim, & budaya lokal | |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js / Bun |
| Backend | Express.js 5 |
| AI | Google Gemini (`@google/genai`) |
| Config | dotenv |
| CORS | cors |
| Frontend | Vanilla HTML, CSS, JavaScript |
| Fonts | Google Fonts — Poppins |
| Markdown | marked + DOMPurify |

---

## 📄 License

ISC
