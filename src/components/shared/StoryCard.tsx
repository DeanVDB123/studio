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
      <div className="relative w-full aspect-square">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          data-ai-hint={imageHint}
        />
      </div>
      <CardHeader className="text-center items-center">
        <CardTitle className="font-headline text-lg">{name}</CardTitle>
        <p className="text-sm text-muted-foreground">{timeline}</p>
        <div className="pt-2">
          <QRCodeDisplay url={qrCodeUrl} size={100} />
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className={cn("flex-grow relative", !isExpanded && "max-h-24 overflow-hidden")}>
          <p className={cn("text-foreground/90 transition-all duration-300")}>
            {story}
          </p>
          {!isExpanded && <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-card to-transparent" />}
        </div>
        <Button
          variant="link"
          onClick={() => setIsExpanded(!isExpanded)}
          className="self-start px-0 mt-1 text-sm"
        >
          {isExpanded ? 'Read less' : 'Read more'}
        </Button>
      </CardContent>
    </Card>
  );
}
