
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllUsersWithMemorialCount, updateUserStatusAction } from '@/lib/data';
import type { UserForAdmin } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, ArrowUpDown, Search } from 'lucide-react';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

type SortKey = 'email' | 'memorialCount' | 'signupDate' | 'dateSwitched' | 'status';
type SortDirection = 'asc' | 'desc';

const getBadgeVariant = (status: string | null) => {
  switch (status?.toUpperCase()) {
    case 'ADMIN':
      return 'admin' as const;
    case 'PAID':
      return 'default' as const;
    case 'FREE':
    default:
      return 'secondary' as const;
  }
};


export default function PappaPage() {
  const { user, userStatus, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserForAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'signupDate', direction: 'desc' });
  const { toast } = useToast();
  const [updatingStatusFor, setUpdatingStatusFor] = useState<string | null>(null);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
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

    if (!authLoading) {
      if (userStatus === 'ADMIN') {
        fetchUsers();
      }
    }
  }, [userStatus, authLoading, toast]);


  const handleStatusChange = async (userId: string, newStatus: string) => {
    setUpdatingStatusFor(userId);
    try {
      await updateUserStatusAction(userId, newStatus);
      setUsers(prevUsers =>
        prevUsers.map(u => (u.userId === userId ? { ...u, status: newStatus, dateSwitched: newStatus !== 'FREE' ? new Date().toISOString() : u.dateSwitched } : u))
      );
      toast({ title: "Success", description: `User status updated to ${newStatus}.` });
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setUpdatingStatusFor(null);
      setOpenPopoverId(null); // Close the popover
    }
  };

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const safeFormatDate = (dateString: string | undefined | null) => {
    if (!dateString || new Date(dateString) > new Date()) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (e) {
      return 'N/A';
    }
  };

   const safeFormatDateTime = (dateString: string | undefined | null) => {
    if (!dateString || new Date(dateString) > new Date()) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy, p');
    } catch (e) {
      return 'N/A';
    }
  };


  const filteredAndSortedUsers = React.useMemo(() => {
    let sortableUsers = [...users];

    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      sortableUsers = sortableUsers.filter(u =>
        u.email.toLowerCase().includes(lowercasedFilter) ||
        u.status.toLowerCase().includes(lowercasedFilter)
      );
    }
    
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
  }, [users, sortConfig, searchTerm]);

  if (authLoading) {
    // Return null to avoid flashing a "Verifying..." message to non-admins.
    // The user sees a blank page for a moment, then the 404 page if not an admin.
    return null;
  }

  if (userStatus !== 'ADMIN') {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-headline mb-4">User Management</h1>
      <div className="flex items-center py-4">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
        </div>
      </div>
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
            ) : filteredAndSortedUsers.length > 0 ? (
              filteredAndSortedUsers.map((u) => (
                <TableRow key={u.userId}>
                  <TableCell className="font-medium">{u.email}</TableCell>
                  <TableCell className="text-center">{u.memorialCount}</TableCell>
                  <TableCell>{safeFormatDate(u.signupDate)}</TableCell>
                  <TableCell>
                    {safeFormatDateTime(u.dateSwitched)}
                  </TableCell>
                  <TableCell>
                    {u.status === 'ADMIN' ? (
                      <Badge variant="admin" className="cursor-not-allowed">
                        ADMIN
                      </Badge>
                    ) : (
                      <Popover open={openPopoverId === u.userId} onOpenChange={(isOpen) => setOpenPopoverId(isOpen ? u.userId : null)}>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="p-0 h-auto" disabled={updatingStatusFor === u.userId}>
                            {updatingStatusFor === u.userId ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Badge variant={getBadgeVariant(u.status)} className="cursor-pointer hover:opacity-80 transition-opacity">
                                {u.status}
                              </Badge>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 p-0">
                           <div className="flex flex-col">
                             <Button
                                variant="ghost"
                                className="justify-start rounded-b-none"
                                onClick={() => handleStatusChange(u.userId, 'FREE')}
                              >
                                FREE
                              </Button>
                              <Button
                                variant="ghost"
                                className="justify-start rounded-t-none"
                                onClick={() => handleStatusChange(u.userId, 'PAID')}
                              >
                                PAID
                              </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
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
