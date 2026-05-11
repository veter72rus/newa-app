#!/usr/bin/env node
/**
 * Ingest Keren Hishtalmut (קרנות השתלמות) data from data.gov.il into Postgres.
 *
 * Source:  data.gov.il CKAN datastore — gemelnet open government dataset
 * Run:     DATABASE_URL=postgres://... npx ts-node --project tsconfig.scripts.json scripts/ingest-hishtalmut.ts
 *
 * Idempotent: uses ON CONFLICT (fund_id, report_period) DO UPDATE.
 */

import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'pg';

// ── data.gov.il CKAN datastore ──────────────────────────────────────────────
const RESOURCES: { id: string; label: string }[] = [
  { id: '91c849ed-ddc4-472b-bd09-0f5486cea35c', label: '1999-2022' },
  { id: '2016d770-f094-4a2e-983e-797c26479720', label: '2023' },
  { id: 'a30dcbea-a1d2-482c-ae29-8f781f5025fb', label: '2024-today' },
];

const HISHTALMUT_CLASSIFICATION = 'קרנות השתלמות';
const PAGE_SIZE = 500;
const BASE_URL = 'https://data.gov.il/api/3/action/datastore_search';

// ── types ────────────────────────────────────────────────────────────────────

interface RawRecord {
  FUND_ID: number;
  FUND_NAME: string;
  FUND_CLASSIFICATION: string;
  CONTROLLING_CORPORATION: string;
  MANAGING_CORPORATION: string;
  REPORT_PERIOD: number;
  INCEPTION_DATE: string | null;
  TARGET_POPULATION: string | null;
  SPECIALIZATION: string | null;
  SUB_SPECIALIZATION: string | null;
  TOTAL_ASSETS: number | null;
  AVG_ANNUAL_MANAGEMENT_FEE: number | null;
  AVG_DEPOSIT_FEE: number | null;
  MONTHLY_YIELD: number | null;
  YEAR_TO_DATE_YIELD: number | null;
  YIELD_TRAILING_3_YRS: number | null;
  YIELD_TRAILING_5_YRS: number | null;
  AVG_ANNUAL_YIELD_TRAILING_3YRS: number | null;
  AVG_ANNUAL_YIELD_TRAILING_5YRS: number | null;
  STANDARD_DEVIATION: number | null;
  ALPHA: number | null;
  SHARPE_RATIO: number | null;
}

interface CKANResponse {
  success: boolean;
  result: {
    total: number;
    records: RawRecord[];
    _links: { next?: string };
  };
}

// ── helpers ──────────────────────────────────────────────────────────────────

