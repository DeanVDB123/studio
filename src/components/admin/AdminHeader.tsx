
"use client"; // Make it a client component to use useAuth

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { UserCircle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


export function AdminHeader() {
  const { user, userStatus, logOut: contextLogOut, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await contextLogOut();
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push('/login');
    } catch (error) {
      toast({ title: "Logout Failed", description: "Could not log out. Please try again.", variant: "destructive" });
      console.error("Logout error:", error);
    }
  };

  const getBadgeVariant = (status: string | null) => {
    switch (status?.toUpperCase()) {
      case 'ADMIN':
        return 'admin' as const;
      case 'PAID':
        return 'outline' as const;
      case 'SUSPENDED':
        return 'suspended' as const;
      default:
        return 'secondary' as const;
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-primary bg-primary px-4 text-primary-foreground sm:px-6">
      <div className="flex items-center gap-2 md:hidden">
         <SidebarTrigger className="text-primary-foreground hover:bg-primary-foreground/10" />
      </div>
      <nav className="flex-1 flex items-center justify-end gap-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-auto flex items-center gap-2 rounded-full px-2 hover:bg-secondary hover:text-secondary-foreground">
                <UserCircle className="h-6 w-6" />
                <span className="text-sm hidden sm:inline">{user.email}</span>
                 {userStatus && userStatus.toUpperCase() !== 'FREE' && (
                  <Badge
                    variant={getBadgeVariant(userStatus)}
                    className={cn(
                      "hidden sm:inline-flex",
                      userStatus.toUpperCase() === 'PAID' && "bg-primary-foreground text-primary hover:bg-primary-foreground"
                    )}
                  >
                    {userStatus.toUpperCase()}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Account</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                  {userStatus && userStatus.toUpperCase() !== 'FREE' && (
                     <div className="flex items-center pt-2">
                       <Badge variant={getBadgeVariant(userStatus)}>
                         {userStatus.toUpperCase()}
                       </Badge>
                    </div>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} disabled={loading} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild variant="outline">
            <Link href="/login">Log In</Link>
          </Button>
        )}
      </nav>
    </header>
  );
}
