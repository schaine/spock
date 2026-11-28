-- Reference rows for the first Series: FRED's UNRATE, Indicator 1 for the
-- United States (docs/research/starter-indicators.md, Indicator 1).
-- The full list of Indicators and Series comes with ticket #20.

insert into public.regions (code, name) values
  ('US', 'United States'),
  ('FR', 'France'),
  ('EU', 'European Union');

insert into public.publishers (code, name) values
  ('FRED', 'FRED');

insert into public.indicators (number, name, core_family, timing) values
  (1, 'Unemployment rate', 'Jobs and labour markets', 'lagging');

insert into public.series (
  indicator_number, region_code, publisher_code, publisher_series_code,
  frequency, unit, seasonally_adjusted, wave, status
) values
  (1, 'US', 'FRED', 'UNRATE', 'monthly', 'percent', true, 1, 'active');