function reportPeriodToAsofDate(period: number): string {
  const year = Math.floor(period / 100);
  const month = period % 100;
  const lastDay = new Date(year, month, 0).getDate(); // day 0 of next month = last day of this month
  return `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
}

function parseDate(raw: string | null): string | null {
  if (!raw) return null;
  const d = new Date(raw);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split('T')[0];
}

async function fetchPage(resourceId: string, offset: number): Promise<CKANResponse> {
  const url = new URL(BASE_URL);
  url.searchParams.set('resource_id', resourceId);
  url.searchParams.set('limit', String(PAGE_SIZE));
  url.searchParams.set('offset', String(offset));
  url.searchParams.set('filters', JSON.stringify({ FUND_CLASSIFICATION: HISHTALMUT_CLASSIFICATION }));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.json() as Promise<CKANResponse>;
}

// ── upsert ───────────────────────────────────────────────────────────────────

const UPSERT_SQL = `
INSERT INTO hishtalmut_snapshots (
  fund_id, fund_name, house, managing_corp, maslul, sub_maslul,
  target_population, inception_date,
  report_period, asof_date,
  total_assets_mln, avg_annual_mgmt_fee_pct, avg_deposit_fee_pct,
  monthly_yield_pct, ytd_yield_pct,
  yield_1y_pct, yield_3y_pct, yield_5y_pct, yield_since_inception,
  avg_annual_yield_3y_pct, avg_annual_yield_5y_pct,
  standard_deviation, alpha, sharpe_ratio,
  source_resource_id
) VALUES (
  $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25
)
ON CONFLICT (fund_id, report_period) DO UPDATE SET
  fund_name               = EXCLUDED.fund_name,
  house                   = EXCLUDED.house,
  managing_corp           = EXCLUDED.managing_corp,
  maslul                  = EXCLUDED.maslul,
  sub_maslul              = EXCLUDED.sub_maslul,
  target_population       = EXCLUDED.target_population,
  inception_date          = EXCLUDED.inception_date,
  asof_date               = EXCLUDED.asof_date,
  total_assets_mln        = EXCLUDED.total_assets_mln,
  avg_annual_mgmt_fee_pct = EXCLUDED.avg_annual_mgmt_fee_pct,
  avg_deposit_fee_pct     = EXCLUDED.avg_deposit_fee_pct,
  monthly_yield_pct       = EXCLUDED.monthly_yield_pct,
  ytd_yield_pct           = EXCLUDED.ytd_yield_pct,
  yield_3y_pct            = EXCLUDED.yield_3y_pct,
  yield_5y_pct            = EXCLUDED.yield_5y_pct,
  avg_annual_yield_3y_pct = EXCLUDED.avg_annual_yield_3y_pct,
  avg_annual_yield_5y_pct = EXCLUDED.avg_annual_yield_5y_pct,
  standard_deviation      = EXCLUDED.standard_deviation,
  alpha                   = EXCLUDED.alpha,
  sharpe_ratio            = EXCLUDED.sharpe_ratio,
  source_resource_id      = EXCLUDED.source_resource_id,
  ingested_at             = NOW()
`;

async function upsertRecords(client: Client, records: RawRecord[], resourceId: string): Promise<number> {
  let count = 0;
  for (const r of records) {
    const asofDate = reportPeriodToAsofDate(r.REPORT_PERIOD);
    await client.query(UPSERT_SQL, [
      r.FUND_ID,
      r.FUND_NAME,
      r.CONTROLLING_CORPORATION,
      r.MANAGING_CORPORATION,
      r.SPECIALIZATION ?? null,
      r.SUB_SPECIALIZATION ?? null,
      r.TARGET_POPULATION ?? null,
      parseDate(r.INCEPTION_DATE),
      r.REPORT_PERIOD,
      asofDate,
      r.TOTAL_ASSETS ?? null,
      r.AVG_ANNUAL_MANAGEMENT_FEE ?? null,
      r.AVG_DEPOSIT_FEE ?? null,
      r.MONTHLY_YIELD ?? null,
      r.YEAR_TO_DATE_YIELD ?? null,
      null,                                  // yield_1y_pct — not in source
      r.YIELD_TRAILING_3_YRS ?? null,
      r.YIELD_TRAILING_5_YRS ?? null,
      null,                                  // yield_since_inception — not in source
      r.AVG_ANNUAL_YIELD_TRAILING_3YRS ?? null,
      r.AVG_ANNUAL_YIELD_TRAILING_5YRS ?? null,
      r.STANDARD_DEVIATION ?? null,
      r.ALPHA ?? null,
      r.SHARPE_RATIO ?? null,
      resourceId,
    ]);
    count++;
  }
  return count;
}

// ── main ─────────────────────────────────────────────────────────────────────

async function ingest() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error('DATABASE_URL env var is required');

  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  console.log('Connected to Postgres');

  try {
    // Run migration if table does not exist yet
    const migrationPath = path.join(__dirname, '..', 'db', 'migrations', '001_create_hishtalmut_snapshots.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    await client.query(migrationSql);
    console.log('Migration applied (idempotent)');

    let grandTotal = 0;

    for (const resource of RESOURCES) {
      console.log(`\nIngesting resource: ${resource.label} (${resource.id})`);
      let offset = 0;
      let resourceTotal = 0;

      while (true) {
        const page = await fetchPage(resource.id, offset);
        if (!page.success) throw new Error(`CKAN error for resource ${resource.id}`);

        const total = page.result.total;
        const records = page.result.records;
        if (records.length === 0) break;

        const inserted = await upsertRecords(client, records, resource.id);
        resourceTotal += inserted;
        offset += records.length;

        process.stdout.write(`  ${offset}/${total} upserted\r`);

        if (offset >= total) break;
      }

      console.log(`  Done: ${resourceTotal} rows for ${resource.label}`);
      grandTotal += resourceTotal;
    }

    console.log(`\nIngestion complete. Total rows processed: ${grandTotal}`);
  } finally {
    await client.end();
  }
}

ingest().catch(err => {
  console.error('Ingestion failed:', err);
  process.exit(1);
});
