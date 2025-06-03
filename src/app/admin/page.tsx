
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit3, ExternalLink } from 'lucide-react';
import { getAllMemorials } from '@/lib/data';

export const dynamic = 'force-dynamic'; // Ensure fresh data on each request

export default async function AdminDashboardPage() {
  const memorials = await getAllMemorials();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline">Admin Dashboard</h1>
        <Button asChild>
          <Link href="/admin/create">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Memorial
          </Link>
        </Button>
      </div>

      {memorials.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle className="text-2xl">No Memorials Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-lg">
              Start by creating a new memorial page for a loved one.
            </CardDescription>
          </CardContent>
          <CardFooter className="justify-center">
             <Button asChild className="mt-4">
              <Link href="/admin/create">
                <PlusCircle className="mr-2 h-5 w-5" /> Create Memorial
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {memorials.map((memorial) => (
            <Card key={memorial.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline text-xl">{memorial.deceasedName}</CardTitle>
                <CardDescription>ID: {memorial.id}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">Manage this memorial page.</p>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/edit/${memorial.id}`}>
                    <Edit3 className="mr-2 h-4 w-4" /> Edit
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/memorial/${memorial.id}`} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" /> View Page
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
