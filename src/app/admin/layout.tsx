
"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, createContext, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

// Create a context to share the dirty state and navigation handling
export const UnsavedChangesContext = createContext({
  isDirty: false,
  handleNavigation: (path: string) => {},
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isDirty, setIsDirty] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [nextPath, setNextPath] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  const handleNavigation = (path: string) => {
    const editPageRegex = /^\/edit\/[a-zA-Z0-9_-]+$/;
    // We only care about this logic on the edit page.
    if (window.location.pathname.match(editPageRegex) && isDirty) {
      setNextPath(path);
      // The dialog will be shown by the edit page component itself,
      // which has access to the form's save handler.
      // This context is primarily for the sidebar to signal an intent to navigate.
      // A more robust solution might use a global state manager.
      const event = new CustomEvent('request-navigation-prompt', { detail: { nextPath: path } });
      window.dispatchEvent(event);

    } else {
      router.push(path);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Verifying Authentication...</p>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar handleNavigation={handleNavigation} />
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
