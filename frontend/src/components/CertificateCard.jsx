import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function CertificateCard({ certificate, onVerify }) {
  const [ledger, setLedger] = useState([]);
  const [showLedger, setShowLedger] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const fetchLedger = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/ledger/${certificate.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setLedger(response.data.ledger);
      }
    } catch (err) {
      console.error('Failed to fetch ledger:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLedger = () => {
    if (!showLedger && ledger.length === 0) {
      fetchLedger();
    }
    setShowLedger(!showLedger);
  };

  const hashPreview = certificate.cert_hash.substring(0, 16) + '...';

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
        <h3 className="text-lg font-bold truncate">{certificate.holder_name}</h3>
        <p className="text-sm text-blue-100">{certificate.issuer || 'Issuer not specified'}</p>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Verification Badge */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-600">Status:</span>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            certificate.verified
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {certificate.verified ? '✓ Verified' : 'Unverified'}
          </span>
        </div>

        {/* Certificate Date */}
        {certificate.cert_date && (
          <div>
            <span className="text-sm font-semibold text-gray-600">Date:</span>
            <p className="text-sm text-gray-700">{certificate.cert_date}</p>
          </div>
        )}

        {/* Hash Display */}
        <div>
          <span className="text-sm font-semibold text-gray-600">SHA256 Hash:</span>
          <div className="mt-1 p-2 bg-gray-100 rounded text-xs font-mono text-gray-700 break-all">
            {certificate.cert_hash}
          </div>
          <p className="text-xs text-gray-500 mt-1">First 16 chars: {hashPreview}</p>
        </div>

        {/* Ledger Info */}
        <button
          onClick={toggleLedger}
          className="w-full text-left text-sm font-semibold text-blue-600 hover:text-blue-800 mt-3 p-2 border-t border-gray-200 pt-3"
        >
          {showLedger ? '▼' : '▶'} Ledger Chain ({ledger.length})
        </button>

        {showLedger && (
          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto bg-gray-50 p-3 rounded text-xs">
            {loading ? (
              <p className="text-gray-600">Loading ledger...</p>
            ) : ledger.length === 0 ? (
              <p className="text-gray-600">No ledger entries</p>
            ) : (
              ledger.map((entry, idx) => (
                <div key={entry.id} className="border-l-2 border-blue-400 pl-2 py-1">
                  <p className="font-mono text-gray-700">Entry {idx + 1}</p>
                  <p className="text-gray-600 font-mono break-all">
                    Hash: {entry.record_hash.substring(0, 12)}...
                  </p>
                  {entry.prev_hash && (
                    <p className="text-gray-600 font-mono break-all">
                      Prev: {entry.prev_hash.substring(0, 12)}...
                    </p>
                  )}
                  <p className="text-gray-500">
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        {!certificate.verified ? (
          <button
            onClick={onVerify}
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            Verify Certificate
          </button>
        ) : (
          <div className="text-center text-green-600 font-semibold py-2">
            ✓ Verified by Issuer
          </div>
        )}
      </div>
    </div>
  );
}
