
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllMemorialsForUser } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, Loader2, Search, CalendarDays, Eye } from 'lucide-react';
import { formatDistanceToNow, parseISO, format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

type MemorialScanData = {
  id: string;
  deceasedName: string;
  viewCount: number;
  lastVisited?: string;
  viewTimestamps: string[];
};

type SortKey = 'deceasedName' | 'viewCount' | 'lastVisited';
type SortDirection = 'asc' | 'desc';


const processViewDataForCalendar = (timestamps: string[]): Record<string, number> => {
    if (!timestamps || timestamps.length === 0) {
        return {};
    }
    return timestamps.reduce<Record<string, number>>((acc, timestamp) => {
        try {
            const dateKey = format(parseISO(timestamp), 'yyyy-MM-dd');
            acc[dateKey] = (acc[dateKey] || 0) + 1;
        } catch (e) {
            // Silently ignore invalid date formats
        }
        return acc;
    }, {});
};


const MemorialHeatmapCalendar = ({ timestamps }: { timestamps: string[] }) => {
    const today = new Date();

    const dailyData = useMemo(() => processViewDataForCalendar(timestamps), [timestamps]);

    const datesWithData = Object.keys(dailyData);

    const getOpacityForCount = (count: number): number => {
        if (count >= 50) return 1.0;
        if (count >= 30) return 0.8;
        if (count >= 20) return 0.6;
        if (count >= 10) return 0.4;
        if (count > 0) return 0.2;
        return 0;
    };

    const modifiers = useMemo(() => {
        return datesWithData.reduce((acc, dateStr) => {
            acc[dateStr] = parseISO(dateStr);
            return acc;
        }, {} as Record<string, Date>);
    }, [datesWithData]);

    const modifiersStyles = useMemo(() => {
        return datesWithData.reduce((acc, dateStr) => {
            const count = dailyData[dateStr] || 0;
            const opacity = getOpacityForCount(count);
            acc[dateStr] = {
                backgroundColor: `hsla(42, 73%, 79%, ${opacity})`,
                color: opacity > 0.5 ? 'hsl(var(--secondary-foreground))' : 'inherit',
            };
            return acc;
        }, {} as Record<string, React.CSSProperties>);
    }, [datesWithData, dailyData]);


    if (timestamps.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <CalendarDays className="h-8 w-8 mb-2" />
                <p>No view data available to display a heatmap.</p>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col items-center gap-4">
            <Calendar
                mode="multiple"
                onSelect={() => {}} // This is a display-only calendar
                month={today}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="p-0"
                classNames={{
                    month: "border p-3 rounded-lg shadow-sm bg-card",
                    caption_label: "font-headline text-base",
                    head_cell: "text-xs w-8",
                    day: "h-8 w-8 rounded-sm text-xs",
                    day_today: "bg-background ring-1 ring-primary",
                    day_selected: "bg-transparent hover:bg-accent/50 focus:bg-accent/50" // Prevent yellow selection color
                }}
                showOutsideDays
                fixedWeeks
            />
            <div className="flex items-center gap-2 text-xs text-secondary-foreground mt-2">
                <span>Less</span>
                <div className="flex gap-1">
                    <div title="1-9 visits" className="h-4 w-4 rounded-sm border border-accent/50" style={{ backgroundColor: 'hsla(42, 73%, 79%, 0.2)' }} />
                    <div title="10-19 visits" className="h-4 w-4 rounded-sm border border-accent/50" style={{ backgroundColor: 'hsla(42, 73%, 79%, 0.4)' }} />
                    <div title="20-29 visits" className="h-4 w-4 rounded-sm border border-accent/50" style={{ backgroundColor: 'hsla(42, 73%, 79%, 0.6)' }} />
                    <div title="30-49 visits" className="h-4 w-4 rounded-sm border border-accent/50" style={{ backgroundColor: 'hsla(42, 73%, 79%, 0.8)' }} />
                    <div title="50+ visits" className="h-4 w-4 rounded-sm border border-accent/50" style={{ backgroundColor: 'hsla(42, 73%, 79%, 1.0)' }} />
                </div>
                <span>More</span>
            </div>
        </div>
    );
};


export default function MyScansPage() {
  const { user, loading: authLoading } = useAuth();
  const [memorials, setMemorials] = useState<MemorialScanData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'lastVisited', direction: 'desc' });
  const [selectedMemorial, setSelectedMemorial] = useState<MemorialScanData | null>(null);

  useEffect(() => {
    async function fetchScans() {
      if (user && !authLoading) {
        setIsLoading(true);
        try {
          const userMemorialsData = await getAllMemorialsForUser(user.uid);
          const scanData = userMemorialsData.map(m => ({
            id: m.id,
            deceasedName: m.deceasedName,
            viewCount: m.viewCount || 0,
            lastVisited: m.lastVisited,
            viewTimestamps: m.viewTimestamps || [],
          }));
          setMemorials(scanData);
        } catch (error) {
          console.error("[MyScansPage] Failed to fetch memorial data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchScans();
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

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
      if (bValue === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
      
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
        <p className="ml-4 text-lg">Loading Scan Data...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Memorial visits</CardTitle>
            <CardDescription>
              Track visits to your memorial pages. Click the eye icon to see a heatmap of daily views.
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
                    <TableHead className="w-[40%]">
                      <Button variant="ghost" onClick={() => handleSort('deceasedName')} className="w-full justify-start px-2">
                        Memorial Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-center">
                      <Button variant="ghost" onClick={() => handleSort('viewCount')} className="w-full justify-center px-2">
                        Total Views
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button variant="ghost" onClick={() => handleSort('lastVisited')} className="w-full justify-end px-2">
                        Last Visited
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[100px] text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAndFilteredMemorials.length > 0 ? (
                    sortedAndFilteredMemorials.map((memorial) => (
                      <TableRow key={memorial.id}>
                        <TableCell className="font-medium">{memorial.deceasedName}</TableCell>
                        <TableCell className="text-center">{memorial.viewCount}</TableCell>
                        <TableCell className="text-right">
                          {memorial.lastVisited
                            ? `${formatDistanceToNow(parseISO(memorial.lastVisited), { addSuffix: true })}`
                            : 'Never'}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedMemorial(memorial)} title="View heatmap">
                            <Eye className="h-5 w-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
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

      <Dialog open={!!selectedMemorial} onOpenChange={(isOpen) => { if (!isOpen) setSelectedMemorial(null); }}>
        {selectedMemorial && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center font-headline text-2xl">Daily Views Heatmap</DialogTitle>
              <DialogDescription className="text-center text-muted-foreground pt-1">
                {selectedMemorial.deceasedName}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <MemorialHeatmapCalendar timestamps={selectedMemorial.viewTimestamps} />
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
