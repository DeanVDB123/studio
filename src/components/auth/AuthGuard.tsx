
"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import type { ReactNode} from 'react';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // If trying to access an admin route and not logged in, redirect to login
        if (pathname.startsWith('/admin')) {
          router.replace('/login');
        }
      } else {
        // If logged in and on login/signup page, redirect to admin
        if (pathname === '/login' || pathname === '/signup') {
          router.replace('/admin');
        }
      }
    }
  }, [user, loading, router, pathname]);

  if (loading || (!user && pathname.startsWith('/admin'))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Verifying Authentication...</p>
      </div>
    );
  }
  
  // If user is logged in OR if the route is not an admin route, render children
  // This also covers the case where user is null but pathname is not /admin/* (e.g. public memorial page)
  if (user || !pathname.startsWith('/admin')) {
    return <>{children}</>;
  }
  
  // Fallback, should be covered by useEffect redirect or loading state
  return null; 
}
