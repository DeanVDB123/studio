
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Added useRouter
import { AppLogo } from '@/components/shared/AppLogo';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { LayoutDashboard, PlusCircle, LogOut, Loader2 } from 'lucide-react'; // Added Loader2
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';


const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/create', label: 'New Memorial', icon: PlusCircle },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logOut, loading } = useAuth(); // Get logOut function and loading state
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logOut();
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push('/login'); // Redirect to login page after logout
    } catch (error) {
      toast({ title: "Logout Failed", description: "Could not log out. Please try again.", variant: "destructive" });
      console.error("Logout error:", error);
    }
  };

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4 items-center">
        <div className="block md:hidden">
         <AppLogo />
        </div>
         <div className="hidden group-data-[collapsible=icon]:hidden group-data-[state=expanded]:md:block">
          <AppLogo />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))}
                  tooltip={{children: item.label, side: 'right', align: 'center'}}
                  className="w-full justify-start"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto p-2 group-data-[collapsible=icon]:p-0">
         <SidebarMenuButton
            tooltip={{children: 'Log Out', side: 'right', align: 'center'}}
            className="w-full justify-start"
            variant="ghost"
            onClick={handleLogout} // Call handleLogout on click
            disabled={loading} // Disable button while logging out
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogOut className="h-5 w-5" />}
            <span className="group-data-[collapsible=icon]:hidden">Log Out</span>
          </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
