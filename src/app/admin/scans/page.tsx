
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllMemorialsForUser } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, Loader2, Search, BarChart as BarChartIcon } from 'lucide-react';
import { formatDistanceToNow, parseISO, startOfWeek, format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

type MemorialScanData = {
  id: string;
  deceasedName: string;
  viewCount: number;
  lastVisited?: string;
  viewTimestamps: string[];
};

type SortKey = 'deceasedName' | 'viewCount' | 'lastVisited';
type SortDirection = 'asc' | 'desc';

const chartConfig = {
  views: {
    label: 'Views',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const processViewDataForChart = (timestamps: string[]) => {
  if (!timestamps || timestamps.length === 0) {
    return [];
  }

  const weeklyData = timestamps.reduce<Record<string, number>>((acc, timestamp) => {
    try {
      const date = parseISO(timestamp);
      const weekStartDate = startOfWeek(date, { weekStartsOn: 1 });
      const weekKey = format(weekStartDate, 'yyyy-MM-dd');
      acc[weekKey] = (acc[weekKey] || 0) + 1;
    } catch (e) {
      console.warn(`Could not parse timestamp: ${timestamp}`, e);
    }
    return acc;
  }, {});

  const sortedChartData = Object.entries(weeklyData)
    .map(([weekKey, views]) => ({
      name: format(parseISO(weekKey), 'MMM dd'),
      views: views,
      date: parseISO(weekKey),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(-12);

  return sortedChartData;
};

export default function MyScansPage() {
  const { user, loading: authLoading } = useAuth();
  const [memorials, setMemorials] = useState<MemorialScanData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'lastVisited', direction: 'desc' });
  const [expandedMemorialId, setExpandedMemorialId] = useState<string | null>(null);

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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <h1 className="text-3xl font-headline">My Scans</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Memorial Performance</CardTitle>
          <CardDescription>
            Track visits to your memorial pages. Click a row to see weekly view statistics.
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
                      Deceased Name
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredMemorials.length > 0 ? (
                  sortedAndFilteredMemorials.map((memorial) => (
                    <React.Fragment key={memorial.id}>
                      <TableRow
                        onClick={() => setExpandedMemorialId(expandedMemorialId === memorial.id ? null : memorial.id)}
                        className="cursor-pointer"
                      >
                        <TableCell className="font-medium">{memorial.deceasedName}</TableCell>
                        <TableCell className="text-center">{memorial.viewCount}</TableCell>
                        <TableCell className="text-right">
                          {memorial.lastVisited
                            ? `${formatDistanceToNow(parseISO(memorial.lastVisited), { addSuffix: true })}`
                            : 'Never'}
                        </TableCell>
                      </TableRow>
                      {expandedMemorialId === memorial.id && (
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <TableCell colSpan={3} className="p-4">
                             <h4 className="text-md font-headline mb-2 text-center text-foreground">Weekly Views (Last 12 Weeks)</h4>
                            {memorial.viewTimestamps.length > 0 ? (
                              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                                <BarChart data={processViewDataForChart(memorial.viewTimestamps)} accessibilityLayer>
                                  <CartesianGrid vertical={false} />
                                  <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                  />
                                  <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                  <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="dot" />}
                                  />
                                  <Bar dataKey="views" fill="var(--color-views)" radius={4} />
                                </BarChart>
                              </ChartContainer>
                            ) : (
                               <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                                <BarChartIcon className="h-8 w-8 mb-2" />
                                <p>No view data available to display a chart.</p>
                               </div>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
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
