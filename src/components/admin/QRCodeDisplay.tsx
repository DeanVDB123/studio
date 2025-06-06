
"use client";

import QRCode from 'qrcode.react';
// Button and Download icon are no longer needed for this version
// import { Button } from '@/components/ui/button';
// import { Download } from 'lucide-react';

interface QRCodeDisplayProps {
  url: string;
  size?: number;
}

export function QRCodeDisplay({ url, size = 256 }: QRCodeDisplayProps) {
  // The downloadQRCode function is no longer needed as the button is removed.
  // const downloadQRCode = () => {
  //   const canvas = document.getElementById('qrcode-canvas') as HTMLCanvasElement;
  //   if (canvas) {
  //     const pngUrl = canvas
  //       .toDataURL('image/png')
  //       .replace('image/png', 'image/octet-stream');
  //     let downloadLink = document.createElement('a');
  //     downloadLink.href = pngUrl;
  //     downloadLink.download = 'memorial-qrcode.png';
  //     document.body.appendChild(downloadLink);
  //     downloadLink.click();
  //     document.body.removeChild(downloadLink);
  //   }
  // };

  return (
    <div className="flex flex-col items-center gap-2 p-1 bg-card"> {/* Reduced gap and padding */}
      <div className="p-1 bg-white rounded-sm"> {/* Reduced padding and rounding for tighter fit */}
        {/* Ensure the QRCode component receives a unique id if multiple instances are rendered on the same page without the download button relying on it. 
            However, since download is removed, a fixed ID might not be strictly necessary unless other scripts target it. For safety, let's make it dynamic or remove if unused.
            For simplicity, if ID is only for download, it can be removed.
        */}
        <QRCode value={url} size={size} level="H" includeMargin={true} />
      </div>
      {/* The descriptive text and download button are removed as per request */}
      {/* 
      <p className="text-sm text-muted-foreground text-center">
        Scan this QR code to visit the memorial page.
      </p>
      <Button onClick={downloadQRCode} variant="outline" size="sm">
        <Download className="mr-2 h-4 w-4" />
        Download QR Code
      </Button> 
      */}
    </div>
  );
}

