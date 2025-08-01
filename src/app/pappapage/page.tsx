
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllUsersWithMemorialCount, getAllFeedback, getAllMemorialsForAdmin } from '@/lib/data';
import { updateUserStatusAction, toggleMemorialVisibilityAction, toggleFeedbackStatusAction, updateMemorialPlanAction } from '@/lib/actions';
import type { UserForAdmin, Feedback, AdminMemorialView } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, ArrowUpDown, Search, ChevronDown, Pencil, ExternalLink, Eye, EyeOff, BookOpen, BookLock, Leaf, Sprout, TreeDeciduous, Heart, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type UserSortKey = 'email' | 'memorialCount' | 'signupDate' | 'status';
type QrSortKey = 'email' | 'totalQrCodes';
type MemorialSortKey = 'deceasedName' | 'ownerEmail' | 'viewCount' | 'ownerStatus' | 'visibility' | 'plan';
type SortDirection = 'asc' | 'desc';

const getBadgeVariant = (status: string | null) => {
  if (!status) return 'outline';
  switch (status.toUpperCase()) {
    case 'ADMIN':
      return 'admin' as const;
    case 'PAID':
      return 'default' as const;
    case 'SUSPENDED':
      return 'suspended' as const;
    case 'FREE':
    default:
      return 'outline' as const;
  }
};

const getPlanBadgeVariant = (plan?: string) => {
  if (!plan) return 'secondary';
  switch (plan.toUpperCase()) {
    case 'ETERNAL':
      return 'admin' as const; // gold
    case 'LEGACY':
    case 'ESSENCE':
      return 'default' as const; // primary color
    case 'SPIRIT':
    default:
      return 'secondary' as const;
  }
};

const PlanBadge = ({ plan }: { plan?: string }) => {
    const currentPlan = plan?.toUpperCase() || 'SPIRIT';
  
    const planDetails: Record<string, { icon: React.ComponentType<{ className?: string }>, text: string, variant: 'secondary' | 'default' | 'admin' }> = {
      SPIRIT: { icon: Leaf, text: 'SPIRIT', variant: getPlanBadgeVariant('SPIRIT') },
      ESSENCE: { icon: Sprout, text: 'ESSENCE', variant: getPlanBadgeVariant('ESSENCE') },
      LEGACY: { icon: TreeDeciduous, text: 'LEGACY', variant: getPlanBadgeVariant('LEGACY') },
      ETERNAL: { icon: Heart, text: 'ETERNAL', variant: getPlanBadgeVariant('ETERNAL') },
    };
  
    const { icon: Icon, text, variant } = planDetails[currentPlan] || planDetails.SPIRIT;
  
    return (
      <Badge variant={variant} className={cn("inline-flex items-center gap-1.5")}>
        <Icon className="h-3.5 w-3.5" />
        <span>{text}</span>
      </Badge>
    );
  };


