import express from 'express';
import crypto from 'crypto';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

function computeHash(data) {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

// POST /api/certs
router.post('/', authMiddleware, (req, res) => {
  const { holder_name, issuer, cert_date } = req.body;
  const userId = req.user.id;

  if (!holder_name) {
    return res.status(400).json({ success: false, error: 'holder_name required' });
  }

  const certData = { holder_name, issuer, cert_date, timestamp: new Date().toISOString() };
  const certHash = computeHash(certData);

  db.run(
    'INSERT INTO certificates (user_id, holder_name, issuer, cert_date, cert_hash) VALUES (?, ?, ?, ?, ?)',
    [userId, holder_name, issuer || null, cert_date || null, certHash],
    function(err) {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }

      const certId = this.lastID;

      db.get(
        'SELECT record_hash FROM ledger ORDER BY id DESC LIMIT 1',
        (err, prevRecord) => {
          const prevHash = prevRecord ? prevRecord.record_hash : null;

          db.run(
            'INSERT INTO ledger (certificate_id, record_hash, prev_hash) VALUES (?, ?, ?)',
            [certId, certHash, prevHash],
            (err) => {
              if (err) {
                return res.status(500).json({ success: false, error: err.message });
              }

              res.json({
                success: true,
                certificate: {
                  id: certId,
                  holder_name,
                  issuer,
                  cert_date,
                  cert_hash: certHash,
                  verified: false
                }
              });
            }
          );
        }
      );
    }
  );
});

// GET /api/certs/:id
router.get('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.get(
    'SELECT * FROM certificates WHERE id = ? AND user_id = ?',
    [id, userId],
    (err, cert) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }

      if (!cert) {
        return res.status(404).json({ success: false, error: 'Certificate not found' });
      }

      res.json({ success: true, certificate: cert });
    }
  );
});

// POST /api/certs/:id/verify
router.post('/:id/verify', authMiddleware, (req, res) => {
  const { id } = req.params;

  db.run(
    'UPDATE certificates SET verified = 1, verified_at = CURRENT_TIMESTAMP WHERE id = ?',
    [id],
    (err) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }

      db.get('SELECT * FROM certificates WHERE id = ?', [id], (err, cert) => {
        if (err) {
          return res.status(500).json({ success: false, error: err.message });
        }

        res.json({ success: true, certificate: cert });
      });
    }
  );
});

export default router;
