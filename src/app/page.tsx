import { Suspense } from 'react';
import ComparisonTable from '../components/ComparisonTable';

function LoadingState() {
  return (
    <div className="text-center py-16 text-gray-400">
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
        <div className="h-4 bg-gray-200 rounded w-2/4 mx-auto" />
        <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto" />
      </div>
      <p className="mt-4 text-sm">טוען נתונים...</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-blue-700">נ.ע.א</h1>
            <p className="text-xs text-gray-500">השוואת תשואות מסלולי ביטוח</p>
          </div>
          <div className="text-xs text-gray-400 text-left">
            עדכון אחרון:<br />
            <span className="font-medium">מאי 2025</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-b from-blue-700 to-blue-600 text-white px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            השוואת תשואות מסלולי חיסכון
          </h2>
          <p className="text-blue-100 text-base sm:text-lg max-w-2xl">
            השוו תשואות בין מסלולי ביטוח ובתי השקעות שונים בישראל — סננו, מיינו, ומצאו את המסלול המתאים לכם.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Suspense fallback={<LoadingState />}>
          <ComparisonTable />
        </Suspense>
      </div>
    </main>
  );
}
