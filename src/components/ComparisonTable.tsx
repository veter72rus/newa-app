'use client';

import { useState, useMemo } from 'react';
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

function yieldTier(val: number | null): YieldTier {
  if (val === null) return 'null';
  if (val >= 15) return 'high';
  if (val >= 8) return 'mid';
  if (val >= 0) return 'low';
  return 'neg';
}

const tierStyles: Record<YieldTier, string> = {
  high: 'bg-green-50 text-green-700 font-semibold ring-1 ring-green-200',
  mid: 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100',
  low: 'bg-gray-50 text-gray-600',
  neg: 'bg-red-50 text-red-600 ring-1 ring-red-100',
  null: 'text-gray-300',
};

function YieldBadge({ val, highlighted }: { val: number | null; highlighted: boolean }) {
  const tier = yieldTier(val);
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-md text-sm tabular-nums transition-all ${tierStyles[tier]} ${
        highlighted ? 'scale-105 shadow-sm' : ''
      }`}
    >
      {fmt(val)}
    </span>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-amber-500 text-base leading-none">★</span>;
  if (rank <= 3) return <span className="text-gray-300 text-sm font-mono">{rank}</span>;
  return <span className="text-gray-200 text-sm font-mono">{rank}</span>;
}

const TRACK_TYPE_COLORS: Record<string, string> = {
  'כללי': 'bg-blue-50 text-blue-700',
  'מניות': 'bg-purple-50 text-purple-700',
  'אגח': 'bg-amber-50 text-amber-700',
  'שקלי': 'bg-teal-50 text-teal-700',
  'S&P 500': 'bg-indigo-50 text-indigo-700',
  'גלובלי מניות': 'bg-rose-50 text-rose-700',
};

const COL_LABELS: Record<SortKey, { short: string; long: string }> = {
  yield1y: { short: '1 שנה', long: 'תשואה — שנה אחת' },
  yield3y: { short: '3 שנים', long: 'תשואה — 3 שנים' },
  yield5y: { short: '5 שנים', long: 'תשואה — 5 שנים' },
  yieldSinceInception: { short: 'מאז הקמה', long: 'תשואה מאז הקמה' },
};

export default function ComparisonTable() {
  const [sortKey, setSortKey] = useState<SortKey>('yield1y');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [filterHouse, setFilterHouse] = useState<string>('');
  const [filterType, setFilterType] = useState<TrackType | ''>('');

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const filtered = useMemo(() => {
    return maslulim.filter((m) => {
      if (filterHouse && m.house !== filterHouse) return false;
      if (filterType && m.trackType !== filterType) return false;
      return true;
    });
  }, [filterHouse, filterType]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      return sortDir === 'desc' ? bv - av : av - bv;
    });
  }, [filtered, sortKey, sortDir]);

  const sortCols: SortKey[] = ['yield1y', 'yield3y', 'yield5y', 'yieldSinceInception'];

  const topYield = sorted[0]?.[sortKey];
  const avgYield = useMemo(() => {
    const vals = filtered.map((m) => m[sortKey]).filter((v): v is number => v !== null);
    if (!vals.length) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }, [filtered, sortKey]);

  const hasActiveFilter = filterHouse !== '' || filterType !== '';

  return (
    <div className="w-full space-y-5">

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'מסלולים', value: filtered.length.toString(), sub: 'בסינון הנוכחי' },
          { label: 'תשואה מובילה', value: topYield !== null && topYield !== undefined ? fmt(topYield) : '—', sub: COL_LABELS[sortKey].short },
          { label: 'ממוצע', value: avgYield !== null ? fmt(avgYield) : '—', sub: COL_LABELS[sortKey].short },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-[var(--border)] px-4 py-3 shadow-sm"
          >
            <p className="text-xs text-[var(--text-muted)] mb-0.5">{stat.label}</p>
            <p className="text-xl font-bold text-[var(--text-primary)] tabular-nums leading-tight">{stat.value}</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--text-secondary)]">סינון ומיון</span>
          {hasActiveFilter && (
            <button
              onClick={() => { setFilterHouse(''); setFilterType(''); }}
              className="text-xs text-[var(--accent)] hover:underline transition-colors"
            >
              נקה הכל
            </button>
          )}
        </div>

        {/* House filter pills */}
        <div>
          <p className="text-xs text-[var(--text-muted)] mb-2">בית השקעות</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterHouse('')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filterHouse === ''
                  ? 'bg-[var(--text-primary)] text-white border-[var(--text-primary)]'
                  : 'bg-white text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--border-strong)]'
              }`}
            >
              הכל
            </button>
            {HOUSES.map((h) => (
              <button
                key={h}
                onClick={() => setFilterHouse(filterHouse === h ? '' : h)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  filterHouse === h
                    ? 'bg-[var(--text-primary)] text-white border-[var(--text-primary)]'
                    : 'bg-white text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--border-strong)]'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Track type filter pills */}
        <div>
          <p className="text-xs text-[var(--text-muted)] mb-2">סוג מסלול</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType('')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filterType === ''
                  ? 'bg-[var(--text-primary)] text-white border-[var(--text-primary)]'
                  : 'bg-white text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--border-strong)]'
              }`}
            >
              הכל
            </button>
            {TRACK_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(filterType === t ? '' : (t as TrackType))}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  filterType === t
                    ? 'bg-[var(--text-primary)] text-white border-[var(--text-primary)]'
                    : 'bg-white text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--border-strong)]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Sort pills */}
        <div>
          <p className="text-xs text-[var(--text-muted)] mb-2">מיין לפי תשואה</p>
          <div className="flex flex-wrap gap-2">
            {sortCols.map((k) => (
              <button
                key={k}
                onClick={() => handleSort(k)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1 ${
                  sortKey === k
                    ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                    : 'bg-white text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--border-strong)]'
                }`}
              >
                {COL_LABELS[k].short}
                {sortKey === k && (
                  <span className="opacity-80">{sortDir === 'desc' ? '↓' : '↑'}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty state */}
      {sorted.length === 0 && (
        <div className="bg-white rounded-xl border border-[var(--border)] py-16 text-center shadow-sm">
          <div className="text-5xl mb-4 opacity-30">◎</div>
          <p className="text-[var(--text-secondary)] font-medium">לא נמצאו מסלולים</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">נסה לשנות את הסינון</p>
          <button
            onClick={() => { setFilterHouse(''); setFilterType(''); }}
            className="mt-5 px-4 py-2 rounded-lg bg-[var(--text-primary)] text-white text-sm font-medium hover:opacity-80 transition-opacity"
          >
            נקה סינונים
          </button>
        </div>
      )}

      {/* Table */}
      {sorted.length > 0 && (
        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[680px]">
              <thead>
                <tr style={{ background: 'var(--text-primary)' }} className="text-white">
                  <th className="w-8 px-3 py-3.5 text-center font-medium opacity-40 sticky right-0" style={{ background: 'var(--text-primary)' }}>
                    #
                  </th>
                  <th className="px-4 py-3.5 text-right font-medium sticky" style={{ right: '32px', background: 'var(--text-primary)' }}>
                    בית השקעות
                  </th>
                  <th className="px-4 py-3.5 text-right font-medium opacity-80">מסלול</th>
                  <th className="px-4 py-3.5 text-right font-medium opacity-80">סוג</th>
                  {sortCols.map((col) => (
                    <th
                      key={col}
                      onClick={() => handleSort(col)}
                      className={`px-4 py-3.5 text-left font-medium cursor-pointer select-none whitespace-nowrap transition-opacity ${
                        sortKey === col ? 'opacity-100' : 'opacity-50 hover:opacity-80'
                      }`}
                    >
                      <span className="flex items-center justify-end gap-1">
                        {sortKey === col && (
                          <span className="text-[var(--accent)] text-xs">{sortDir === 'desc' ? '↓' : '↑'}</span>
                        )}
                        {COL_LABELS[col].short}
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3.5 text-left font-medium opacity-50 whitespace-nowrap">נכסים</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((m, i) => (
                  <tr
                    key={m.id}
                    className={`border-b border-[var(--border)] last:border-0 transition-colors hover:bg-[var(--bg)] group ${
                      i === 0 ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    <td className="px-3 py-3 text-center sticky right-0 bg-inherit group-hover:bg-[var(--bg)]">
                      <RankBadge rank={i + 1} />
                    </td>
                    <td className="px-4 py-3 font-semibold text-[var(--text-primary)] sticky bg-inherit group-hover:bg-[var(--bg)]" style={{ right: '32px' }}>
                      {m.house}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] max-w-[180px]">
                      <span className="line-clamp-1">{m.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${
                        TRACK_TYPE_COLORS[m.trackType] ?? 'bg-gray-50 text-gray-600'
                      }`}>
                        {m.trackType}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-left ${sortKey === 'yield1y' ? 'bg-amber-50/20' : ''}`}>
                      <YieldBadge val={m.yield1y} highlighted={sortKey === 'yield1y'} />
                    </td>
                    <td className={`px-4 py-3 text-left ${sortKey === 'yield3y' ? 'bg-amber-50/20' : ''}`}>
                      <YieldBadge val={m.yield3y} highlighted={sortKey === 'yield3y'} />
                    </td>
                    <td className={`px-4 py-3 text-left ${sortKey === 'yield5y' ? 'bg-amber-50/20' : ''}`}>
                      <YieldBadge val={m.yield5y} highlighted={sortKey === 'yield5y'} />
                    </td>
                    <td className={`px-4 py-3 text-left ${sortKey === 'yieldSinceInception' ? 'bg-amber-50/20' : ''}`}>
                      <YieldBadge val={m.yieldSinceInception} highlighted={sortKey === 'yieldSinceInception'} />
                    </td>
                    <td className="px-4 py-3 text-left text-[var(--text-muted)] text-xs whitespace-nowrap tabular-nums">
                      {fmtAum(m.aum)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs text-[var(--text-muted)] text-center pb-2">
        הנתונים לצורך הדגמה בלבד · אין לראות בהם ייעוץ השקעות · עדכון: מאי 2025
      </p>
    </div>
  );
}
