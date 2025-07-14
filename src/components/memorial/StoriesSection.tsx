
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquareText } from 'lucide-react';

interface StoriesSectionProps {
  stories: string[];
  template: 'classic' | 'modern';
}

export function StoriesSection({ stories, template }: StoriesSectionProps) {
  if (!stories || stories.length === 0) return null;
  
  const baseAnimation = "animate-in fade-in duration-500";

  if (template === 'classic') {
    return (
      <div className={`${baseAnimation} delay-300`}>
        <div className="flex items-center mb-6 pb-2 border-b border-primary/20">
          <MessageSquareText className="mr-3 h-7 w-7 text-primary" />
          <h2 className="font-headline text-3xl text-primary">Cherished Stories</h2>
        </div>
        <div className="space-y-6">
          {stories.map((story, index) => (
            <div key={index} className="p-4 bg-primary/5 border border-primary/10 rounded-lg shadow-sm">
              <p className="text-foreground/90 font-body leading-relaxed" dangerouslySetInnerHTML={{ __html: story.replace(/\n/g, '<br />') }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Modern Template
  return (
    <Card className={`shadow-lg ${baseAnimation} delay-300 border-0`}>
      <CardHeader className="bg-secondary/50 rounded-t-lg">
        <CardTitle className="font-headline text-3xl flex items-center">
          <MessageSquareText className="mr-3 h-7 w-7 text-primary" />
          Cherished Stories
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {stories.map((story, index) => (
          <div key={index} className="p-4 border border-border rounded-md bg-background shadow-sm">
            <p className="text-foreground/90 font-body leading-relaxed" dangerouslySetInnerHTML={{ __html: story.replace(/\n/g, '<br />') }} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
