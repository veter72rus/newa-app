import { Suspense } from 'react';
import ComparisonTable from '../components/ComparisonTable';

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-[var(--border)] px-4 py-3 h-20 animate-pulse">
            <div className="h-2 bg-gray-100 rounded w-16 mb-3" />
            <div className="h-5 bg-gray-100 rounded w-12" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-[var(--border)] h-40 animate-pulse" />
      <div className="bg-white rounded-xl border border-[var(--border)] h-96 animate-pulse" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] backdrop-blur-sm" style={{ background: 'rgba(247,246,243,0.85)' }}>
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'var(--accent)' }}>
              נ
            </div>
            <span className="font-semibold text-[var(--text-primary)] tracking-tight">נ.ע.א</span>
            <span className="hidden sm:inline text-xs text-[var(--text-muted)] border-r border-[var(--border)] pr-2.5 mr-0">
              השוואת מסלולי חיסכון
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--text-muted)]">נתוני דגמה · מאי 2025</span>
            <span className="hidden sm:inline bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">Beta</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b border-[var(--border)]" style={{ background: 'var(--surface)' }}>
        <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight leading-tight">
                השוואת תשואות מסלולי חיסכון
              </h1>
              <p className="mt-2 text-[var(--text-secondary)] text-base max-w-xl leading-relaxed">
                השוו בין מסלולי ביטוח ובתי השקעות מובילים בישראל — סננו לפי בית השקעות או סוג מסלול, מיינו לפי תשואה.
              </p>
            </div>
            <div className="sm:text-left shrink-0">
              <p className="text-xs text-[var(--text-muted)]">בתי השקעות</p>
              <p className="text-3xl font-bold text-[var(--text-primary)]">8</p>
              <p className="text-xs text-[var(--text-muted)]">מסלולים: 35</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Suspense fallback={<TableSkeleton />}>
          <ComparisonTable />
        </Suspense>
      </main>
    </div>
  );
}
