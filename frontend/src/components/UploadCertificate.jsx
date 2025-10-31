import React, { useState } from 'react';
import { Tesseract } from 'tesseract.js';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function UploadCertificate({ onCertificateAdded, onCancel }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [ocrData, setOcrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedFields, setExtractedFields] = useState({
    holder_name: '',
    issuer: '',
    cert_date: '',
  });
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError('');
    setOcrData(null);
    setExtractedFields({ holder_name: '', issuer: '', cert_date: '' });

    await runOCR(selectedFile);
  };

  const runOCR = async (imageFile) => {
    setLoading(true);
    try {
      const { data: { text } } = await Tesseract.recognize(imageFile, 'eng', {
        logger: (m) => console.log('OCR:', m),
      });

      setOcrData(text);

      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

      setExtractedFields({
        holder_name: lines[0] || '',
        issuer: lines.find(l => l.includes('Issuer') || l.includes('issuer')) || lines[1] || '',
        cert_date: lines.find(l => /\d{4}|\d{1,2}\/\d{1,2}/.test(l)) || '',
      });
    } catch (err) {
      setError('OCR extraction failed: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setExtractedFields({ ...extractedFields, [field]: value });
  };

  const handleSave = async () => {
    if (!extractedFields.holder_name) {
      setError('Holder name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/certs`,
        extractedFields,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        onCertificateAdded(response.data.certificate);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Certificate</h2>

      {!file ? (
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center mb-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
          />
          <label htmlFor="file-input" className="cursor-pointer">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-lg text-gray-700 font-semibold mb-2">Click to upload or drag and drop</p>
            <p className="text-gray-500">PNG, JPG, or PDF (up to 10MB)</p>
          </label>
        </div>
      ) : (
        <>
          {/* Preview */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Certificate Preview</h3>
            <img
              src={preview}
              alt="Certificate preview"
              className="max-h-64 mx-auto rounded border border-gray-300"
            />
          </div>

          {/* OCR Results */}
          {loading && (
            <div className="mb-6 text-center">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <p className="text-gray-600 mt-2">Extracting text from image...</p>
            </div>
          )}

          {ocrData && !loading && (
            <div className="mb-6 space-y-4">
              <h3 className="font-semibold text-gray-700">Extracted Information</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Holder Name</label>
                <input
                  type="text"
                  value={extractedFields.holder_name}
                  onChange={(e) => handleFieldChange('holder_name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issuer</label>
                <input
                  type="text"
                  value={extractedFields.issuer}
                  onChange={(e) => handleFieldChange('issuer', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="text"
                  value={extractedFields.cert_date}
                  onChange={(e) => handleFieldChange('cert_date', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <details className="bg-gray-50 p-4 rounded">
                <summary className="cursor-pointer font-semibold text-gray-700">Raw OCR Text</summary>
                <pre className="mt-3 text-sm text-gray-600 overflow-auto max-h-40">{ocrData}</pre>
              </details>
            </div>
          )}

          {error && <div className="mb-6 text-red-500 bg-red-50 p-3 rounded">{error}</div>}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={loading || !extractedFields.holder_name}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition"
            >
              {loading ? 'Saving...' : 'Save Certificate'}
            </button>
            <button
              onClick={() => {
                setFile(null);
                setPreview(null);
                setOcrData(null);
                onCancel();
              }}
              disabled={loading}
              className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 disabled:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
