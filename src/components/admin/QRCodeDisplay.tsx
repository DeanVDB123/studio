
"use client";

import QRCode from 'qrcode.react';

interface QRCodeDisplayProps {
  url: string;
  size?: number;
}

export function QRCodeDisplay({ url, size = 256 }: QRCodeDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-2 p-1 bg-card"> {/* Reduced gap and padding */}
      <div className="p-1 bg-white rounded-sm"> {/* Reduced padding and rounding for tighter fit */}
        <QRCode value={url} size={size} level="H" includeMargin={true} />
      </div>
    </div>
  );
}
