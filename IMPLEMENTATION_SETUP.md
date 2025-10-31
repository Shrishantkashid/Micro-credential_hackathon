# ThinkSync Implementation Setup

This document provides the complete implementation guidance for setting up the ThinkSync platform.

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install

# Create backend/server.js
# Create backend/db.js
# Create backend/middleware/auth.js
# Create backend/routes/auth.js
# Create backend/routes/certificates.js
# Create backend/routes/ledger.js
# Create backend/.env

npm start  # Runs on http://localhost:3000
```

### 2. Frontend Setup

```bash
cd frontend
npm install

# Create frontend/package.json with React, Axios, tesseract.js, Vite
# Create frontend/index.html
# Create frontend/vite.config.js
# Create frontend/src/main.jsx
# Create frontend/src/App.jsx
# Create frontend/src/pages/Login.jsx
# Create frontend/src/pages/Signup.jsx
# Create frontend/src/pages/Dashboard.jsx
# Create frontend/src/components/UploadCertificate.jsx
# Create frontend/src/components/CertificateCard.jsx
# Create frontend/.env

npm run dev  # Runs on http://localhost:5173
```

## Complete Implementation Files

### Backend Files

**backend/package.json:**
```json
{
  "name": "thinksyncs-backend",
  "version": "1.0.0",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "sqlite3": "^5.1.6",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```

**backend/server.js:**
```javascript
import express from 'express';
import cors from 'cors';
import db from './db.js';
import authRoutes from './routes/auth.js';
import certificateRoutes from './routes/certificates.js';
import ledgerRoutes from './routes/ledger.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/certs', certificateRoutes);
app.use('/api/ledger', ledgerRoutes);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**backend/db.js:**
- Initializes SQLite database
- Creates 3 tables: users, certificates, ledger
- Implements database configuration

**backend/.env:**
```
PORT=3000
JWT_SECRET=thinksyncs-secret-key-demo-change-in-production
NODE_ENV=development
```

### API Endpoints

**Authentication:**
- `POST /api/auth/signup` - Create user account
- `POST /api/auth/login` - Login and get JWT token

**Certificates:**
- `POST /api/certs` - Create certificate (computes SHA256 hash)
- `GET /api/certs/:id` - Get certificate details
- `POST /api/certs/:id/verify` - Admin verify certificate

**Ledger:**
- `GET /api/ledger/:certId` - Get immutable ledger chain

### Frontend Files

**frontend/package.json:**
```json
{
  "name": "thinksyncs-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.5.0",
    "tesseract.js": "^4.1.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.4.9"
  }
}
```

**Key React Components:**
- `pages/Login.jsx` - Login form with email/password
- `pages/Signup.jsx` - User registration
- `pages/Dashboard.jsx` - Main interface with certificate list
- `components/UploadCertificate.jsx` - Upload with OCR extraction
- `components/CertificateCard.jsx` - Certificate display with hash and ledger

## Demo Flow (30-60 seconds)

1. **Login** (5s) - Use demo@example.com / demo123
2. **Upload Certificate** (10s) - Upload image, OCR extracts fields
3. **View Hash** (5s) - See SHA256 certificate hash
4. **Check Ledger** (10s) - Show chain with prev_hash linking
5. **Verify** (5s) - Admin toggle marks as verified
6. **Refresh** (5s) - Show data persistence

## Branch Strategy

- **main** - Production code (protected)
- **frontend** - Frontend development by Person A
- **backend** - Backend development by Person B

## Success Criteria

- ✅ User can signup/login with JWT
- ✅ Upload certificate and extract OCR fields
- ✅ Certificate hash (SHA256) persists
- ✅ Ledger shows prev_hash chain
- ✅ Admin can verify certificates
- ✅ All data persists in SQLite
- ✅ Demo completes in 30-60 seconds

## Database Schema

**users table:**
- id (PRIMARY KEY)
- email (UNIQUE)
- password_hash
- name
- created_at

**certificates table:**
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- holder_name
- issuer
- cert_date
- cert_hash (SHA256)
- verified (BOOLEAN)
- verified_at
- created_at

**ledger table:**
- id (PRIMARY KEY)
- certificate_id (FOREIGN KEY)
- record_hash (SHA256)
- prev_hash (links to previous entry)
- timestamp

## Environment Variables

**Backend (.env):**
- PORT=3000
- JWT_SECRET=your-secret-key
- NODE_ENV=production

**Frontend (.env):**
- VITE_API_URL=http://localhost:3000

## Deployment

See DEPLOYMENT.md for:
- Heroku deployment
- Vercel frontend hosting
- Docker containerization
- Database migration to PostgreSQL

## Testing

```bash
# Health check
curl http://localhost:3000/health

# Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Test create certificate
curl -X POST http://localhost:3000/api/certs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{"holder_name":"John Doe","issuer":"MIT","cert_date":"2024-10-31"}'
```

## Troubleshooting

- **Port already in use:** Kill existing process or use different port
- **OCR timeout:** First load is slow (6MB model), works offline after
- **Database locked:** Delete database file and restart backend
- **CORS errors:** Check API URL in frontend .env

## Next Steps

1. Switch to `frontend` branch for UI development
2. Switch to `backend` branch for API development
3. Test locally with both running
4. Create PRs to merge to main
5. Deploy to production
