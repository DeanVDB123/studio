
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BiographySectionProps {
  biography: string;
  template: 'classic' | 'skyline'; // 'skyline' will be handled inside its own template for now
}

export function BiographySection({ biography, template }: BiographySectionProps) {
  if (!biography) return null;

  if (template === 'classic') {
    return (
      <div className="animate-in fade-in duration-500">
        <div 
          className="prose prose-lg max-w-none font-body text-foreground/90 leading-relaxed" 
          dangerouslySetInnerHTML={{ __html: biography.replace(/\n/g, '<br />') }} 
        />
      </div>
    );
  }

  return null;
}
