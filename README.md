# FedAudit AI — FedEx Invoice Verification System

> Automated invoice auditing powered by Google Gemini AI.  
> Upload a FedEx PDF invoice and receive instant discrepancy detection across 5 billing dimensions — no manual rate lookup required.

---

## Overview

FedAudit AI addresses a real operational challenge: FedEx invoices are dense, multi-shipment documents where overbilling errors are easy to miss. This system extracts structured data from PDF invoices using a large language model, then validates every charge against official FedEx rate tables — flagging discrepancies with the exact expected amount and the difference in dollars.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| API Server | Node.js · Express 5 |
| AI Extraction | Google Gemini API |
| Data Storage | MongoDB · Mongoose |
| File Handling | Multer |
| Frontend | React 19 · Vite |
| State Management | Redux Toolkit |
| Styling | Tailwind CSS |

---

## Validation Engine

Five independent validators run per shipment:

| # | Check | Logic |
|---|-------|-------|
| 1 | **Zone** | Validates origin–destination zone against the FedEx zone matrix |
| 2 | **Chargeable Weight** | Recalculates dimensional weight (`L × W × H ÷ 5,000`) and compares to the billed weight |
| 3 | **Base Rate** | Looks up the correct tariff by service type, zone, packaging, and weight from export/import rate tables |
| 4 | **AHS Weight** | Validates the Additional Handling Surcharge for shipments in the 25–68 kg range |
| 5 | **Dangerous Goods** | Detects unauthorized DG surcharges |

Each validator returns a structured result: `status` (`passed` / `discrepancy` / `error`), the charged amount, the expected amount, and the difference.

---

## Architecture

The server follows **Clean Architecture** — business rules have no dependency on Express, MongoDB, or any external framework.

```
server/
├── server.js                              # Entry point, dotenv + DB init
├── app.js                                 # Express setup, middleware, routes
└── src/
    ├── config/
    │   └── db.js                          # Mongoose connection
    ├── presentation/
    │   ├── routes/
    │   │   └── invoiceRoutes.js
    │   ├── controllers/
    │   │   └── InvoiceController.js
    │   └── middleware/
    │       ├── errorHandler.js
    │       └── upload.js                  # Multer config
    ├── application/
    │   ├── useCases/
    │   │   └── ValidateInvoice.js         # Orchestrates all 5 validators
    │   └── validators/
    │       ├── ZoneValidator.js
    │       ├── ChargeableWeightValidator.js
    │       ├── BaseRateValidator.js
    │       ├── AHSWeightValidator.js
    │       └── DangerousGoodsValidator.js
    └── infrastructure/
        ├── ai/
        │   └── prompts/
        │       └── GeminiExtractor.js     # PDF → structured JSON via Gemini
        ├── db/
        │   └── mongoose/
        │       └── models/
        │           └── InvoiceModel.js    # Mongoose schema
        └── ratesTables/
            ├── exportRates.js             # FedEx export tariff tables
            ├── importRates.js             # FedEx import tariff tables
            └── zoneTable.js              # Origin–destination zone matrix

client/
└── src/
    ├── main.jsx                           # React entry point
    ├── App.jsx                            # Route / state-driven view switching
    ├── services/
    │   └── api.js                         # Axios calls to the server
    ├── store/
    │   ├── store.js                       # Redux store configuration
    │   └── invoiceSlice.js                # Upload thunk + state slice
    └── components/
        ├── UploadPage/
        │   └── UploadPage.jsx             # Drag-and-drop PDF upload
        ├── ResultsPage/
        │   ├── ResultsPage.jsx
        │   ├── InvoiceSummary.jsx         # USD / ILS totals summary
        │   ├── ShipmentCard.jsx           # Per-shipment result card
        │   └── ValidationTable.jsx        # 5-check breakdown table
        └── shared/
            ├── LoadingState.jsx
            └── StatusChip.jsx             # passed / discrepancy / error badge
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas connection string)
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

### Installation

```bash
git clone <repo-url>
cd fedaudit-ai

# Server dependencies
cd server && npm install

# Client dependencies
cd ../client && npm install
```

### Configuration

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fedaudit
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```

### Running

```bash
# Terminal 1 — API server on port 5000
cd server
npm run dev

# Terminal 2 — React client on port 5173
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## API Reference

```
POST /api/invoices/upload    Upload a PDF invoice for extraction and validation
GET  /health                 Server health check
```

**POST /api/invoices/upload**

Request: `multipart/form-data` with a `file` field containing a PDF (max 10 MB).

Response:
```json
{
  "success": true,
  "data": {
    "invoiceNumber": "123456789",
    "invoiceDate": "2024-01-15",
    "direction": "export",
    "summary": {
      "totalChargedUSD": 312.50,
      "totalExpectedUSD": 264.20,
      "diffUSD": 48.30,
      "totalChargedILS": 140,
      "totalExpectedILS": 140,
      "diffILS": 0,
      "status": "discrepancy"
    },
    "shipments": [
      {
        "trackingNumber": "7489XXXXXXXX",
        "service": "FedEx International Priority",
        "zone": "R",
        "actualWeight": 30,
        "chargeableWeight": 96.5,
        "overallStatus": "failed",
        "validations": {
          "zone":             { "status": "passed", "message": "" },
          "chargeableWeight": { "status": "discrepancy", "billed": 48.2, "expected": 96.5, "diff": 48.3, "message": "..." },
          "baseRate":         { "status": "passed", "charged": 312.50, "expected": 312.50, "diff": 0 },
          "ahsWeight":        { "status": "passed", "chargedAHS": 140, "expectedAHS": 140, "currency": "ILS" },
          "dangerousGoods":   { "status": "passed", "chargedDG": 0, "expectedDG": 0, "currency": "ILS" }
        }
      }
    ]
  }
}
```

--- 
