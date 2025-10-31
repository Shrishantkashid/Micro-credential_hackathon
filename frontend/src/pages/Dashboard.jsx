import React, { useState, useEffect } from 'react';
import UploadCertificate from '../components/UploadCertificate';
import CertificateCard from '../components/CertificateCard';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Dashboard({ user, onLogout }) {
  const [certificates, setCertificates] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const token = localStorage.getItem('token');

  const handleCertificateAdded = (cert) => {
    setCertificates([...certificates, cert]);
    setShowUpload(false);
  };

  const handleVerify = async (certId) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/certs/${certId}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCertificates(
          certificates.map((c) =>
            c.id === certId ? response.data.certificate : c
          )
        );
      }
    } catch (err) {
      console.error('Verify failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">ThinkSync</h1>
            <p className="text-gray-600">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={onLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          {!showUpload ? (
            <button
              onClick={() => setShowUpload(true)}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition text-lg"
            >
              + Upload Certificate
            </button>
          ) : (
            <UploadCertificate
              onCertificateAdded={handleCertificateAdded}
              onCancel={() => setShowUpload(false)}
            />
          )}
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-600 text-lg">No certificates uploaded yet</p>
              <p className="text-gray-500">Upload your first certificate to get started</p>
            </div>
          ) : (
            certificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                certificate={cert}
                onVerify={() => handleVerify(cert.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
