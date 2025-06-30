
"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllUsersWithMemorialCount, updateUserStatusAction } from '@/lib/data';
import type { UserForAdmin } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, ShieldAlert, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type SortKey = 'email' | 'memorialCount' | 'signupDate' | 'dateSwitched' | 'status';
type SortDirection = 'asc' | 'desc';

export default function PappaPage() {
  const { user, userStatus, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserForAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'signupDate', direction: 'desc' });
  const { toast } = useToast();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    // Redirect non-admins immediately if auth is loaded
    if (!authLoading && userStatus !== 'ADMIN') {
      router.replace('/memorials');
      return;
    }

    async function fetchUsers() {
      if (userStatus === 'ADMIN') {
        setIsLoading(true);
        try {
          const allUsers = await getAllUsersWithMemorialCount();
          setUsers(allUsers);
        } catch (error) {
          console.error("[PappaPage] Failed to fetch users:", error);
          toast({ title: "Error", description: "Could not load user data.", variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      }
    }

    // Only fetch data if user is confirmed to be an admin
    if (userStatus === 'ADMIN') {
      fetchUsers();
    }
  }, [userStatus, authLoading, router, toast]);

  const handleStatusChange = async (userId: string, newStatus: string) => {
    setIsUpdating(userId);
    try {
      await updateUserStatusAction(userId, newStatus);
      setUsers(prevUsers =>
        prevUsers.map(u => (u.userId === userId ? { ...u, status: newStatus, dateSwitched: newStatus !== 'FREE' ? new Date().toISOString() : u.dateSwitched } : u))
      );
      toast({ title: "Success", description: `User status updated to ${newStatus}.` });
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const safeFormatDate = (dateString: string | undefined | null, formatStr: string) => {
    if (!dateString) return 'N/A';
    try {
      // The `format` function from date-fns will throw an error for invalid dates.
      return format(new Date(dateString), formatStr);
    } catch (e) {
      return 'N/A'; // Return 'N/A' if the date is invalid.
    }
  };


  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...users];
    sortableUsers.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;
      
      let comparison = 0;
      if (aValue > bValue) {
        comparison = 1;
      } else if (aValue < bValue) {
        comparison = -1;
      }
      
      return sortConfig.direction === 'desc' ? comparison * -1 : comparison;
    });
    return sortableUsers;
  }, [users, sortConfig]);

  if (authLoading || (!user && !userStatus)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Verifying Admin Access...</p>
      </div>
    );
  }

  if (userStatus !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-headline">Access Denied</h1>
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
        <Button onClick={() => router.push('/memorials')} className="mt-4">Return to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-headline mb-8">User Management</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('email')}>
                  User Email <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button variant="ghost" onClick={() => handleSort('memorialCount')}>
                  Memorials <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('signupDate')}>
                  Date Joined <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                 <Button variant="ghost" onClick={() => handleSort('dateSwitched')}>
                  Date Switched <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('status')}>
                  Status <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                </TableCell>
              </TableRow>
            ) : sortedUsers.length > 0 ? (
              sortedUsers.map((u) => (
                <TableRow key={u.userId}>
                  <TableCell className="font-medium">{u.email}</TableCell>
                  <TableCell className="text-center">{u.memorialCount}</TableCell>
                  <TableCell>{safeFormatDate(u.signupDate, 'dd MMM yyyy')}</TableCell>
                  <TableCell>
                    {safeFormatDate(u.dateSwitched, 'dd MMM yyyy, p')}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={u.status}
                      onValueChange={(newStatus) => handleStatusChange(u.userId, newStatus)}
                      disabled={isUpdating === u.userId}
                    >
                      <SelectTrigger className="w-[120px]">
                        {isUpdating === u.userId ? <Loader2 className="h-4 w-4 animate-spin" /> : <SelectValue />}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FREE">FREE</SelectItem>
                        <SelectItem value="PAID">PAID</SelectItem>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
