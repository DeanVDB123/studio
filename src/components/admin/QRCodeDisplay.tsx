
"use client";

import QRCode from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface QRCodeDisplayProps {
  url: string;
  size?: number;
}

export function QRCodeDisplay({ url, size = 256 }: QRCodeDisplayProps) {
  const downloadQRCode = () => {
    const canvas = document.getElementById('qrcode-canvas') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      let downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'memorial-qrcode.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg shadow-sm bg-card">
      <div className="p-2 bg-white rounded-md">
        <QRCode id="qrcode-canvas" value={url} size={size} level="H" includeMargin={true} />
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Scan this QR code to visit the memorial page.
      </p>
      <Button onClick={downloadQRCode} variant="outline" size="sm">
        <Download className="mr-2 h-4 w-4" />
        Download QR Code
      </Button>
    </div>
  );
}
