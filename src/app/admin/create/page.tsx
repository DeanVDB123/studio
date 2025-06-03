
import { MemorialForm } from '@/components/admin/MemorialForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateMemorialPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-headline mb-8 text-center">Create New Memorial Page</h1>
      <MemorialForm />
    </div>
  );
}
