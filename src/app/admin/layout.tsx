
"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If auth is not loading and there's no user, redirect to the login page.
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  // While loading or if there's no user, show a loading screen.
  // This prevents a flash of the admin content and waits for the redirect to happen.
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Verifying Authentication...</p>
      </div>
    );
  }

  // If the user is authenticated, render the full admin layout.
  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar />
      <div className="flex flex-col flex-1 min-h-screen">
        <AdminHeader />
        <SidebarInset>
          <main className="flex-1 p-4 sm:p-6 bg-background animate-in fade-in duration-500">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
