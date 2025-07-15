
'use client';

import { ClassicTemplate } from '@/components/memorial/templates/ClassicTemplate';
import { RusticTemplate } from '@/components/memorial/templates/RusticTemplate';
import { SkylineTemplate } from '@/components/memorial/templates/SkylineTemplate';
import type { MemorialData } from '@/lib/types';
import type { UseFormWatch } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { MemorialFormValues } from './MemorialForm';

interface MemorialPreviewProps {
  watch: UseFormWatch<MemorialFormValues>;
}

export function MemorialPreview({ watch }: MemorialPreviewProps) {
  const watchedData = watch();

  const previewData: MemorialData = {
    deceasedName: watchedData.deceasedName || "Deceased Name",
    birthDate: watchedData.birthDate || new Date().toISOString().split('T')[0],
    deathDate: watchedData.deathDate || new Date().toISOString().split('T')[0],
    lifeSummary: watchedData.lifeSummary || "Life summary goes here...",
    biography: watchedData.biography || "Biography goes here...",
    photos: watchedData.photos || [],
    tributes: watchedData.tributes || [],
    stories: watchedData.stories || [],
    templateId: watchedData.templateId || 'classic',
  };

  const renderPreview = () => {
    const propsToPass = { memorialData: previewData, backLinkHref: '#' };
    switch (previewData.templateId) {
      case 'skyline':
        return <SkylineTemplate {...propsToPass} />;
      case 'rustic':
        return <RusticTemplate {...propsToPass} />;
      case 'classic':
      default:
        return <ClassicTemplate {...propsToPass} />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Live Preview</CardTitle>
        <CardDescription>
          This is a preview of your public memorial page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-[9/16] overflow-hidden rounded-lg border-4 border-primary bg-background shadow-inner">
          <div className="absolute inset-0 transform scale-[0.25] origin-top-left overflow-y-auto" style={{ width: '400%', height: '400%' }}>
            {renderPreview()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
