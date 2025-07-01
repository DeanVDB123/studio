"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllMemorialsForUser } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, Loader2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type MemorialQRCodeData = {
  id: string;
  deceasedName: string;
  purchasedQRCodes: number;
};

type SortKey = 'deceasedName' | 'purchasedQRCodes';
type SortDirection = 'asc' | 'desc';

export default function QRCodesPage() {
  const { user, loading: authLoading } = useAuth();
  const [memorials, setMemorials] = useState<MemorialQRCodeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'deceasedName', direction: 'asc' });

  useEffect(() => {
    async function fetchQRCodeData() {
      if (user && !authLoading) {
        setIsLoading(true);
        try {
          const userMemorialsData = await getAllMemorialsForUser(user.uid);
          const qrCodeData = userMemorialsData.map(m => ({
            id: m.id,
            deceasedName: m.deceasedName,
            // Placeholder for future logic
            purchasedQRCodes: 0,
          }));
          setMemorials(qrCodeData);
        } catch (error) {
          console.error("[QRCodesPage] Failed to fetch memorial data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchQRCodeData();
  }, [user, authLoading]);
  
  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredMemorials = useMemo(() => {
    let searchableMemorials = [...memorials];

    if (searchTerm) {
      searchableMemorials = searchableMemorials.filter(memorial =>
        memorial.deceasedName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    searchableMemorials.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      let comparison = 0;
      if (aValue > bValue) {
        comparison = 1;
      } else if (aValue < bValue) {
        comparison = -1;
      }

      return sortConfig.direction === 'desc' ? comparison * -1 : comparison;
    });

    return searchableMemorials;
  }, [memorials, searchTerm, sortConfig]);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading QR Code Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Physical QR Codes</CardTitle>
          <CardDescription>
            Manage the physical QR codes you have ordered for your memorials.
          </CardDescription>
          <div className="flex items-center justify-between gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70%]">
                    <Button variant="ghost" onClick={() => handleSort('deceasedName')} className="w-full justify-start px-2">
                      Memorial Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-center">
                    <Button variant="ghost" onClick={() => handleSort('purchasedQRCodes')} className="w-full justify-center px-2">
                      QR Codes Purchased
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredMemorials.length > 0 ? (
                  sortedAndFilteredMemorials.map((memorial) => (
                    <TableRow key={memorial.id}>
                      <TableCell className="font-medium">{memorial.deceasedName}</TableCell>
                      <TableCell className="text-center">{memorial.purchasedQRCodes}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center">
                      No memorials found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
