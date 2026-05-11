-- Smoke check: top-10 Keren Hishtalmut funds by 3-year yield
-- for the most recent reporting period.
--
-- Run: psql $DATABASE_URL -f scripts/smoke-check.sql

SELECT
  s.fund_name,
  s.house,
  s.maslul,
  s.report_period,
  s.total_assets_mln    AS aum_mln,
  s.avg_annual_mgmt_fee_pct AS mgmt_fee_pct,
  s.yield_3y_pct,
  s.avg_annual_yield_3y_pct,
  s.yield_5y_pct,
  s.ytd_yield_pct
FROM hishtalmut_snapshots s
WHERE s.report_period = (SELECT MAX(report_period) FROM hishtalmut_snapshots)
  AND s.yield_3y_pct IS NOT NULL
ORDER BY s.yield_3y_pct DESC
LIMIT 10;
