
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';

interface TributesSectionProps {
  tributes: string[];
  template: 'classic' | 'modern';
}

export function TributesSection({ tributes, template }: TributesSectionProps) {
  if (!tributes || tributes.length === 0) return null;

  const baseAnimation = "animate-in fade-in duration-500";

  if (template === 'classic') {
    return (
        <div className={`${baseAnimation} delay-200`}>
            <div className="flex items-center mb-6 pb-2 border-b border-primary/20">
                <Heart className="mr-3 h-7 w-7 text-primary" />
                <h2 className="font-headline text-3xl text-primary">Loving Tributes</h2>
            </div>
            <div className="space-y-6">
                {tributes.map((tribute, index) => (
                    <blockquote key={index} className="p-6 border-l-4 border-primary bg-primary/5 rounded-r-lg shadow-sm">
                        <p className="italic text-foreground/80 font-body leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: `&ldquo;${tribute.replace(/\n/g, '<br />')}&rdquo;` }} />
                    </blockquote>
                ))}
            </div>
        </div>
    );
  }

  // Modern Template
  return (
    <Card className={`shadow-lg ${baseAnimation} delay-200 border-0`}>
      <CardHeader className="bg-secondary/50 rounded-t-lg">
        <CardTitle className="font-headline text-3xl flex items-center">
          <Heart className="mr-3 h-7 w-7 text-primary" />
          Loving Tributes
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {tributes.map((tribute, index) => (
          <blockquote key={index} className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-md shadow-sm">
            <p className="italic text-foreground/80 font-body leading-relaxed" dangerouslySetInnerHTML={{ __html: `&ldquo;${tribute.replace(/\n/g, '<br />')}&rdquo;` }} />
          </blockquote>
        ))}
      </CardContent>
    </Card>
  );
}
