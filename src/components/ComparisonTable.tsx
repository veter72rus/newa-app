'use client';

import { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowDown, ArrowUp, TrendingUp, BarChart3, Building2, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import type { Maslul, SortKey, SortDir, TrackType } from '../types';
import { maslulim, HOUSES, TRACK_TYPES } from '../data/maslulim';

function fmt(val: number | null): string {
  if (val === null) return '—';
  return `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;
}

function fmtAum(aum: number): string {
  if (aum >= 1000) return `₪${(aum / 1000).toFixed(1)}B`;
  return `₪${aum.toLocaleString('he-IL')}M`;
}

type YieldTier = 'high' | 'mid' | 'low' | 'neg' | 'null';

function getYieldTier(val: number | null): YieldTier {
  if (val === null) return 'null';
  if (val >= 15) return 'high';
  if (val >= 8) return 'mid';
  if (val >= 0) return 'low';
  return 'neg';
}

function YieldCell({ val, active }: { val: number | null; active: boolean }) {
  const tier = getYieldTier(val);
  if (val === null) return <span className="text-muted-foreground text-sm">—</span>;

  return (
    <span
      className={cn(
        'inline-flex items-center tabular-nums text-sm font-medium',
        active && 'font-semibold',
        tier === 'high' && 'text-emerald-600',
        tier === 'mid' && 'text-emerald-500',
        tier === 'low' && 'text-foreground',
        tier === 'neg' && 'text-destructive',
      )}
    >
      {fmt(val)}
    </span>
  );
}

const TRACK_COLORS: Record<string, string> = {
  'כללי': 'bg-blue-50 text-blue-700 border-blue-100',
  'מניות': 'bg-violet-50 text-violet-700 border-violet-100',
  'אגח': 'bg-amber-50 text-amber-700 border-amber-100',
  'שקלי': 'bg-teal-50 text-teal-700 border-teal-100',
  'S&P 500': 'bg-indigo-50 text-indigo-700 border-indigo-100',
  'גלובלי מניות': 'bg-rose-50 text-rose-700 border-rose-100',
};

const COL_LABELS: Record<SortKey, string> = {
  yield1y: '1 שנה',
  yield3y: '3 שנים',
  yield5y: '5 שנים',
  yieldSinceInception: 'מאז הקמה',
};

const SORT_COLS: SortKey[] = ['yield1y', 'yield3y', 'yield5y', 'yieldSinceInception'];

export default function ComparisonTable() {
  const [sortKey, setSortKey] = useState<SortKey>('yield1y');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [filterHouse, setFilterHouse] = useState('');
  const [filterType, setFilterType] = useState<TrackType | ''>('');

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    else { setSortKey(key); setSortDir('desc'); }
  }

  function clearFilters() { setFilterHouse(''); setFilterType(''); }

  const filtered = useMemo(
    () => maslulim.filter((m) => (!filterHouse || m.house === filterHouse) && (!filterType || m.trackType === filterType)),
    [filterHouse, filterType]
  );

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (av === null && bv === null) return 0;
    if (av === null) return 1;
    if (bv === null) return -1;
    return sortDir === 'desc' ? bv - av : av - bv;
  }), [filtered, sortKey, sortDir]);

  const topVal = sorted[0]?.[sortKey] ?? null;
  const avgVal = useMemo(() => {
    const vals = filtered.map((m) => m[sortKey]).filter((v): v is number => v !== null);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  }, [filtered, sortKey]);

  const hasFilter = filterHouse !== '' || filterType !== '';

  function SortIcon({ col }: { col: SortKey }) {
    if (col !== sortKey) return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
    return sortDir === 'desc' ? <ArrowDown className="h-3.5 w-3.5 text-primary" /> : <ArrowUp className="h-3.5 w-3.5 text-primary" />;
  }

  return (
    <div className="space-y-4">

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="shadow-none border">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              מסלולים
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold tabular-nums">{filtered.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">בסינון הנוכחי</p>
          </CardContent>
        </Card>
        <Card className="shadow-none border">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              מוביל
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className={cn('text-2xl font-bold tabular-nums', topVal !== null && topVal >= 0 ? 'text-emerald-600' : 'text-destructive')}>
              {fmt(topVal)}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{COL_LABELS[sortKey]}</p>
          </CardContent>
        </Card>
        <Card className="shadow-none border">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" />
              ממוצע
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold tabular-nums">{fmt(avgVal)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{COL_LABELS[sortKey]}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-none border">
        <CardHeader className="p-4 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">סינון ומיון</CardTitle>
            {hasFilter && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-2 text-xs text-muted-foreground gap-1">
                <X className="h-3 w-3" />
                נקה
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          {/* House pills */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">בית השקעות</p>
            <div className="flex flex-wrap gap-1.5">
              <Button
                variant={filterHouse === '' ? 'default' : 'outline'}
                size="sm"
                className="h-7 rounded-full text-xs px-3"
                onClick={() => setFilterHouse('')}
              >
                הכל
              </Button>
              {HOUSES.map((h) => (
                <Button
                  key={h}
                  variant={filterHouse === h ? 'default' : 'outline'}
                  size="sm"
                  className="h-7 rounded-full text-xs px-3"
                  onClick={() => setFilterHouse(filterHouse === h ? '' : h)}
                >
                  {h}
                </Button>
              ))}
            </div>
          </div>

          {/* Track type pills */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">סוג מסלול</p>
            <div className="flex flex-wrap gap-1.5">
              <Button
                variant={filterType === '' ? 'default' : 'outline'}
                size="sm"
                className="h-7 rounded-full text-xs px-3"
                onClick={() => setFilterType('')}
              >
                הכל
              </Button>
              {TRACK_TYPES.map((t) => (
                <Button
                  key={t}
                  variant={filterType === t ? 'default' : 'outline'}
                  size="sm"
                  className="h-7 rounded-full text-xs px-3"
                  onClick={() => setFilterType(filterType === t ? '' : (t as TrackType))}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>

          {/* Sort pills */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">מיין לפי תשואה</p>
            <div className="flex flex-wrap gap-1.5">
              {SORT_COLS.map((k) => (
                <Button
                  key={k}
                  variant={sortKey === k ? 'secondary' : 'outline'}
                  size="sm"
                  className={cn('h-7 rounded-full text-xs px-3 gap-1', sortKey === k && 'font-semibold')}
                  onClick={() => handleSort(k)}
                >
                  {COL_LABELS[k]}
                  {sortKey === k && (sortDir === 'desc' ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty state */}
      {sorted.length === 0 && (
        <Card className="shadow-none border">
          <CardContent className="p-16 text-center">
            <div className="text-5xl mb-4 opacity-20">◎</div>
            <p className="font-medium">לא נמצאו מסלולים</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">נסה לשנות את הסינון</p>
            <Button variant="outline" size="sm" onClick={clearFilters}>נקה סינונים</Button>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      {sorted.length > 0 && (
        <Card className="shadow-none border overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-[680px]">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-8 text-center text-muted-foreground font-medium sticky right-0 bg-muted/50">#</TableHead>
                  <TableHead className="font-medium sticky bg-muted/50" style={{ right: '32px' }}>בית השקעות</TableHead>
                  <TableHead className="font-medium">מסלול</TableHead>
                  <TableHead className="font-medium">סוג</TableHead>
                  {SORT_COLS.map((col) => (
                    <TableHead
                      key={col}
                      className={cn('text-left cursor-pointer select-none whitespace-nowrap font-medium', sortKey === col && 'text-foreground')}
                      onClick={() => handleSort(col)}
                    >
                      <span className="flex items-center justify-end gap-1.5">
                        <SortIcon col={col} />
                        {COL_LABELS[col]}
                      </span>
                    </TableHead>
                  ))}
                  <TableHead className="text-left font-medium text-muted-foreground whitespace-nowrap">נכסים</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((m, i) => (
                  <TableRow key={m.id} className={cn(i === 0 && 'bg-amber-50/40 hover:bg-amber-50/60')}>
                    <TableCell className="text-center sticky right-0 bg-inherit w-8 text-muted-foreground text-xs font-mono">
                      {i === 0 ? <span className="text-amber-500 text-sm">★</span> : i + 1}
                    </TableCell>
                    <TableCell className="font-semibold sticky bg-inherit" style={{ right: '32px' }}>
                      {m.house}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-[160px]">
                      <span className="line-clamp-1 text-sm">{m.name}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('text-xs font-medium whitespace-nowrap', TRACK_COLORS[m.trackType])}
                      >
                        {m.trackType}
                      </Badge>
                    </TableCell>
                    <TableCell className={cn('text-left', sortKey === 'yield1y' && 'bg-muted/30')}>
                      <YieldCell val={m.yield1y} active={sortKey === 'yield1y'} />
                    </TableCell>
                    <TableCell className={cn('text-left', sortKey === 'yield3y' && 'bg-muted/30')}>
                      <YieldCell val={m.yield3y} active={sortKey === 'yield3y'} />
                    </TableCell>
                    <TableCell className={cn('text-left', sortKey === 'yield5y' && 'bg-muted/30')}>
                      <YieldCell val={m.yield5y} active={sortKey === 'yield5y'} />
                    </TableCell>
                    <TableCell className={cn('text-left', sortKey === 'yieldSinceInception' && 'bg-muted/30')}>
                      <YieldCell val={m.yieldSinceInception} active={sortKey === 'yieldSinceInception'} />
                    </TableCell>
                    <TableCell className="text-left text-muted-foreground text-xs whitespace-nowrap tabular-nums">
                      {fmtAum(m.aum)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="px-4 py-3 border-t bg-muted/30">
            <p className="text-xs text-muted-foreground text-center">
              הנתונים לצורך הדגמה בלבד · אין לראות בהם ייעוץ השקעות · עדכון: מאי 2025
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
