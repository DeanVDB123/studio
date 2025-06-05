
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
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
    </AuthGuard>
  );
}
