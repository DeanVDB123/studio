
import { MemorialForm } from '@/components/admin/MemorialForm';
import { QRCodeDisplay } from '@/components/admin/QRCodeDisplay';
import { getMemorialById } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Globe, Link2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface EditMemorialPageProps {
  params: {
    memorialId: string;
  };
}

export default async function EditMemorialPage({ params }: EditMemorialPageProps) {
  const memorialId = params.memorialId;
  const memorialData = await getMemorialById(memorialId);

  if (!memorialData) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Memorial page not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const permalink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/memorial/${memorialId}`;

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-headline mb-8">Edit Memorial: {memorialData.deceasedName}</h1>
        <MemorialForm initialData={memorialData} memorialId={memorialId} />
      </div>
      <div className="lg:col-span-1 space-y-6 lg:pt-20">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center">
              <Link2 className="mr-2 h-5 w-5 text-primary" /> Permalink
            </CardTitle>
            <CardDescription>This is the permanent link to the memorial page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={permalink} target="_blank" className="text-primary hover:underline break-all block">
              {permalink}
            </Link>
             <Button asChild variant="outline" size="sm" className="mt-2">
              <Link href={permalink} target="_blank">
                <Globe className="mr-2 h-4 w-4" /> Visit Page
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
           <CardHeader>
            <CardTitle className="font-headline text-xl">QR Code</CardTitle>
             <CardDescription>Share this QR code for easy access.</CardDescription>
          </CardHeader>
          <CardContent>
            <QRCodeDisplay url={permalink} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
