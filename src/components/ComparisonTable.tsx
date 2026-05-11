'use client';

import { useState, useMemo } from 'react';
import type { Maslul, SortKey, SortDir, TrackType } from '../types';
import { maslulim, HOUSES, TRACK_TYPES } from '../data/maslulim';

function fmt(val: number | null): string {
  if (val === null) return '—';
  return `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;
}

function fmtAum(aum: number): string {
  if (aum >= 1000) return `₪${(aum / 1000).toFixed(1)} מיליארד`;
  return `₪${aum.toLocaleString('he-IL')} מ'`;
}

function yieldClass(val: number | null): string {
  if (val === null) return 'text-gray-400';
  if (val >= 15) return 'text-emerald-600 font-semibold';
  if (val >= 8) return 'text-emerald-500';
  if (val >= 0) return 'text-gray-700';
  return 'text-red-500';
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <span className="text-gray-300 text-xs mr-1">↕</span>;
  return <span className="text-blue-600 text-xs mr-1">{dir === 'desc' ? '↓' : '↑'}</span>;
}

const SORT_LABELS: Record<SortKey, string> = {
  yield1y: 'תשואה 1 שנה',
  yield3y: 'תשואה 3 שנים',
  yield5y: 'תשואה 5 שנים',
  yieldSinceInception: 'מאז הקמה',
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

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-medium text-gray-600">בית השקעות</label>
          <select
            value={filterHouse}
            onChange={(e) => setFilterHouse(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">כל הבתים</option>
            {HOUSES.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-medium text-gray-600">סוג מסלול</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as TrackType | '')}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">כל הסוגים</option>
            {TRACK_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 flex-1 sm:max-w-xs">
          <label className="text-sm font-medium text-gray-600">מיין לפי</label>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {sortCols.map((k) => (
              <option key={k} value={k}>{SORT_LABELS[k]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-3">
        מציג {sorted.length} מסלולים
      </p>

      {/* Empty state */}
      {sorted.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-lg">לא נמצאו מסלולים התואמים את הסינון</p>
          <button
            onClick={() => { setFilterHouse(''); setFilterType(''); }}
            className="mt-4 text-blue-600 underline text-sm"
          >
            נקה סינונים
          </button>
        </div>
      )}

      {/* Table — horizontal scroll on mobile */}
      {sorted.length > 0 && (
        <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-none sm:rounded-xl border border-gray-200">
          <table className="w-full text-sm border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-blue-50 text-gray-700">
                <th className="px-4 py-3 text-right font-semibold sticky right-0 bg-blue-50 z-10 border-b border-gray-200">
                  בית השקעות
                </th>
                <th className="px-4 py-3 text-right font-semibold border-b border-gray-200">
                  מסלול
                </th>
                <th className="px-4 py-3 text-right font-semibold border-b border-gray-200">
                  סוג
                </th>
                {sortCols.map((col) => (
                  <th
                    key={col}
                    onClick={() => handleSort(col)}
                    className="px-4 py-3 text-left font-semibold border-b border-gray-200 cursor-pointer hover:bg-blue-100 select-none whitespace-nowrap"
                  >
                    <span className="flex items-center justify-end gap-1">
                      <SortIcon active={sortKey === col} dir={sortDir} />
                      {col === 'yield1y' && '1 שנה'}
                      {col === 'yield3y' && '3 שנים'}
                      {col === 'yield5y' && '5 שנים'}
                      {col === 'yieldSinceInception' && 'מאז הקמה'}
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-left font-semibold border-b border-gray-200 whitespace-nowrap">
                  היקף נכסים
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((m, i) => (
                <tr
                  key={m.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-gray-800 sticky right-0 bg-inherit z-10">
                    {m.house}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{m.name}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                      {m.trackType}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-left ${yieldClass(m.yield1y)} ${sortKey === 'yield1y' ? 'bg-blue-50/70' : ''}`}>
                    {fmt(m.yield1y)}
                  </td>
                  <td className={`px-4 py-3 text-left ${yieldClass(m.yield3y)} ${sortKey === 'yield3y' ? 'bg-blue-50/70' : ''}`}>
                    {fmt(m.yield3y)}
                  </td>
                  <td className={`px-4 py-3 text-left ${yieldClass(m.yield5y)} ${sortKey === 'yield5y' ? 'bg-blue-50/70' : ''}`}>
                    {fmt(m.yield5y)}
                  </td>
                  <td className={`px-4 py-3 text-left ${yieldClass(m.yieldSinceInception)} ${sortKey === 'yieldSinceInception' ? 'bg-blue-50/70' : ''}`}>
                    {fmt(m.yieldSinceInception)}
                  </td>
                  <td className="px-4 py-3 text-left text-gray-500 whitespace-nowrap">
                    {fmtAum(m.aum)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4 text-center">
        * הנתונים הם לצורך הדגמה בלבד. אין לראות בהם ייעוץ השקעות.
      </p>
    </div>
  );
}
