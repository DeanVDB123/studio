
"use client"; // Needs to be client to use router and auth context for conditional redirect

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/admin');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  // Show loading indicator while auth state is being determined
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="ml-4 text-lg">Loading...</p>
    </div>
  );
}
