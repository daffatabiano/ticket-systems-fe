# Frontend - Sistem Triage Keluhan

Frontend dashboard menggunakan Next.js 14 dengan Tailwind CSS.

## Setup

```powershell
# Install dependencies
npm install

# Kalau ada error, coba:
npm install --legacy-peer-deps
```

## Jalankan

```powershell
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Aplikasi akan jalan di: http://localhost:3000

## Konfigurasi

File `.env.local` sudah dikonfigurasikan:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# WebSocket URL (optional)
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

## Fitur

- **Dashboard** - List semua tiket dengan filter
- **New Ticket** - Form untuk submit keluhan baru
- **Ticket Detail** - View dan edit tiket
- **Color-coded Urgency** - 🔴 High, 🟡 Medium, 🟢 Low
- **Auto-refresh** - Update otomatis setiap 30 detik
- **Real-time Status** - Status tiket update otomatis

## Struktur Folder

```
src/
├── app/
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home (redirect)
│   └── tickets/
│       ├── page.tsx       # Dashboard
│       ├── new/page.tsx   # New ticket form
│       └── [id]/page.tsx  # Ticket detail
├── components/
│   ├── UrgencyBadge.tsx   # Color badge
│   ├── StatusBadge.tsx    # Status indicator
│   ├── TicketForm.tsx     # Create form
│   ├── TicketList.tsx     # List view
│   └── TicketDetail.tsx   # Detail view
└── lib/
    ├── api.ts             # API client
    ├── types.ts           # TypeScript types
    └── utils.ts           # Helper functions
```

## Troubleshooting

**npm install error:**
```powershell
# Coba dengan legacy peer deps
npm install --legacy-peer-deps

# Atau clean install
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

**Cannot connect to backend:**
- Pastikan backend jalan di http://localhost:8000
- Cek CORS settings di backend
- Restart both frontend dan backend

**Port 3000 sudah dipakai:**
```powershell
# Gunakan port lain
npm run dev -- -p 3001
```