export default function PappaPage() {
  const { user, userStatus, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserForAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: UserSortKey; direction: SortDirection }>({ key: 'signupDate', direction: 'desc' });
  const [qrSortConfig, setQrSortConfig] = useState<{ key: QrSortKey; direction: SortDirection }>({ key: 'email', direction: 'asc' });
  const [memorialsSortConfig, setMemorialsSortConfig] = useState<{ key: MemorialSortKey; direction: SortDirection }>({ key: 'deceasedName', direction: 'asc' });
  const { toast } = useToast();
  const [updatingStatusFor, setUpdatingStatusFor] = useState<string | null>(null);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedView, setSelectedView] = useState('User Management');
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(true);
  const [expandedFeedbackId, setExpandedFeedbackId] = useState<string | null>(null);
  const [allMemorials, setAllMemorials] = useState<AdminMemorialView[]>([]);
  const [isLoadingMemorials, setIsLoadingMemorials] = useState(true);
  const [updatingVisibilityId, setUpdatingVisibilityId] = useState<string | null>(null);
  const [updatingFeedbackId, setUpdatingFeedbackId] = useState<string | null>(null);
  const [showReadFeedback, setShowReadFeedback] = useState(false);
  const [updatingPlanFor, setUpdatingPlanFor] = useState<string | null>(null);

  const fetchUsers = useCallback(async (showNotification = false) => {
    if (userStatus !== 'ADMIN') return;
    setIsLoading(true);
    try {
      const allUsers = await getAllUsersWithMemorialCount();
      setUsers(allUsers);
      if (showNotification) {
        toast({ title: "Refreshed", description: "The list of users has been updated." });
      }
    } catch (error) {
      console.error("[PappaPage] Failed to fetch users:", error);
      toast({ title: "Error", description: "Could not load user data.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [userStatus, toast]);

  const fetchFeedback = useCallback(async (showNotification = false) => {
    if (userStatus !== 'ADMIN') return;
    setIsLoadingFeedback(true);
    try {
      const allFeedback = await getAllFeedback();
      setFeedbackList(allFeedback);
       if (showNotification) {
        toast({ title: "Refreshed", description: "The list of feedback has been updated." });
      }
    } catch (error) {
      console.error("[PappaPage] Failed to fetch feedback:", error);
      toast({ title: "Error", description: "Could not load feedback data.", variant: "destructive" });
    } finally {
      setIsLoadingFeedback(false);
    }
  }, [userStatus, toast]);

  const fetchAllMemorials = useCallback(async (showNotification = false) => {
    if (userStatus !== 'ADMIN') return;
    setIsLoadingMemorials(true);
    try {
        const memorials = await getAllMemorialsForAdmin();
        setAllMemorials(memorials);
        if (showNotification) {
            toast({ title: "Refreshed", description: "The list of memorials has been updated." });
        }
    } catch (error) {
        console.error("[PappaPage] Failed to fetch all memorials:", error);
        toast({ title: "Error", description: "Could not load memorial data.", variant: "destructive" });
    } finally {
        setIsLoadingMemorials(false);
    }
  }, [userStatus, toast]);

  useEffect(() => {
    if (!authLoading && userStatus === 'ADMIN') {
        fetchUsers();
    }
  }, [userStatus, authLoading, fetchUsers]);
  
  useEffect(() => {
    if (userStatus === 'ADMIN' && selectedView === 'Feedback') {
      fetchFeedback();
    }
  }, [userStatus, selectedView, fetchFeedback]);
  
  useEffect(() => {
    if (userStatus === 'ADMIN' && selectedView === 'All Memorials') {
      fetchAllMemorials();
    }
  }, [userStatus, selectedView, fetchAllMemorials]);

  const handleStatusChange = async (userId: string, newStatus: string) => {
    if (!user) {
      toast({ title: "Not Authenticated", description: "You must be logged in to perform this action.", variant: "destructive" });
      return;
    }
    setUpdatingStatusFor(userId);
    try {
      await updateUserStatusAction(user.uid, userId, newStatus);
      setUsers(prevUsers =>
        prevUsers.map(u => (u.userId === userId ? { ...u, status: newStatus } : u))
      );
      toast({ title: "Success", description: `User status updated to ${newStatus}.` });
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setUpdatingStatusFor(null);
      setOpenPopoverId(null); // Close the popover
    }
  };

  const handlePlanChange = async (memorialId: string, newPlan: string) => {
    if (!user) {
      toast({ title: "Not Authenticated", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    setUpdatingPlanFor(memorialId);
    try {
      await updateMemorialPlanAction(user.uid, memorialId, newPlan);
      // Data will be refetched because of revalidatePath, but for immediate UI update, refetch manually.
      const memorials = await getAllMemorialsForAdmin();
      setAllMemorials(memorials);
      toast({ title: "Success", description: `Memorial plan updated to ${newPlan}.` });
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setUpdatingPlanFor(null);
    }
  };


  const handleToggleVisibility = async (memorialId: string) => {
    if (!user) {
        toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
        return;
    }
    setUpdatingVisibilityId(memorialId);
    try {
        const newVisibility = await toggleMemorialVisibilityAction(user.uid, memorialId);
        setAllMemorials(prev =>
            prev.map(m => (m.id === memorialId ? { ...m, visibility: newVisibility } : m))
        );
        toast({ title: "Success", description: `Memorial visibility updated.` });
    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
        setUpdatingVisibilityId(null);
    }
  };

  const handleToggleFeedbackStatus = async (feedbackId: string) => {
    if (!user) {
        toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
        return;
    }
    setUpdatingFeedbackId(feedbackId);
    try {
        const newStatus = await toggleFeedbackStatusAction(user.uid, feedbackId);
        setFeedbackList(prev =>
            prev.map(f => (f.id === feedbackId ? { ...f, status: newStatus } : f))
        );
        toast({ title: "Success", description: `Feedback marked as ${newStatus}.` });
    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
        setUpdatingFeedbackId(null);
    }
  };

  const handleSort = (key: UserSortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleQrSort = (key: QrSortKey) => {
    let direction: SortDirection = 'asc';
    if (qrSortConfig.key === key && qrSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setQrSortConfig({ key, direction });
  };
  
  const handleMemorialsSort = (key: MemorialSortKey) => {
    let direction: SortDirection = 'asc';
    if (memorialsSortConfig.key === key && memorialsSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setMemorialsSortConfig({ key, direction });
  };

  const safeFormatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (e) {
      return 'N/A';
    }
  };

   const safeFormatDateTime = (dateString: string | undefined | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy, p');
    } catch (e) {
      return 'N/A';
    }
  };

  const visibleFeedback = React.useMemo(() => {
      return feedbackList.filter(item => showReadFeedback || item.status === 'unread');
  }, [feedbackList, showReadFeedback]);

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
  
  const filteredAndSortedMemorials = React.useMemo(() => {
    let sortableMemorials = [...allMemorials];

    if (searchTerm) {
        const lowercasedFilter = searchTerm.toLowerCase();
        sortableMemorials = sortableMemorials.filter(m =>
            m.deceasedName.toLowerCase().includes(lowercasedFilter) ||
            (m.ownerEmail && m.ownerEmail.toLowerCase().includes(lowercasedFilter))
        );
    }
    
    sortableMemorials.sort((a, b) => {
        const aValue = a[memorialsSortConfig.key];
        const bValue = b[memorialsSortConfig.key];
        
        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;
        
        let comparison = 0;
        if (aValue > bValue) {
            comparison = 1;
        } else if (aValue < bValue) {
            comparison = -1;
        }
        
        return memorialsSortConfig.direction === 'desc' ? comparison * -1 : comparison;
    });
    return sortableMemorials;
  }, [allMemorials, memorialsSortConfig, searchTerm]);

  const filteredAndSortedQrData = React.useMemo(() => {
    let sortableUsers = [...users];

    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      sortableUsers = sortableUsers.filter(u =>
        u.email.toLowerCase().includes(lowercasedFilter)
      );
    }
    
    sortableUsers.sort((a, b) => {
      const aValue = a[qrSortConfig.key];
      const bValue = b[qrSortConfig.key];
      
      let comparison = 0;
      if (aValue > bValue) {
        comparison = 1;
      } else if (aValue < bValue) {
        comparison = -1;
      }
      
      return qrSortConfig.direction === 'desc' ? comparison * -1 : comparison;
    });
    return sortableUsers;
  }, [users, qrSortConfig, searchTerm]);

  
  const searchPlaceholder = () => {
    switch (selectedView) {
      case 'User Management':
        return "Search by email or status...";
      case 'All Memorials':
        return "Search by name or owner email...";
      case 'QR Codes':
        return "Search by email...";
      default:
        return "Search...";
    }
  };

  if (authLoading) {
    return null;
  }

  if (userStatus !== 'ADMIN') {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="bg-logo-background text-white py-5 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/memorials">
            <Image
              src="/hl.png"
              alt="HonouredLives Logo"
              width={142}
              height={80}
              className="h-20 w-auto"
              data-ai-hint="logo company"
              priority
            />
          </Link>
          <h1 className="text-4xl font-headline text-white tracking-wider">ADMIN DASHBOARD</h1>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="container mx-auto py-10 px-4">
          <div className="mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center text-3xl font-headline p-0 h-auto hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  {selectedView}
                  <ChevronDown className="ml-2 h-8 w-8" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setSelectedView('User Management')}>
                  User Management
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedView('All Memorials')}>
                  All Memorials
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedView('Feedback')}>
                  Feedback
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {selectedView !== 'Feedback' && (
            <div className="flex items-center justify-between py-4">
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={searchPlaceholder()}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
              </div>
              {selectedView === 'All Memorials' && (
                <Button variant="outline" size="icon" onClick={() => fetchAllMemorials(true)} disabled={isLoadingMemorials} title="Refresh memorials">
                    <RefreshCw className={cn("h-4 w-4", isLoadingMemorials && "animate-spin")} />
                </Button>
              )}
               {selectedView === 'User Management' && (
                <Button variant="outline" size="icon" onClick={() => fetchUsers(true)} disabled={isLoading} title="Refresh users">
                    <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                </Button>
              )}
            </div>
          )}

          {selectedView === 'User Management' && (
             <>
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
                        <Button variant="ghost" onClick={() => handleSort('status')}>
                          Status <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
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
                                      <>
                                        <Badge variant={getBadgeVariant(u.status)}>
                                          {u.status}
                                        </Badge>
                                        <Pencil className="ml-1 h-3 w-3 text-muted-foreground" />
                                      </>
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
                                      className="justify-start rounded-none"
                                      onClick={() => handleStatusChange(u.userId, 'PAID')}
                                    >
                                      PAID
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="justify-start rounded-t-none text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                      onClick={() => handleStatusChange(u.userId, 'SUSPENDED')}
                                    >
                                      SUSPENDED
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
                        <TableCell colSpan={4} className="h-24 text-center">
                          No users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          {selectedView === 'All Memorials' && (
             <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button variant="ghost" onClick={() => handleMemorialsSort('deceasedName')}>
                          Deceased Name <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => handleMemorialsSort('ownerEmail')}>
                          Owner <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                       <TableHead>
                        <Button variant="ghost" onClick={() => handleMemorialsSort('ownerStatus')}>
                          Owner Status <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => handleMemorialsSort('plan')}>
                          Plan <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button variant="ghost" onClick={() => handleMemorialsSort('viewCount')}>
                          Views <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                       <TableHead className="w-[120px] text-center">
                        <Button variant="ghost" onClick={() => handleMemorialsSort('visibility')} className="w-full justify-center">
                          Visibility <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingMemorials ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                        </TableCell>
                      </TableRow>
                    ) : filteredAndSortedMemorials.length > 0 ? (
                      filteredAndSortedMemorials.map((m) => (
                        <TableRow key={m.id}>
                          <TableCell className="font-medium">{m.deceasedName}</TableCell>
                          <TableCell>{m.ownerEmail}</TableCell>
                          <TableCell>
                            <Badge variant={getBadgeVariant(m.ownerStatus)}>{m.ownerStatus}</Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="p-0 h-auto flex flex-col items-start" disabled={updatingPlanFor === m.id}>
                                        {updatingPlanFor === m.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                <PlanBadge plan={m.plan} />
                                                {m.planExpiryDate && (
                                                    <span className="text-xs text-muted-foreground mt-1">
                                                        {m.planExpiryDate === 'ETERNAL' 
                                                            ? 'Never Expires' 
                                                            : `Expires: ${safeFormatDate(m.planExpiryDate)}`
                                                        }
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onSelect={() => handlePlanChange(m.id, 'SPIRIT')}>SPIRIT</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => handlePlanChange(m.id, 'ESSENCE')}>ESSENCE</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => handlePlanChange(m.id, 'LEGACY')}>LEGACY</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => handlePlanChange(m.id, 'ETERNAL')}>ETERNAL</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell className="text-center">{m.viewCount}</TableCell>
                          <TableCell className="w-[120px]">
                            <div className="flex flex-col items-center justify-center h-full gap-1">
                              {updatingVisibilityId === m.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Switch
                                    checked={m.visibility === 'shown'}
                                    onCheckedChange={() => handleToggleVisibility(m.id)}
                                    disabled={updatingVisibilityId === m.id}
                                    id={`visibility-switch-${m.id}`}
                                    aria-labelledby={`visibility-label-${m.id}`}
                                  />
                                  <Label
                                    htmlFor={`visibility-switch-${m.id}`}
                                    id={`visibility-label-${m.id}`}
                                    className="text-xs font-normal text-muted-foreground cursor-pointer"
                                  >
                                    {m.visibility === 'shown' ? 'Public' : 'Hidden'}
                                  </Label>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/${m.id}`} target={`memorial-${m.id}`} title={`View ${m.deceasedName}`}>
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No memorials found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          {selectedView === 'Feedback' && (
             <>
              <div className="flex justify-end items-center gap-4 py-4">
                  <Button variant="outline" onClick={() => setShowReadFeedback(prev => !prev)}>
                      {showReadFeedback ? 'Hide Read Messages' : 'Show Read Messages'}
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => fetchFeedback(true)} disabled={isLoadingFeedback} title="Refresh feedback">
                      <RefreshCw className={cn("h-4 w-4", isLoadingFeedback && "animate-spin")} />
                  </Button>
              </div>
              {isLoadingFeedback ? (
                  <div className="flex items-center justify-center h-64 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  </div>
              ) : (
                  <div className="rounded-md border">
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead className="w-[250px]">User Email</TableHead>
                                  <TableHead>Feedback Message</TableHead>
                                  <TableHead className="w-[180px]">Date</TableHead>
                                  <TableHead className="w-[180px] text-right">Actions</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {visibleFeedback.length > 0 ? (
                                  visibleFeedback.map((item) => (
                                      <TableRow key={item.id}>
                                          <TableCell className="font-medium align-top">{item.email}</TableCell>
                                          <TableCell className="align-top max-w-[600px]">
                                              {expandedFeedbackId === item.id || item.feedback.length <= 150 ? (
                                                  <>
                                                      <p className="whitespace-pre-wrap break-words">{item.feedback}</p>
                                                      {item.feedback.length > 150 && (
                                                          <Button variant="link" className="p-0 h-auto text-xs" onClick={() => setExpandedFeedbackId(null)}>
                                                              Read less
                                                          </Button>
                                                      )}
                                                  </>
                                              ) : (
                                                  <>
                                                      <p className="break-words">{`${item.feedback.substring(0, 150)}...`}</p>
                                                      <Button variant="link" className="p-0 h-auto text-xs" onClick={() => setExpandedFeedbackId(item.id!)}>
                                                          Read more
                                                      </Button>
                                                  </>
                                              )}
                                          </TableCell>
                                          <TableCell className="text-right align-top">{safeFormatDateTime(item.createdAt)}</TableCell>
                                          <TableCell className="text-right align-top">
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => handleToggleFeedbackStatus(item.id!)}
                                              disabled={updatingFeedbackId === item.id}
                                              title={item.status === 'unread' ? 'Mark as read' : 'Mark as unread'}
                                              className="w-40"
                                            >
                                                {updatingFeedbackId === item.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : item.status === 'unread' ? (
                                                    <>
                                                        <BookOpen className="mr-2 h-4 w-4" />
                                                        <span>Mark as Read</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <BookLock className="mr-2 h-4 w-4" />
                                                        <span>Mark as Unread</span>
                                                    </>
                                                )}
                                            </Button>
                                          </TableCell>
                                      </TableRow>
                                  ))
                              ) : (
                                  <TableRow>
                                      <TableCell colSpan={4} className="h-24 text-center">
                                          {showReadFeedback ? 'No read feedback messages.' : 'No new feedback messages.'}
                                      </TableCell>
                                  </TableRow>
                              )}
                          </TableBody>
                      </Table>
                  </div>
              )}
            </>
          )}

        </div>
      </main>

      <footer className="bg-logo-background text-white/80 py-8 text-center">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} HonouredLives. All rights reserved. Crafted with care to preserve legacy.</p>
        </div>
      </footer>
    </div>
  );
}
