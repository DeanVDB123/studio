
import { MemorialForm } from '@/components/admin/MemorialForm';
import { QRCodeDisplay } from '@/components/admin/QRCodeDisplay';
import { getMemorialById } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Globe, Link2, AlertTriangle } from 'lucide-react'; // Added AlertTriangle
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
    let alertDescriptionText = "The memorial page you are looking for does not exist or may have been removed.";
    if (process.env.NODE_ENV === 'development') {
      alertDescriptionText += " If you're in a development environment, this could be due to a server restart clearing in-memory data. Please try returning to the dashboard and selecting the memorial again.";
    }
    return (
      <>
        <Alert variant="destructive">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Error: Memorial Not Found</AlertTitle>
          <AlertDescription>
            {alertDescriptionText}
          </AlertDescription>
        </Alert>
        <div className="mt-6 flex justify-center">
            <Button asChild>
                <Link href="/admin">Return to Dashboard</Link>
            </Button>
        </div>
      </>
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
