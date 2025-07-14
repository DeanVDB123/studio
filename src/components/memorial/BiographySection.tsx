
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenText } from 'lucide-react';

interface BiographySectionProps {
  biography: string;
  template: 'classic' | 'modern';
}

export function BiographySection({ biography, template }: BiographySectionProps) {
  if (!biography) return null;

  if (template === 'classic') {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="flex items-center mb-6 pb-2 border-b border-primary/20">
            <BookOpenText className="mr-3 h-7 w-7 text-primary" />
            <h2 className="font-headline text-3xl text-primary">Life Story</h2>
        </div>
        <div className="prose prose-lg max-w-none font-body text-foreground/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: biography.replace(/\n/g, '<br />') }} />
      </div>
    );
  }

  // Modern Template
  return (
    <Card className="shadow-lg animate-in fade-in duration-500 border-0">
      <CardHeader className="bg-secondary/50 rounded-t-lg">
        <CardTitle className="font-headline text-3xl flex items-center">
          <BookOpenText className="mr-3 h-7 w-7 text-primary" />
          Life Story
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="prose prose-lg max-w-none font-body text-foreground/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: biography.replace(/\n/g, '<br />') }} />
      </CardContent>
    </Card>
  );
}
