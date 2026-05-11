-- Smoke check: top-10 Keren Hishtalmut funds by 3-year cumulative yield
-- for the most recent reporting period that has 3y yield data.
--
-- Confirmed output (2023 resource, period 202312):
--   1. קרן השתלמות למורים  | כללי | AUM 566M | fee 0.18% | 3y 18.61% | 5y 33.56%
--   ...
--
-- Run: psql $DATABASE_URL -f scripts/smoke-check.sql

SELECT
  s.fund_name,
  s.house,
  s.maslul,
  s.report_period,
  s.asof_date,
  s.total_assets_mln    AS aum_mln,
  s.avg_annual_mgmt_fee_pct AS mgmt_fee_pct,
  s.yield_3y_pct,
  s.avg_annual_yield_3y_pct,
  s.yield_5y_pct,
  s.ytd_yield_pct
FROM hishtalmut_snapshots s
WHERE s.report_period = (
  -- latest period that actually has 3y yield data
  SELECT MAX(report_period)
  FROM hishtalmut_snapshots
  WHERE yield_3y_pct IS NOT NULL
)
ORDER BY s.yield_3y_pct DESC
LIMIT 10;
