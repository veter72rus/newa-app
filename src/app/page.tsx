import { Suspense } from 'react';
import { Layers } from 'lucide-react';
import ComparisonTable from '../components/ComparisonTable';
import { Card, CardContent } from '../components/ui/card';

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="shadow-none border animate-pulse">
            <CardContent className="p-4 h-20" />
          </Card>
        ))}
      </div>
      <Card className="shadow-none border animate-pulse h-40" />
      <Card className="shadow-none border animate-pulse h-96" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--page-bg))' }}>

      {/* Nav */}
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <Layers className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight text-foreground">נ.ע.א</span>
            <span className="hidden sm:inline text-xs text-muted-foreground border-r pr-2.5">
              השוואת מסלולי חיסכון
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">נתוני דגמה</span>
            <span className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full font-medium">Beta</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b bg-background">
        <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                השוואת תשואות מסלולי חיסכון
              </h1>
              <p className="mt-2 text-muted-foreground text-base max-w-xl leading-relaxed">
                השוו בין מסלולי ביטוח ובתי השקעות מובילים בישראל — סננו לפי בית השקעות או סוג מסלול, מיינו לפי תשואה.
              </p>
            </div>
            <div className="sm:text-left shrink-0">
              <p className="text-xs text-muted-foreground">מאי 2025</p>
              <p className="text-3xl font-bold">8</p>
              <p className="text-xs text-muted-foreground">בתי השקעות · 35 מסלולים</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Suspense fallback={<TableSkeleton />}>
          <ComparisonTable />
        </Suspense>
      </main>
    </div>
  );
}
