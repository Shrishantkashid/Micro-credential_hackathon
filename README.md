# 🚀 ThinkSync: Hackathon Project  
### Blockchain-Based Academic Certificate Verification (Problem #29)

*Team:* ThinkSync  
*Core Goal:* To create a secure, multi-layered platform for aggregating, validating, and managing all types of user credentials.

---

## 💡 MVP SUMMARY (Minimal Demoable Product)

*Objective:* Build a tight, demoable product that proves the idea of immutability and verification for an uploaded certificate.

| Feature | Description | Status |
|----------|--------------|--------|
| User Flow | Sign up, Login, Upload Certificate | ✅ CORE |
| Data Extraction | OCR (using tesseract.js) extracts Name, Issuer, Date | ✅ CORE |
| Security Proof | Compute Certificate Hash (SHA256) and store in Append-Only Ledger | ✅ CORE (Proof of Immutability) |
| Verification Demo | Dashboard displays Certificate Hash, Ledger Chain, and Verification Status badge | ✅ CORE |
| Future Callouts | Gmail Scanning, Hyperledger Fabric, Web Scraping, Advanced Forensics | 🕒 Mention in slides only |

---

## 🛠 TECH STACK (Optimized for Speed)

| Layer | Technology | Rationale |
|--------|-------------|------------|
| Frontend | React (Vite) + Tailwind CDN | Fastest setup, clean UI |
| Backend | Node.js + Express | Rapid development, high performance |
| Database | SQLite | Lightweight, file-based, instant setup |
| OCR | tesseract.js (Client-side) | Avoids heavy server setup, works independently |
| Auth | Simple Email/Password (JWT) | Secure and minimal setup |
| Immutability Demo | Append-Only Table (DB) | Simulates blockchain ledger chaining |

---

## 👥 ROLES & PARALLEL WORKPLAN

| Role | Person A | Person B |
|------|-----------|----------|
| Focus | Frontend, OCR, Demo UI | Backend, DB, Ledger, Deployment |
| Responsibilities | User experience, data extraction, status display, demo prep | API endpoints, security, data models, hash computation, deployment |
| Parallelization | Uses mock APIs until backend ready | Focuses purely on logic and models |

---

## ⏰ HACKATHON TASK PLAN (Hour-by-Hour)

### 🌅 Morning — Setup & Skeleton (2.0 hours)

| Task | Time | Owner | Deliverable |
|------|------|--------|-------------|
| A1 | 30m | Both | Git repo, branches, README.md |
| A2 | 30m | Person B | Init Express app, setup SQLite, create DB schema |
| A3 | 30m | Person A | Init React app, basic layout (Login/Signup, Dashboard, Upload) |
| A4 | 30m | Both | Finalize API contract (JSON shapes) |

---

### ☀ Late Morning — Core Flows Parallel (3.0 hours)

| Task | Time | Owner | Deliverable |
|------|------|--------|-------------|
| B1 | 90m | Person B | Implement backend endpoints: Auth, POST/GET /api/certs, admin verify toggle |
| A1 | 90m | Person A | Implement Upload + OCR with tesseract.js, extract fields, store metadata |
| Parallel | — | Both | Prepare 2–3 sample certificates for demo data |

---

### 🌇 Early Afternoon — Ledger + Verification UI (1.5 hours)

| Task | Time | Owner | Deliverable |
|------|------|--------|-------------|
| B2 | 45m | Person B | Implement ledger chaining logic (SHA256) and GET /api/ledger/:certId |
| A2 | 45m | Person A | Build certificate card UI, show hash, badge, ledger chain display |

---

### 🌆 Mid Afternoon — Connect, Polish, Fallback (1.5 hours)

| Task | Time | Owner | Deliverable |
|------|------|--------|-------------|
| B3 | 45m | Person B | Add auth middleware, CORS, validation, finalize admin verify route |
| A3 | 45m | Person A | Add manual field editing (OCR fallback), progress indicators, walkthrough demo |

---

### 🌃 Late Afternoon — Testing, Deployment, Demo Prep (2.0 hours)

| Task | Time | Owner | Deliverable |
|------|------|--------|-------------|
| B4 | 60m | Person B | Deploy backend (Render/Heroku), seed DB |
| A4 | 60m | Person A | Deploy frontend (Vercel/Netlify), connect API, final testing |

---

### 🌙 Evening — Final Polish, Slides, and Backup (2.0 hours)

| Task | Time | Owner | Deliverable |
|------|------|--------|-------------|
| Both | 60m | Both | Create 4–6 slide deck (Problem, Architecture, Demo Flow, Future Work) |
| Both | 60m | Both | Record 2–3 minute demo video (backup plan) |

---

## 🔑 CONCRETE API & DB SCHEMA

### 🗄 Database Tables (SQLite)

| Table | Purpose | Key Fields |
|--------|----------|------------|
| users | Authentication | id, email, password_hash, name |
| certificates | Stores metadata and file hash | id, user_id, holder_name, cert_hash, verified_bool |
| ledger | Simulated Immutable Chain | id, certificate_id, record_hash, prev_hash, timestamp |

---

### 🌐 Key Endpoints

| Endpoint | Method | Function |
|-----------|---------|-----------|
| /api/auth/signup | POST | Create new user (returns JWT) |
| /api/auth/login | POST | Authenticate user (returns JWT) |
| /api/certs | POST | Upload certificate, compute/store hash |
| /api/certs/:id | GET | Retrieve certificate details |
| /api/ledger | POST | Append new record to ledger chain |
| /api/certs/:id/verify | POST | Admin toggle to mark as verified |

---

## 🎬 DEMO SCRIPT (30–60s)

1. Login as demo user.  
2. Upload certificate image → OCR extracts fields (with manual correction).  
3. Click *“Save”* → Certificate Hash computed and stored.  
4. Click *“Record on Ledger”* → Ledger chain updates with visible prev_hash.  
5. Admin toggles *“Verified by Issuer”* → Badge turns green.  
6. (Optional) Show raw ledger JSON to highlight chained hash structure.

---

## ❗ FINAL TIPS & FALLBACKS

- *Focus:* Prioritize immutability proof — make the ledger chaining visually clear.  
- *Fallback:* If OCR fails, allow manual data entry.  
- *Backup:* Record a polished demo video as a submission fallback.  
- *Talking Points:* Mention scalability — Hyperledger Fabric, Gmail Aggregator, Advanced Forensics.

---

### 🧭 Quick Navigation
- 🚀 ThinkSync: Hackathon Project Blueprint (24-Hour Plan)  
- 💡 MVP SUMMARY  
- 🛠 TECH STACK  
- 👥 ROLES & PARALLEL WORKPLAN  
- ⏰ HACKATHON TASK PLAN  
- 🔑 API & DB SCHEMA  
- 🎬 DEMO SCRIPT  
- ❗ FINAL TIPS & FALLBACKS
