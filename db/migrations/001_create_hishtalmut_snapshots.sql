-- Migration 001: hishtalmut_snapshots
-- Source: data.gov.il CKAN datastore (gemelnet open data)
-- One row per fund per reporting month (YYYYMM).

CREATE TABLE IF NOT EXISTS hishtalmut_snapshots (
  id                      BIGSERIAL PRIMARY KEY,

  -- Fund identity
  fund_id                 INTEGER     NOT NULL,
  fund_name               TEXT        NOT NULL,
  house                   TEXT        NOT NULL,  -- CONTROLLING_CORPORATION (investment house)
  managing_corp           TEXT        NOT NULL,  -- MANAGING_CORPORATION
  maslul                  TEXT,                  -- SPECIALIZATION (track type, e.g. "כללי")
  sub_maslul              TEXT,                  -- SUB_SPECIALIZATION
  target_population       TEXT,
  inception_date          DATE,

  -- Time dimension
  report_period           INTEGER     NOT NULL,  -- YYYYMM, e.g. 202401
  asof_date               DATE        NOT NULL,  -- last calendar day of report_period month

  -- AUM & fees
  total_assets_mln        NUMERIC(16, 2),        -- AUM in millions NIS
  avg_annual_mgmt_fee_pct NUMERIC(8, 4),
  avg_deposit_fee_pct     NUMERIC(8, 4),

  -- Yields (%)
  monthly_yield_pct       NUMERIC(8, 4),
  ytd_yield_pct           NUMERIC(8, 4),
  yield_1y_pct            NUMERIC(8, 4),         -- not in source; NULL for now
  yield_3y_pct            NUMERIC(8, 4),         -- YIELD_TRAILING_3_YRS (cumulative)
  yield_5y_pct            NUMERIC(8, 4),         -- YIELD_TRAILING_5_YRS (cumulative)
  yield_since_inception   NUMERIC(8, 4),         -- not in source; NULL for now
  avg_annual_yield_3y_pct NUMERIC(8, 4),
  avg_annual_yield_5y_pct NUMERIC(8, 4),

  -- Risk
  standard_deviation      NUMERIC(8, 4),
  alpha                   NUMERIC(8, 4),
  sharpe_ratio            NUMERIC(8, 4),

  -- Provenance
  source_resource_id      TEXT        NOT NULL,
  ingested_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_hishtalmut_fund_period UNIQUE (fund_id, report_period)
);

CREATE INDEX IF NOT EXISTS idx_hishtalmut_report_period
  ON hishtalmut_snapshots (report_period DESC);

CREATE INDEX IF NOT EXISTS idx_hishtalmut_house
  ON hishtalmut_snapshots (house);

CREATE INDEX IF NOT EXISTS idx_hishtalmut_yield_3y
  ON hishtalmut_snapshots (yield_3y_pct DESC NULLS LAST);
