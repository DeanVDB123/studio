
"use client";

import QRCode from 'qrcode.react';

interface QRCodeDisplayProps {
  url: string;
  size?: number;
}

export function QRCodeDisplay({ url, size = 256 }: QRCodeDisplayProps) {
  const imageSettings = {
    src: "/lhbwb.png",
    height: size * 0.2, // Logo height is 20% of QR code size
    width: size * 0.2,  // Logo width is 20% of QR code size
    excavate: true,     // Clears space for the logo
  };

  return (
    <div className="flex flex-col items-center gap-2 p-1 bg-card"> {/* Reduced gap and padding */}
      <div className="p-1 bg-white rounded-sm"> {/* Reduced padding and rounding for tighter fit */}
        <QRCode 
          value={url} 
          size={size} 
          level="H" // High error correction for logo
          includeMargin={true} 
          imageSettings={imageSettings}
        />
      </div>
    </div>
  );
}
