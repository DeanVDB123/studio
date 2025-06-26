
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquareText } from 'lucide-react'; // Using MessageCircle as a story/dialogue icon

interface StoriesSectionProps {
  stories: string[];
}

export function StoriesSection({ stories }: StoriesSectionProps) {
  if (!stories || stories.length === 0) return null;

  return (
    <Card className="shadow-lg animate-in fade-in duration-500 delay-300">
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
