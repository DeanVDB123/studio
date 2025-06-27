
"use client";

import { useState } from 'react';
import Image from 'next/image';
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
  qrCodeUrl: string;
  story: string;
  className?: string;
}

export function StoryCard({ imageUrl, imageAlt, imageHint, name, timeline, qrCodeUrl, story, className }: StoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={cn("flex flex-col overflow-hidden", className)}>
      <div className="relative w-1/2 aspect-square mx-auto mt-6">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover rounded-lg"
          data-ai-hint={imageHint}
        />
      </div>
      <CardHeader className="text-center items-center bg-primary text-primary-foreground">
        <CardTitle className="font-headline text-lg h-14 flex items-center justify-center">{name}</CardTitle>
        <p className="text-sm text-primary-foreground/80">{timeline}</p>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col pt-4 px-4 pb-4">
        <div className="flex justify-center pb-4">
          <QRCodeDisplay url={qrCodeUrl} size={100} />
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
