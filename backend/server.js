import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import db from './db.js';
import authRoutes from './routes/auth.js';
import certificateRoutes from './routes/certificates.js';
import ledgerRoutes from './routes/ledger.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/certs', certificateRoutes);
app.use('/api/ledger', ledgerRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
