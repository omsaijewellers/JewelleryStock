import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function QRScanner({ onResult }) {
  const [scanning, setScanning] = useState(false);
  const qrRegionId = 'html5qr-reader';
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const start = async () => {
    setScanning(true);
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    html5QrCodeRef.current = new Html5Qrcode(qrRegionId);

    try {
      const devices = await Html5Qrcode.getCameras();
      if (!devices || devices.length === 0) {
        alert('No camera found');
        setScanning(false);
        return;
      }

      // Prefer back camera on mobile
      const backCamera = devices.find(d => d.label.toLowerCase().includes('back')) || devices[0];

      await html5QrCodeRef.current.start(
        backCamera.id,
        config,
        (decodedText) => {
          onResult(decodedText);
          // keeps scanning, do NOT stop automatically
        },
        (errorMessage) => {
          // optionally log scan errors
          // console.log('QR scan error', errorMessage);
        }
      );
    } catch (err) {
      console.error(err);
      alert('Unable to start camera. Check permissions.');
      setScanning(false);
    }
  };

  const stop = async () => {
    if (html5QrCodeRef.current) {
      await html5QrCodeRef.current.stop();
      setScanning(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {!scanning ? (
        <button onClick={start} className="px-3 py-2 border rounded text-xs">
          Open Scanner
        </button>
      ) : (
        <button onClick={stop} className="px-3 py-2 border rounded text-xs">
          Stop Scanner
        </button>
      )}
      <div
        id={qrRegionId}
        style={{ width: scanning ? 250 : 0, height: scanning ? 250 : 0 }}
      />
    </div>
  );
}
