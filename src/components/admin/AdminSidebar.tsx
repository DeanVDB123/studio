
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppLogo } from '@/components/shared/AppLogo';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { LayoutDashboard, PlusCircle, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/create', label: 'New Memorial', icon: PlusCircle },
  // { href: '/admin/settings', label: 'Settings', icon: Settings }, // Future use
];

export function AdminSidebar() {
  const pathname = usePathname();

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
                  className={cn(
                    "w-full justify-start",
                    (pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))) ? "bg-primary/20 text-primary-foreground" : ""
                  )}
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
          >
            <LogOut className="h-5 w-5" />
            <span className="group-data-[collapsible=icon]:hidden">Log Out</span>
          </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
