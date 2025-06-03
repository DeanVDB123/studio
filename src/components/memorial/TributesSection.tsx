
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react'; // Using Heart as a general positive icon

interface TributesSectionProps {
  tributes: string[];
}

export function TributesSection({ tributes }: TributesSectionProps) {
  if (!tributes || tributes.length === 0) return null;

  return (
    <Card className="shadow-lg animate-in fade-in duration-500 delay-200">
      <CardHeader className="bg-secondary/50 rounded-t-lg">
        <CardTitle className="font-headline text-3xl flex items-center">
          <Heart className="mr-3 h-7 w-7 text-primary" />
          Loving Tributes
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {tributes.map((tribute, index) => (
          <blockquote key={index} className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-md shadow-sm">
            <p className="italic text-foreground/80 font-body leading-relaxed">&ldquo;{tribute}&rdquo;</p>
          </blockquote>
        ))}
      </CardContent>
    </Card>
  );
}
