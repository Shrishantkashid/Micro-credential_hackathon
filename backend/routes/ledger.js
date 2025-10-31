import express from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/ledger/:certId
router.get('/:certId', authMiddleware, (req, res) => {
  const { certId } = req.params;
  const userId = req.user.id;

  db.get(
    'SELECT id FROM certificates WHERE id = ? AND user_id = ?',
    [certId, userId],
    (err, cert) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }

      if (!cert) {
        return res.status(404).json({ success: false, error: 'Certificate not found' });
      }

      db.all(
        'SELECT id, certificate_id, record_hash, prev_hash, timestamp FROM ledger WHERE certificate_id = ? ORDER BY id ASC',
        [certId],
        (err, ledgerEntries) => {
          if (err) {
            return res.status(500).json({ success: false, error: err.message });
          }

          res.json({ success: true, ledger: ledgerEntries });
        }
      );
    }
  );
});

export default router;
