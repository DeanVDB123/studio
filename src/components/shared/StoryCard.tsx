
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QRCodeDisplay } from '@/components/admin/QRCodeDisplay';
import { cn } from '@/lib/utils';

interface StoryCardProps {
  imageUrl: string;
  imageAlt: string;
  imageHint: string;
  name: string;
  timeline: string;
  memorialId: string;
  story: string;
  className?: string;
}

export function StoryCard({ imageUrl, imageAlt, imageHint, name, timeline, memorialId, story, className }: StoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    // This code runs only on the client-side
    if (typeof window !== 'undefined') {
      setQrCodeUrl(`${window.location.origin}/${memorialId}`);
    }
  }, [memorialId]);


  return (
    <Card className={cn("flex flex-col overflow-hidden bg-primary", className)}>
      <CardHeader className="text-center items-center bg-primary text-primary-foreground">
        <div className="relative w-1/2 aspect-square mx-auto mb-4">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover rounded-lg"
            data-ai-hint={imageHint}
          />
        </div>
        <CardTitle className="font-headline text-lg h-14 flex items-center justify-center">{name}</CardTitle>
        <p className="text-sm text-primary-foreground/80">{timeline}</p>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col pt-4 px-4 pb-4 bg-card">
        <div className="flex flex-col items-center pb-4 text-center">
          {qrCodeUrl ? (
            <>
              <Link
                href={`/${memorialId}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View memorial for ${name}`}
                className="transition-transform duration-200 hover:scale-105"
              >
                <QRCodeDisplay url={qrCodeUrl} size={100} />
              </Link>
              <p className="text-xs text-muted-foreground mt-2">
                Try it out! Scan or click the QR code
              </p>
            </>
          ) : (
            <div className="h-[124px] w-[100px]" /> // Placeholder to prevent layout shift
          )}
        </div>
        <div className={cn("relative", !isExpanded ? "h-24 overflow-hidden" : "h-auto")}>
          <p className={cn("text-foreground/90 transition-all duration-300")}>
            {story}
          </p>
          {!isExpanded && <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-card to-transparent" />}
        </div>
        <Button
          variant="link"
          onClick={() => setIsExpanded(!isExpanded)}
          className="self-start px-0 mt-auto pt-2 text-sm"
        >
          {isExpanded ? 'Read less' : 'Read more'}
        </Button>
      </CardContent>
    </Card>
  );
}
