
import { AppLogo } from '@/components/shared/AppLogo';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react'; Link
import Link from 'next/link';

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <div className="flex items-center gap-2 md:hidden">
         <SidebarTrigger />
      </div>
      <div className="hidden md:block">
        <AppLogo />
      </div>
      <nav className="flex-1 flex items-center justify-end gap-4">
        {/* Placeholder for future user menu or actions */}
        <Button variant="ghost" size="icon" className="rounded-full">
          <UserCircle className="h-6 w-6" />
          <span className="sr-only">User Profile</span>
        </Button>
      </nav>
    </header>
  );
}
