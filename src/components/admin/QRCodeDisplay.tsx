
"use client";

import QRCode from 'qrcode.react';
import { useState, useEffect } from 'react';

interface QRCodeDisplayProps {
  url: string;
  size?: number;
}

export function QRCodeDisplay({ url, size = 256 }: QRCodeDisplayProps) {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const logoSrc = "/hlbwb.png";

  useEffect(() => {
    const img = new Image();
    img.src = logoSrc;
    img.onload = () => {
      setLogoLoaded(true);
    };
    // If the image is already cached by the browser, the onload event might not fire consistently.
    // This check handles the cached scenario.
    if (img.complete) {
      setLogoLoaded(true);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const imageSettings = {
    src: logoSrc,
    height: size * 0.2, // Logo height is 20% of QR code size
    width: size * 0.2,  // Logo width is 20% of QR code size
    excavate: true,     // Clears space for the logo
  };

  return (
    <div className="flex flex-col items-center gap-2 p-1 bg-card">
      <div className="p-1 bg-white rounded-sm">
        {logoLoaded ? (
            <QRCode 
              value={url} 
              size={size} 
              level="H" // High error correction for logo
              includeMargin={true} 
              imageSettings={imageSettings}
            />
        ) : (
          // Placeholder to prevent layout shift while the logo loads for the first time
          <div style={{ width: size, height: size }} className="bg-white" />
        )}
      </div>
    </div>
  );
}
