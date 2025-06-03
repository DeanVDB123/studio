
import Image from 'next/image';
import type { Photo } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera } from 'lucide-react';

interface PhotoGallerySectionProps {
  photos: Photo[];
}

export function PhotoGallerySection({ photos }: PhotoGallerySectionProps) {
  if (!photos || photos.length === 0) return null;

  return (
    <Card className="shadow-lg animate-in fade-in duration-500 delay-100">
      <CardHeader className="bg-secondary/50 rounded-t-lg">
        <CardTitle className="font-headline text-3xl flex items-center">
          <Camera className="mr-3 h-7 w-7 text-primary" />
          Photo Memories
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div key={photo.id || index} className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <Image
                src={photo.url}
                alt={photo.caption || `Memory ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="transform group-hover:scale-105 transition-transform duration-300"
                data-ai-hint="person memory"
              />
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {photo.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
