
"use client";

import { MemorialForm } from '@/components/admin/MemorialForm';
import { useRouter } from 'next/navigation';

export default function CreateMemorialPage() {
  const router = useRouter();

  const handleSaveSuccess = (memorialId: string) => {
    router.push(`/edit/${memorialId}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-headline mb-8 text-center">Create New Memorial Page</h1>
      <MemorialForm 
        onFormDirtyChange={() => {}} // No-op for create page
        getFormSubmitHandler={() => () => {}} // No-op for create page
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
}
