# Starter Indicators and Watched relationships

Research note for issue #3: which Indicators and Watched relationships the
first version of Spock should contain. First written on 2026-11-19; revised
the same day after a second check directly at the publishers and after the
Owner's decisions (see
[Decisions by the Owner (2026-11-19)](#decisions-by-the-owner-2026-11-19)).

## In short

- **26 Indicators** across the five Core families: Jobs and labour markets
  (6), Productivity, wages and income distribution (4), Household income and
  consumption (4), Financial conditions and business failures (5), AI
  investment and technological adoption (7).
- **9 Watched relationships**, from "are workers getting their share of AI's
  gains?" to "is AI adoption showing up in productivity in all three
  Regions?".
- Almost everything comes from **free official sources with a documented
  API** (an API is a web address a program can call to fetch data
  automatically, instead of a person downloading a file). Five publishers
  cover most of the list: FRED (which republishes US agency data), Eurostat,
  the ECB, the European Commission's AMECO database and the SEC. **France
  comes from Eurostat**, so France and the European Union are measured the
  same way; INSEE and the Banque de France are left out for now.
- **The Owner needs three free keys** (a key is a password-like code that
  identifies who is calling an API): FRED, BLS and the US Census Bureau. The
  SEC needs no key but asks for a contact email, which will be the Owner's
  personal email, stored as a private setting and never written in this
  repository. See
  [Keys, registration and usage limits](#keys-registration-and-usage-limits).
- **The United States has the richest data.** France and the European Union
  are thinner on AI-exposed occupations (yearly instead of monthly), on bank
  lending and financial stress (only the member states that use the euro),
  on household loan arrears (yearly only) and on AI investment (no
  data-centre or company-spending equivalent).
- **Better history than first thought.** Eurostat's French figures for jobs,
  productivity, pay, household income and saving start in **1980 to 1983**,
  so France can be compared with the Internet wave without INSEE. The
  European Union as a whole mostly starts in 1995 to 2000.
- **Most claims are now checked at the source.** In a second pass on
  2026-11-19, codes, frequencies and start dates were checked directly at
  the publishers (mark **[V]**). What could not be checked is still marked,
  with the reason: mainly the BLS website, the SEC website (which refuses
  requests without a declared contact) and the BLS API's daily limit.

## How this note was checked

Every fact below carries one of three marks:

- **[V]**: verified directly at the publisher on 2026-11-19, by opening the
  publisher's page, file or API answer.
- **[S]**: seen on the publisher's own page, but only through a web-search
  result describing that page; the page itself could not be opened.
- **[U]**: unverified. Comes from prior knowledge, from an unofficial copy
  of the data, or from the Owner's earlier reading, and could not be checked
  in either pass. Treat it as a lead, not a fact.

**First pass (morning of 2026-11-19).** The cloud session could not open any
publisher's website: the network gateway refused every host with "403
Forbidden". Claims were marked [S] or [U] only.

**Second pass (evening of 2026-11-19).** The publishers' hosts were added to
the cloud environment. Each kept Indicator was then checked as follows:

- **FRED**: the page of each code at `fred.stlouisfed.org/series/<code>`,
  which gives the title, units, frequency, first and last date, and often
  the original publisher's code. (FRED's free download link without a key
  did not answer from this network, so the pages were used instead.)
- **Eurostat**: the dissemination API, without a key, for each dataset with
  France (`FR`) and the European Union (`EU27_2020`), reading the first and
  last date that has a value; plus Eurostat's catalogue of all datasets, to
  find closed and replacement datasets.
- **ECB**: the data API, without a key, for each exact code.
- **AMECO** (European Commission): its web query service on `ec.europa.eu`.
- **SEC**: the `data.sec.gov` API for each company's reported figures and
  list of filings.
- **US Census Bureau** and **US Courts**: their web pages and downloadable
  files.

**Still blocked in the second pass:**

- `www.bls.gov` refused every request ("403 Forbidden"), even when the
  request imitated a web browser. BLS facts seen only through search stay
  [S].
- The BLS API (`api.bls.gov`) answered once, then refused: the daily
  allowance for callers without a key, shared by everyone on this network,
  was used up. This is itself a reason to get the free BLS key.
- `www.sec.gov` refused this pass's requests, which did not carry a
  declared contact. Anthropic's prospectus (a large document on
  `www.sec.gov`) had been downloaded earlier the same day by the main
  session, and its figures were then read from that copy, so they are [V].
  `data.sec.gov` answered normally.
- The Census API now refuses every request without a key (it sends callers
  to a "missing key" page) [V], so what it holds was not checked.

### Words used in this note

- **Publisher code** (publishers call it a *series ID* or *dataset code*):
  the publisher's own label for one data feed, such as `UNRATE` at FRED.
- **Frequency**: how often a new value is published (monthly, quarterly,
  yearly).
- **Seasonally adjusted**: corrected for regular calendar effects (summer
  jobs, Christmas shopping) so that months can be compared with each other.
  Eurostat writes `SA` (seasonally adjusted) and `SCA` (seasonally and
  calendar adjusted, which also corrects for the number of working days).
- **Index (2017 = 100)**: a value shown relative to a reference year set to
  100. A value of 110 means 10% higher than in 2017.
- **Chain-linked volumes** or **quantity index**: a value corrected for
  price changes, so that it measures quantities rather than money.
- **ISCO / SOC**: job classifications. ISCO is the international one used by
  Eurostat; SOC is the US one.
- **NACE**: the European classification of industries. Eurostat is moving
  from version 2 to **version 2.1**, which changes some section letters
  (for example, IT services move from section J to section K). National
  accounts still use version 2 [V].
- **Computed by Spock**: an Indicator that no publisher publishes as such,
  which Spock calculates from published figures, with the method shown.

## The 26 Indicators

Each Indicator below gives what it measures, why it reveals the economic
consequences of AI, its Core family, whether it is Leading or Lagging, a
table with one row per Region, and which industry breakdown exists.

"Before 1995?" says whether the data goes back far enough to compare with
the Internet wave (1995 to 2005), the main Historical episode.

Some Indicators move at about the same time as the economy rather than
clearly before or after. The glossary has only two labels, so those were
placed where they best fit Spock's purpose; the reason is given each time.

"Since" gives the first date with a value, as found at the publisher.

### Family 1: Jobs and labour markets

#### 1. Unemployment rate

Share of people who want a job and are actively looking but have none. It is
the final, widely understood measure of whether job losses from AI are
outpacing new jobs.

- Core family: Jobs and labour markets
- **Lagging**: firms usually stop hiring and cut hours before they lay off.

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BLS (Current Population Survey), via FRED | `UNRATE` (BLS `LNS14000000`) [V] | Monthly [V] | January 1948 [V] | Yes | FRED API (key) [V] |
| France | Eurostat (data from INSEE's Labour Force Survey) | `une_rt_m`, geo `FR`, age `TOTAL`, `SA`, unit `PC_ACT` [V] | Monthly [V] | January 1983 [V] | Yes | Eurostat API (no key) [V] |
| European Union | Eurostat | `une_rt_m`, geo `EU27_2020`, same options [V] | Monthly [V] | January 2000 [V] | No | Eurostat API [V] |

Notes: from the second quarter of 2026, INSEE publishes its labour figures
for all of France including Mayotte, with long figures rebuilt back to 1982;
the old "France excluding Mayotte" rate is kept only in a side file [V]
([INSEE methodological note 2026 Q2](https://www.insee.fr/fr/statistiques/documentation/Note_methodologique_2026T2.pdf)).
Eurostat's French figure comes from the same survey, so a break or revision
may appear in it; the first build should compare the two once.

Industry breakdown: United States, unemployment by industry of the last job
(for example `LNU04032237`, information industry, monthly from 2000, not
seasonally adjusted) [V]; France and European Union, none in this monthly
dataset (only age and sex) [V].

#### 2. Total employment

Number of people in work. With output (Indicator 24) and productivity
(Indicator 7), it shows whether the economy grows while employing fewer
people.

- Core family: Jobs and labour markets
- **Lagging**: it confirms what openings and hiring plans showed earlier.

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BLS (payroll survey), via FRED | `PAYEMS` (BLS `CES0000000001`) [V] | Monthly [V] | January 1939 [V] | Yes | FRED API |
| France | Eurostat (national accounts) | `namq_10_pe`, geo `FR`, `EMP_DC`, unit `THS_PER`, `SA` [V] | Quarterly [V] | 1980 Q1 [V] | Yes | Eurostat API |
| European Union | Eurostat (national accounts) | `namq_10_pe`, geo `EU27_2020`, `EMP_DC`, `SCA` [V] | Quarterly [V] | 1995 Q1 [V] | No | Eurostat API |

France is published seasonally adjusted but not calendar adjusted (`SA`);
the EU total is published with both (`SCA`) [V]. The difference is small but
should be shown.

Industry breakdown: United States, every industry in the payroll survey (for
example `USINFO`, Indicator 6) [V]; France and European Union, ten industry
groups in `namq_10_a10_e` (agriculture, industry, construction, trade and
transport, information and communication, finance, real estate,
professional services, public services, other services) [V].

#### 3. Job openings (vacancies)

Number or share of jobs employers are trying to fill. If AI lets firms do
more with the same staff, openings fall before unemployment rises.

- Core family: Jobs and labour markets
- **Leading**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BLS (JOLTS survey), via FRED | `JTSJOL` [V] (BLS `JTS000000000000000JOL` [U]) | Monthly [V] | December 2000 [V] | No | FRED API |
| France | Eurostat job vacancy statistics (data from DARES) | `jvs_q_r21`, geo `FR`, all industries `B-T`, all firm sizes `TOTAL` [V] | Quarterly [V] | 2011 Q2 for all firm sizes; 2003 Q2 for firms with 10 or more employees [V] | No | Eurostat API |
| European Union | Eurostat | `jvs_q_r21`, geo `EU27_2020`, `B-T`; only the vacancy rate (`JVR`) is published for the EU total, not a count [V] | Quarterly [V] | 2010 Q1 [V] | No | Eurostat API |

**Correction:** the first pass named `jvs_q_nace2`. Eurostat closed it with
data up to the end of 2025; its replacement, by NACE version 2.1, is
`jvs_q_r21`, which holds the full history from 2001 [V].

Notes: JOLTS gives openings by industry and US census region, **not by
occupation** [S] ([BLS JOLTS history](https://www.bls.gov/opub/hom/jlt/history.htm));
FRED lists a table "Job Openings by Industry and Region" [V]. Eurostat says
France's vacancy figures are "not strictly comparable" with other member
states [V]
([Eurostat release, March 2024](https://ec.europa.eu/eurostat/en/web/products-euro-indicators/w/3-15032024-ap)).
France's survey covered workplaces with 10 or more employees from 2003 Q2 to
2011 Q1 and workplaces with 1 or more employee from 2011 Q2 [V]
([Eurostat metadata for France](https://ec.europa.eu/eurostat/cache/metadata/EN/jvs_esqrs_fr.htm)).

Industry breakdown: United States, JOLTS by industry (for example
`JTU5100JOL`, information, from December 2000, not seasonally adjusted) [V];
France and European Union, 33 industry groups by NACE version 2.1 [V].

#### 4. Youth unemployment rate (under 25)

Unemployment among young people. AI first replaces the junior,
routine tasks that young people are hired for, so they may be hit before
everyone else.

- Core family: Jobs and labour markets
- **Leading**: entry-level hiring freezes show here before they reach the
  overall rate.

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BLS, via FRED | `LNS14024887` (ages 16 to 24) [V] | Monthly [V] | January 1948 [V] | Yes | FRED API |
| France | Eurostat | `une_rt_m`, geo `FR`, age `Y_LT25` [V] | Monthly [V] | January 1983 [V] | Yes | Eurostat API |
| European Union | Eurostat | `une_rt_m`, geo `EU27_2020`, age `Y_LT25` [V] | Monthly [V] | January 2000 [V] | No | Eurostat API |

The US uses ages 16 to 24, Eurostat 15 to 24 [U]: the levels are not
directly comparable, only their direction.

Industry breakdown: none in any Region for this age group.

#### 5. Employment in AI-exposed occupations

Number of people working in administrative work, customer support,
translation and software development. This is the most direct measure of
whether AI is replacing work. Details are in
[AI-exposed occupations](#ai-exposed-occupations).

- Core family: Jobs and labour markets
- **Leading**: job losses in these occupations should come before effects on
  overall unemployment, income and spending.

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BLS (OEWS survey) | OEWS by SOC code, e.g. `43-0000`, `43-4051`, `27-3091`, `15-1252` [U] | Yearly (May reference) [S] | 1997 [S] | No | BLS API, latest year only [U]; files for history |
| France | Eurostat (Labour Force Survey) | `lfsa_egai2d`, geo `FR`, codes `OC41`, `OC42`, `OC25` [V] | Yearly [V] | 2011 [V] | No | Eurostat API |
| European Union | Eurostat (Labour Force Survey) | `lfsa_egai2d`, geo `EU27_2020`, same codes [V] | Yearly [V] | 2011 [V] | No (older data uses a different classification [U]) | Eurostat API |

**Corrections:** Eurostat's occupation codes carry the prefix `OC` (`OC41`,
not `41`) [V]. France Travail's hiring-plans survey (BMO) is no longer
proposed here: see [Later additions](#later-additions).

Industry breakdown: not used. This Indicator is already a breakdown, by
occupation.

#### 6. Employment in the information and professional-services industries

Number of people working in the industries that use AI most, such as
publishing, telecoms, IT services, consulting, legal and accounting. Industry
data is monthly or quarterly, so it moves faster than the yearly occupation
data of Indicator 5.

- Core family: Jobs and labour markets
- **Leading**: these industries adopt AI first.

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BLS, via FRED | `USINFO` (Information, BLS `CES5000000001`) [V]; `CES6054000001` (professional, scientific and technical services) [V]; `CES6054150001` (computer systems design) [V] | Monthly [V] | January 1939 (Information) [V]; January 1990 (the others) [V] | Yes | FRED API |
| France | Eurostat (national accounts by industry) | `namq_10_a10_e`, geo `FR`, NACE `J` and `M_N`, `SA` [V] | Quarterly [V] | 1980 Q1 [V] | Yes | Eurostat API |
| European Union | Eurostat | `namq_10_a10_e`, geo `EU27_2020`, `J` and `M_N`, `SCA` [V] | Quarterly [V] | 1995 Q1 [V] | No | Eurostat API |

Industry breakdown: this Indicator is itself the industry detail of
Indicator 2.

### Family 2: Productivity, wages and income distribution

#### 7. Labour productivity per hour

Output produced per hour worked. If AI makes workers more productive, this
rises; it is the first place the benefit of AI should appear.

- Core family: Productivity, wages and income distribution
- **Leading**: productivity gains come before their effects on wages and
  jobs.

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BLS (Productivity and Costs), via FRED | `OPHNFB`, nonfarm business, index 2017 = 100, seasonally adjusted [V] | Quarterly [V] | 1947 Q1 [V] | Yes | FRED API |
| France | Eurostat | `namq_10_lp_ulc`, geo `FR`, `RLPR_HW` (real labour productivity per hour worked), index 2020 = 100, `SCA` [V] | Quarterly [V] | 1980 Q1 [V] | Yes | Eurostat API |
| European Union | Eurostat | `namq_10_lp_ulc`, geo `EU27_2020`, same options [V] | Quarterly [V] | 1995 Q1 [V] | No | Eurostat API |

**Correction:** France's figure starts in 1980, not 1995 [V]. For the EU
total, AMECO (Indicator 9) has yearly figures from 1995 only [V], so it
does not reach further back.

Industry breakdown: United States, BLS publishes productivity for detailed
industries in a separate programme [U], not used here; France and European
Union, none published in this dataset [V]. It could be computed by Spock
from value added (`namq_10_a10`) and hours (`namq_10_a10_e`) by industry,
both of which exist [V].

#### 8. Real compensation per hour

Pay per hour worked (wages plus employer contributions), corrected for price
rises. It tells whether workers share in AI productivity gains.

- Core family: Productivity, wages and income distribution
- **Lagging**: pay adjusts slowly, through contracts and negotiations.

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BLS, via FRED | `COMPRNFB`, nonfarm business, index 2017 = 100, seasonally adjusted [V] | Quarterly [V] | 1947 Q1 [V] | Yes | FRED API |
| France | **Computed by Spock** from Eurostat: compensation of employees ÷ hours worked ÷ price of household consumption | `namq_10_a10`, `TOTAL`, `D1`, `SA` (France has no `SCA` version) [V]; `namq_10_a10_e`, `TOTAL`, `EMP_DC`, unit `THS_HW` [V]; price of household consumption = `namq_10_gdp`, `P31_S14`, current prices ÷ chain-linked volumes [V] | Quarterly | 1980 Q1 [V] | Yes | Eurostat API |
| European Union | **Computed by Spock**, same method | Same codes, geo `EU27_2020`, `SCA` [V] | Quarterly | 1995 Q1 [V] | No | Eurostat API |

**Corrections:** the consumer price dataset named in the first pass,
`prc_hicp_midx`, was closed with data up to December 2025; its replacement
is `prc_hicp_minr` [V]. The EU price index starts in December 1999 in the
replacement, not 1996 [V].

The Owner accepted computed Indicators (decision 2) and chose the price of
household consumption from the national accounts over consumer prices
(HICP), for the longer history: France then covers the Internet wave
(decision 15). The consumer price index `prc_hicp_minr` (France from 1996,
EU from 1999) stays available as an alternative.
Source for the US code: [FRED COMPRNFB](https://fred.stlouisfed.org/series/COMPRNFB) [V].

Industry breakdown: United States, none for this figure; France and European
Union, compensation is published by industry in `namq_10_a10` [V], so a
computed industry version is possible.

#### 9. Labour share of income

Share of the value produced that goes to workers as pay, the rest going to
profits and capital. If AI replaces labour with machines and software, this
share falls.

- Core family: Productivity, wages and income distribution
- **Lagging**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BLS, via FRED | `PRS85006173`, nonfarm business labour share, index 2017 = 100 [V] | Quarterly [V] | 1947 Q1 [V] | Yes | FRED API |
| France | European Commission (AMECO) | Adjusted wage share, `ALCD2`, % of GDP at factor cost [V] | Yearly [V] | 1960 [V] | Yes | AMECO web query on `ec.europa.eu`, no key [V]; no documented API [U] |
| European Union | European Commission (AMECO) | `ALCD2`, EU27 [V] | Yearly [V] | 1995 [V] | No | Same |

**Corrections:** the EU total starts in 1995, not 1960 [V]. AMECO's latest
years are the Commission's **forecasts** (in November 2026 it showed values
for 2026 and 2027) [V]; Spock keeps only past years (decision 20).

A quarterly French and EU version can be computed from Eurostat national
accounts (compensation of employees divided by value added), but it ignores
the self-employed [U]. The BLS figure is an index of labour's share of
business output, not a percentage of GDP [V].

Note: labour share moves roughly as real pay divided by productivity
(Indicators 8 and 7), which is why it supports Watched relationship W1.

Industry breakdown: none in any Region.

#### 10. Income inequality (Gini coefficient)

A single number from 0 (everyone has the same income) to 1 (one person has
everything). It shows whether AI's gains concentrate on a few.

- Core family: Productivity, wages and income distribution
- **Lagging**: surveys are yearly and published one to two years late.

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | Census Bureau, via FRED | `GINIALLRH` (household income, scale 0 to 1) [V] | Yearly [V] | 1967 [V] | Yes | FRED API |
| France | Eurostat (EU-SILC survey) | `ilc_di12`, geo `FR`, `GINI_HND` (scale 0 to 100) [V] | Yearly [V] | 2004 [V] | No | Eurostat API |
| European Union | Eurostat (EU-SILC survey) | `ilc_di12`, geo `EU27_2020`, `GINI_HND` [V] | Yearly [V] | 2010 [V] | No | Eurostat API |

The US and Eurostat use different scales (0 to 1 and 0 to 100) [V] and
different income definitions; compare their direction only.

Industry breakdown: none (Eurostat splits by age only) [V].

### Family 3: Household income and consumption

#### 11. Real household disposable income

Income households have left after taxes and benefits, corrected for price
rises ("purchasing power"). If AI reduces jobs or pay, this is where
households feel it.

- Core family: Household income and consumption
- **Lagging**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BEA, via FRED | `DSPIC96`, chained 2017 dollars, total [V] | Monthly [V] | January 1959 [V] | Yes | FRED API |
| France | Eurostat (sector accounts) | `nasq_10_ki`, geo `FR`, `B6G_R_HAB_2010` (real gross disposable income per person, 2010 = 100), `SCA` [V] | Quarterly [V] | 1980 Q1 [V] | Yes | Eurostat API |
| European Union | Eurostat | `nasq_10_ki`, geo `EU27_2020`, same [V] | Quarterly [V] | 1999 Q1 [V] | No | Eurostat API |

**Correction:** France via Eurostat starts in 1980, not 1999 [V]. Eurostat's
figure is per person; the US figure is a total [V]. Spock should divide the
US figure by population, or compare growth rates only.

Industry breakdown: not applicable (households, not industries).

#### 12. Real household consumption

What households spend, corrected for price rises. It tells whether AI's
effects on jobs and income have reached demand, which is the third concern
named in the glossary.

- Core family: Household income and consumption
- **Lagging**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BEA, via FRED | `PCEC96` (monthly) [V]; `PCECC96` (quarterly) [V] | Monthly / quarterly [V] | January 2007 monthly [V]; 1947 Q1 quarterly [V] | Yes (quarterly) | FRED API |
| France | Eurostat | `namq_10_gdp`, `P31_S14`, unit `CLV20_MEUR`, `SCA`, geo `FR` [V] | Quarterly [V] | 1980 Q1 [V] | Yes | Eurostat API |
| European Union | Eurostat | `namq_10_gdp`, `P31_S14`, `EU27_2020` [V] | Quarterly [V] | 1995 Q1 [V] | No | Eurostat API |

**Corrections:** FRED's monthly figure starts in 2007, not 2002 [V]. France
via Eurostat starts in 1980, not 1995 [V].

Industry breakdown: not applicable.

#### 13. Household saving rate

Share of disposable income households save rather than spend. Households
who fear for their jobs save more; a rising saving rate can come before weaker
spending ahead.

- Core family: Household income and consumption
- **Leading**: precautionary saving rises before spending falls.

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BEA, via FRED | `PSAVERT` [V] | Monthly [V] | January 1959 [V] | Yes | FRED API |
| France | Eurostat | `nasq_10_ki`, `SRG_S14_S15` (gross household saving rate), `SCA`, geo `FR` [V] | Quarterly [V] | 1980 Q1 [V] | Yes | Eurostat API |
| European Union | Eurostat | `nasq_10_ki`, `SRG_S14_S15`, `EU27_2020` [V] | Quarterly [V] | 1999 Q1 [V] | No | Eurostat API |

Eurostat's rate is "gross" [V]; the US rate is net of depreciation [U].
Compare their direction, not their level.

Industry breakdown: not applicable.

#### 14. Consumer confidence and unemployment fears

Monthly surveys asking households how they see their finances and whether
they expect unemployment to rise. Fear of AI-driven job loss should show here
before it shows in spending.

- Core family: Household income and consumption
- **Leading**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | **New York Fed** (Survey of Consumer Expectations): mean probability that US unemployment will be higher in a year (decision 22) | To be checked at the publisher before the build [U] | Monthly [S] | 2013 [U] | No | Downloadable file [U] |
| France | European Commission survey, via Eurostat | `ei_bsco_m`, geo `FR`, `BS-CSMCI` (confidence) and `BS-UE-NY` (unemployment expectations), `SA` [V] | Monthly [V] | January 1985 [V] | Yes | Eurostat API |
| European Union | European Commission survey, via Eurostat | `ei_bsco_m`, geo `EU27_2020`, same codes [V] | Monthly [V] | January 1985 [V] | Yes | Eurostat API |

**Corrections:** the EU unemployment-expectations code is `BS-UE-NY` [V];
the EU total starts in January 1985 [V]. INSEE's own French survey is no
longer used (decision 1); it is weighted differently from the European
Commission's French figure and can move differently [S].

**Replaced (decision 22):** the University of Michigan index (`UMCSENT`) is
the only copyrighted Series of the starter list on FRED [V]. FRED's terms
require the data owner's permission for anything beyond personal use [V],
and the University's own pages say republishing needs its written consent
[S]. The New York Fed's survey allows free reuse according to its terms [S];
it also asks almost the same question as the European Commission's
unemployment expectations (`BS-UE-NY`). The US has no confidence figure in
the starter list, labelled as such. The OECD's US confidence index on FRED
(`CSCICP03USM665S`) stopped in January 2024 [V].

Industry breakdown: not applicable.

### Family 4: Financial conditions and business failures

#### 15. Business failures (insolvencies)

Number of firms going bankrupt. It shows firms whose business AI makes
obsolete (for example call centres or translation agencies), and also the
overall strain on firms.

- Core family: Financial conditions and business failures
- **Lagging**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | Administrative Office of the US Courts | Table F-2, "Business and Nonbusiness Cases Filed, by Chapter of the Bankruptcy Code" [V] | Quarterly [V] | Quarterly tables listed on the site from 2007 [V]; older years [U] | Probably [U] | **No API**: one PDF and one Excel file per quarter [V] |
| France | Eurostat | `sts_rb_q`, `BKRT` (bankruptcy declarations), geo `FR`, index 2021 = 100, `SCA` [V] | Quarterly [V] (monthly in `sts_rb_m` [V]) | 2015 Q1 [V] | No | Eurostat API |
| European Union | Eurostat | `sts_rb_q`, `BKRT`, geo `EU27_2020` [V] | Quarterly [V] (monthly in `sts_rb_m` [V]) | 2015 Q1 [V] | No | Eurostat API |

France now comes from Eurostat, not the Banque de France (decisions 1 and 4).
Eurostat publishes only an index and percentage changes, not counts [V];
the first pass's reason, that registration procedures differ between member
states, was seen only through search [S]
([Eurostat registrations and bankruptcies](https://ec.europa.eu/eurostat/statistics-explained/index.php/Quarterly_registrations_of_new_businesses_and_declarations_of_bankruptcies_-_statistics);
this link now opens Eurostat's main page [V]).

Industry breakdown: United States, by chapter of the bankruptcy code, not by
industry [V]; France and European Union, nine industry groups, including
information and communication (`J`) [V].

#### 16. New business creations

Number of new firms started. AI may let people start one-person businesses,
or push laid-off workers into self-employment.

- Core family: Financial conditions and business failures
- **Leading**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | Census Bureau (Business Formation Statistics), via FRED | `BABATOTALSAUS` (business applications), seasonally adjusted [V] | Monthly [V] | July 2004 [V] | No | FRED API |
| France | Eurostat | `sts_rb_q`, `REG` (registrations), geo `FR`, index 2021 = 100, `SCA` [V] | Quarterly [V] (monthly in `sts_rb_m` [V]) | 2015 Q1 [V] | No | Eurostat API |
| European Union | Eurostat | `sts_rb_q`, `REG`, `EU27_2020` [V] | Quarterly [V] (monthly in `sts_rb_m` [V]) | 2015 Q1 [V] | No | Eurostat API |

France now comes from Eurostat, not INSEE (decision 1). French creations
include many sole traders ("micro-entrepreneurs"), so changes in their legal
regime move the number [U].

Industry breakdown: United States, by industry sector (for example
`BABANAICS51SAUS`, information) [V]; France and European Union, the same
nine groups as Indicator 15 [V].

#### 17. Bank lending standards

Surveys asking banks whether they are making loans harder to get. Banks
that see firms threatened by AI, or households at risk of job loss, tighten
first.

- Core family: Financial conditions and business failures
- **Leading**: tightening came before the 2001 and 2008 recessions [S].

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | Federal Reserve (Senior Loan Officer Survey), via FRED | `DRTSCILM` (loans to large and mid-sized firms) [V] | Quarterly [V] | 1990 Q2 [V] | Yes | FRED API |
| France | ECB (Bank Lending Survey; the French part is run by the Banque de France [U]) | ECB `BLS`, key `Q.FR.ALL.O.E.Z.B3.ST.S.FNET` (credit standards for loans to firms, net percentage) [V] | Quarterly [V] | 2003 Q1 [V] | No | ECB API (no key) [V] |
| European Union | **Not available for all 27**: the survey covers only member states using the euro [V] | ECB `BLS`, key `Q.U2.ALL.O.E.Z.B3.ST.S.WFNET` (weighted net percentage) [V] | Quarterly [V] | 2003 Q1 [V] | No | ECB API [V] |

The French figure is a plain net percentage (`FNET`), the total for the
member states using the euro a weighted one (`WFNET`) [V].

Industry breakdown: none (the survey splits by borrower, firms or
households, not by industry).

#### 18. Financial stress index

One daily number that sums up stress in stock, bond, money and currency
trading. An AI investment boom that turns to bust would show here first.

- Core family: Financial conditions and business failures
- **Leading**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | ECB ("new CISS" for the US) [V] (decision 21; the St. Louis Fed's `STLFSI4` is not used) | ECB `CISS`, key `D.US.Z0Z.4F.EC.SS_CIN.IDX` [V] | Daily [V] | 2 January 1980 [V] | Yes | ECB API |
| France | ECB | `CISS`, key `D.FR.Z0Z.4F.EC.SS_CIN.IDX` [V] | Daily [V] | 2 January 1980 [V] | Yes | ECB API |
| European Union | **Not available for all 27**: covers the member states using the euro [V] | `CISS`, key `D.U2.Z0Z.4F.EC.SS_CIN.IDX` [V] | Daily [V] | 3 January 1980 [V] | Yes | ECB API |

**Correction:** a French version exists [V]. Use the "new CISS" (`SS_CIN`):
the older version (`SS_CI`) stopped in May 2025 [V].
Source: [ECB working paper 1426 on the CISS](https://www.ecb.europa.eu/pub/pdf/scpwps/ecbwp1426.pdf) [S].
Corporate bond spreads (for example ICE BofA on FRED) were rejected: the data
owner limits how much history FRED may show [U].

Industry breakdown: none.

#### 19. Household loan arrears

Share of household loans (credit cards, consumer loans) that are late. If AI
causes job losses, households fall behind on payments.

- Core family: Financial conditions and business failures
- **Lagging**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | Federal Reserve, via FRED | `DRCCLACBS` (credit cards, all commercial banks, seasonally adjusted) [V] | Quarterly [V] | 1991 Q1 [V] | Yes | FRED API |
| France | Eurostat (survey of household living conditions) | `ilc_mdes08`, arrears on hire purchase instalments or other loan payments, % of the population, geo `FR` [V] | **Yearly**, labelled as such | 2004 [V] | No | Eurostat API |
| European Union | Eurostat, same survey | `ilc_mdes08`, geo `EU27_2020` [V] | **Yearly**, labelled as such | 2010 [V] | No | Eurostat API |

France and the European Union use a yearly survey figure (decision 14). It
is published late and shows the level, not early movement; the Dashboard
labels it as yearly. It also measures people rather than loans, so its
level cannot be compared with the US rate, only its direction.

Industry breakdown: none.

### Family 5: AI investment and technological adoption

#### 20. Hyperscaler capital spending

Money spent on data centres, servers and chips by the largest cloud and AI
infrastructure companies: Microsoft, Alphabet, Amazon, Meta, Oracle,
CoreWeave and Nvidia. It is the clearest measure of how much is being bet on
AI. Details in [Hyperscaler capital spending](#hyperscaler-capital-spending).

- Core family: AI investment and technological adoption
- **Leading**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | Company filings to the SEC (EDGAR) | XBRL tag per company: `PaymentsToAcquirePropertyPlantAndEquipment` (five companies) or `PaymentsToAcquireProductiveAssets` (Amazon, Nvidia) [V] | Quarterly [V] | 2007 to 2013 depending on the company; CoreWeave 2023 [V] | No | SEC EDGAR API (no key) [V] |
| France | **Not applicable**: these companies are American and report worldwide totals | — | — | — | — | — |
| European Union | **Not applicable**, same reason | — | — | — | — | — |

Shown as one worldwide Indicator, labelled as not tied to a Region.

Industry breakdown: not applicable; the breakdown is by company.

#### 21. Business investment in IT equipment and software

What firms spend on computers, communication equipment and software,
corrected for price changes. It measures AI investment across the whole
economy, not only a few companies, and goes back to the Internet wave.

- Core family: AI investment and technological adoption
- **Leading**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BEA (national accounts table 5.3.3, real private fixed investment, quantity indexes), via FRED | `Y034RA3Q086SBEA` (information processing equipment) and `B985RA3Q086SBEA` (software), index 2017 = 100 [V] | Quarterly [V] | 1947 Q1 (equipment) [V]; 1959 Q1 (software) [V] | Yes | FRED API |
| France | Eurostat (investment by asset) | Quarterly: `namq_10_an6`, `N117G` (intellectual property products, which include software and research), `CLV20_MEUR`, `SCA` [V]. Yearly: `nama_10_an6`, `N1132G` (ICT equipment) [V] | Quarterly / yearly | 1980 Q1 (quarterly) [V]; 1975 (yearly) [V] | Yes | Eurostat API |
| European Union | Eurostat | Same codes, `EU27_2020` [V] | Quarterly / yearly | 1995 [V] | No | Eurostat API |

**Corrections:** FRED's figures in chained dollars (`Y034RX1Q020SBEA`,
`B985RX1Q020SBEA`) start only in 2007, so the quantity indexes above are
used [V]. Eurostat publishes **no quarterly ICT-equipment figure** for France
or the EU total, and **no separate software figure** at all: the yearly
dataset has ICT equipment, and the quarterly one has only intellectual
property products [V]. Eurostat's figures cover the whole economy, including
government; the US figure covers private firms only [V].

Industry breakdown: none (the breakdown is by type of asset).

#### 22. Share of firms using AI

Share of businesses that say they use AI. It measures how far adoption has
spread beyond the tech industry.

- Core family: AI investment and technological adoption
- **Leading**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | Census Bureau (Business Trends and Outlook Survey, BTOS) | AI use rate [V] | Every two weeks [V] | September 2023 [V] | No | Downloadable files; not in the Census API catalogue [V] |
| France | Eurostat (ICT usage in enterprises survey) | `isoc_eb_ai`, geo `FR`, `E_AI_TANY`, firms with 10 or more people `GE10`, unit `PC_ENT` [V] | Yearly (2021, then from 2023) [V] | 2021 [V] | No | Eurostat API |
| European Union | Eurostat | `isoc_eb_ai`, `EU27_2020`, same options [V]; 20% of firms with 10+ people in 2025 (19.95%) [V] | Yearly [V] | 2021 [V] | No | Eurostat API |

Notes: the US question was reworded on 17 November 2025, from AI use "in
producing goods or services" to use "in any business function". Values
before and after are **not comparable** [V]
([Census 2026 story](https://www.census.gov/library/stories/2026/05/ai-use-businesses.html),
[Census research note](https://www.census.gov/newsroom/blogs/research-matters/2024/12/ai-use-small-businesses.html)).
The US and EU surveys ask different questions and cover different firm sizes;
compare directions only. Eurostat source:
[Eurostat news, 11 December 2025](https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20251211-2) [V].

Industry breakdown: United States, by sector (in May 2026, 39.7% in
information against 19.8% nationally) [V]; France and European Union,
`isoc_eb_ain2`, by NACE industry [V].

#### 23. Data-centre construction spending

Money spent each month building data centres. It shows AI investment turning
into physical buildings, and reaches the real economy (construction jobs,
electricity).

- Core family: AI investment and technological adoption
- **Leading**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | Census Bureau (construction spending) | Column "Data center" in the file `privsatime.xlsx` (private construction, seasonally adjusted annual rate, millions of dollars); data centres are part of "Office" [V] | Monthly [V] | January 2014 [V] | No | File download, no key [V]; the Census API needs a key and its data-centre content was not checked [U] |
| France | **Not available** | — | — | — | — | — |
| European Union | **Not available** | — | — | — | — | — |

Source: [Census construction spending](https://www.census.gov/construction/c30/c30index.html) [V].

Industry breakdown: not applicable.

#### 24. Output of the information and communication industry

Value produced by publishing, telecoms, IT and software firms, corrected for
price changes. Compared with Indicator 6, it shows whether this industry
grows without hiring.

- Core family: AI investment and technological adoption
- **Leading**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BEA (GDP by industry), via FRED | `RVAI` (real value added, information) [V] | Quarterly [V] | 2005 Q1 [V]; yearly back to 1947 [U] | No (quarterly) | FRED API |
| France | Eurostat | `namq_10_a10`, NACE `J`, `B1G`, `CLV20_MEUR`, `SCA`, geo `FR` [V] | Quarterly [V] | 1980 Q1 [V] | Yes | Eurostat API |
| European Union | Eurostat | Same, `EU27_2020` [V] | Quarterly [V] | 1995 Q1 [V] | No | Eurostat API |

Industry breakdown: this Indicator is itself one industry.

#### 25. Revenue of AI model companies

Revenue of the companies that build and sell AI models. It measures how much
firms and people actually pay to use AI, which the adoption surveys
(Indicator 22) only ask about.

- Core family: AI investment and technological adoption
- **Leading**: money spent on AI models shows adoption being paid for,
  before its effects reach jobs, pay and spending. It moves at the same time
  as the AI industry itself, but for Spock's question (consequences for the
  economy) it comes first.

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States (US-listed companies) | Company filings to the SEC (EDGAR) | Anthropic, PBC, CIK `2130357`: no machine-readable revenue yet [V]. CoreWeave, CIK `1769628`: `RevenueFromContractWithCustomerExcludingAssessedTax`, from 2023 [V] | Quarterly (Anthropic from its first quarterly report, 10-Q) | 2023 [V] | No | SEC EDGAR API (no key) [V] |
| France | **Not available**: no listed French AI model company | — | — | — | — | — |
| European Union | **Not available**: no listed EU equivalent | — | — | — | — | — |

Details, including which companies count and why, in
[Revenue of AI model companies](#revenue-of-ai-model-companies).

Industry breakdown: not applicable; the breakdown is by company.

#### 26. Profitability of AI model companies

Operating margin of the same companies as Indicator 25: operating profit
(revenue minus the costs of running the business) divided by revenue, as a
percentage. Revenue says how much the economy pays for AI; this says whether
selling AI makes money. A company can grow its revenue every year and still
lose money on each dollar sold.

- Core family: AI investment and technological adoption, next to
  Indicator 25, because it covers the same companies from the same filings.
- **Leading**: if spending and revenue keep climbing while margins stay
  negative or worsen, the AI boom depends on investors' patience. When that
  runs out, investment can stop abruptly, as it did after the Internet wave.
  This shows before any effect on jobs or failures.

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States (US-listed companies) | Company filings to the SEC (EDGAR) | **Computed by Spock**: `OperatingIncomeLoss` ÷ revenue. Anthropic: from its first 10-Q; the prospectus gives an operating loss of $1.3 billion for the nine months to 2026-09-30, against $5.2 billion a year earlier [V]. CoreWeave: `OperatingIncomeLoss` from 2023 [V] | Quarterly | 2023 [V] | No | SEC EDGAR API (no key) [V] |
| France | **Not available**: no listed French AI model company | — | — | — | — | — |
| European Union | **Not available**: no listed EU equivalent | — | — | — | — | — |

Operating margin rather than net profit: net profit also moves with one-off
items, such as changes in the value of investments the company holds.
Quarterly reports give the year so far for some figures; the quarter alone
must then be computed by subtraction, as for capital spending.

Industry breakdown: not applicable; the breakdown is by company.

## AI-exposed occupations

This is where the three Regions differ most.

### Which job codes

| Occupation | US code (SOC 2018) | International code (ISCO-08) | Usable at Eurostat? |
| --- | --- | --- | --- |
| Administrative work | `43-0000` Office and administrative support [U] | `OC41` General and keyboard clerks [V] | Yes, two-digit [V] |
| Customer support | `43-4051` Customer service representatives [U] | `OC42` Customer services clerks [V] | Yes, two-digit [V] |
| Translation | `27-3091` Interpreters and translators [U] | `2643` Translators, interpreters and other linguists [U] | **No**: inside `OC26` "Legal, social and cultural professionals" [V], which also holds lawyers, artists and others |
| Software development | `15-1252` Software developers [U] | `OC25` Information and communications technology professionals (includes `2512` software developers [U]) [V] | Yes, but only as all ICT professionals [V] |

### United States

- **OEWS** (Occupational Employment and Wage Statistics, BLS): employment and
  wages for about 800 occupations. Yearly, with a May reference date, since
  1997 [S]. Classification changes in 1999, 2010 and 2018 break comparisons
  over time [S]
  ([BLS OEWS history](https://www.bls.gov/opub/hom/oews/history.htm)).
  Published about a year after the reference date [U]. The BLS API seems to
  carry only the latest year: in the one answer received, it had no values
  for 2023 or 2024 for national office and administrative support [U]. The
  BLS website and API were blocked for the rest of this check.
- **CPS** (Current Population Survey, the household survey behind the
  unemployment rate): monthly, but BLS publishes employment by detailed
  occupation as yearly averages; monthly occupation detail needs the raw
  survey files, which is heavy work [U].
- **JOLTS** (job openings): monthly, but **no occupation detail**, only
  industries and US census regions [S].

### France and the European Union

- **Eurostat Labour Force Survey** `lfsa_egai2d`: employment by ISCO-08
  two-digit occupation, yearly, 2011 to 2025, for France and the EU total
  [V]. Quarterly data exists only at the one-digit level (for example all
  "clerical support workers"), in `lfsq_egais`, from 1998 [V for the
  dataset's dates; its France coverage was not checked, U]. This is the same
  source for France and the EU, so the two are comparable.
- **Eurostat job vacancies by occupation**: `jvs_q_isco_r2` was closed at the
  end of 2025; its replacement is `jvs_q_isco_r21` [V]. Many member states do
  not report occupations [U].
- France's own sources (France Travail's hiring-plans survey, job seekers by
  occupation) are listed under [Later additions](#later-additions).

### What this means for Spock

- Only the United States has an occupation figure that comes more often than
  once a year, and even there the easy one (OEWS) is yearly.
- Translation cannot be isolated in EU data; Spock should say so on the
  Indicator.
- Indicator 6 (employment in AI-heavy industries, monthly or quarterly in all
  three Regions) is the faster stand-in until yearly occupation data arrives.

## Hyperscaler capital spending

Hyperscalers report capital spending in their quarterly and yearly filings
to the SEC (the US financial regulator). These filings carry machine-readable
tags (called XBRL) that the SEC republishes for free [V].

- **Where:** the SEC's free EDGAR API on `data.sec.gov`. It offers, per
  company, all reported figures (`companyfacts`) or one figure over time
  (`companyconcept`), as JSON (a structured text format programs read) [V]
  ([SEC: Accessing EDGAR data](https://www.sec.gov/os/accessing-edgar-data)).
- **No key**, but **conditions**: at most 10 requests per second, and
  requests must declare who sends them in a "User-Agent" header (a line each
  request carries to say who is calling) [V, from the SEC's refusal page].
  The SEC may limit senders who ignore these conditions [V]. Spock needs only
  a handful of requests a day, far below the limit. Spock will declare the
  Owner's personal email, stored as a private setting, never in this
  repository (decision 3).
- **Companies, identifiers and tags** (CIK is the SEC's company number). All
  checked in each company's `companyfacts` on 2026-11-19 [V]:

| Company | CIK | Year ends | Tag for "purchases of property and equipment" | Machine-readable since | Latest full year |
| --- | --- | --- | --- | --- | --- |
| Microsoft | `789019` | June | `PaymentsToAcquirePropertyPlantAndEquipment` | 2008 | $115.9 bn (year to June 2026) |
| Alphabet | `1652044` | December | `PaymentsToAcquirePropertyPlantAndEquipment` | 2013 | $91.4 bn (2025) |
| Amazon | `1018724` | December | `PaymentsToAcquireProductiveAssets` (the other tag stops in early 2017) | 2007 | $131.8 bn (2025) |
| Meta | `1326801` | December | `PaymentsToAcquirePropertyPlantAndEquipment` | 2010 | $69.7 bn (2025) |
| Oracle | `1341439` | May | `PaymentsToAcquirePropertyPlantAndEquipment` | 2010 | $55.7 bn (year to May 2026) |
| CoreWeave | `1769628` | December | `PaymentsToAcquirePropertyPlantAndEquipment` | 2023 | $10.309 bn (2025) |
| Nvidia | `1045810` | late January | `PaymentsToAcquireProductiveAssets` (the other tag stops in mid-2020) | 2019 for this tag | $6.0 bn (year to January 2026) |

- **Traps to handle:**
  - Quarterly filings report the year so far; some companies (Microsoft,
    Amazon) also give the quarter alone, others (Nvidia, CoreWeave) do not,
    so the quarter must then be computed by subtraction [V].
  - Microsoft's year ends in June, Oracle's in May and Nvidia's in late
    January, so "Q1" means different months [V].
  - `PaymentsToAcquireProductiveAssets` also includes software and other
    intangible assets, per the tag's official definition [V]; Amazon's and
    Nvidia's figures are therefore slightly broader.
  - Alphabet's figures before 2015 are filed under Google's former company
    number, not checked here [U].
  - Some spending is through leases and does not appear in this line [U].
  - The figure covers all buildings and equipment, not only AI.
- **Known difficulty: Nvidia's data-centre revenue.** Nvidia's sales to data
  centres are the best single measure of AI chip demand, but they are a
  segment figure, and the SEC's `companyfacts` holds no figures split by
  segment. Getting them would mean reading each filing separately. Not part
  of the starter list.
- **History:** machine-readable from 2007 to 2013 depending on the company
  [V], so this Indicator cannot be compared with the Internet wave.
  Indicator 21 (IT investment) covers that.

### Revenue of AI model companies

**Which companies count** (decision 17). A company is included when all
three are true:

1. it is listed on a stock exchange, so it must publish audited accounts
   for free;
2. most of its revenue comes from selling AI models or AI computing power;
3. it reports that revenue as a separate figure in its official filings.

This leaves out Microsoft, Alphabet, Amazon and Meta: they earn a lot from
AI but report it mixed with their cloud and advertising businesses. Their AI
effort is counted through capital spending (Indicator 20). Every change to
the list is recorded with its date, so the Indicator's history stays
understandable.

**The list on 2026-11-20:** Anthropic and CoreWeave. To add when they
become listed: OpenAI, and Mistral AI (French; if it lists in Paris, its
figures would come from its filings to the French market regulator, not the
SEC).

**xAI is left out** (decision 19). SpaceX bought it on 2026-02-02, and
SpaceX is listed on Nasdaq (`SPCX`, CIK `1181412`) [V]. SpaceX reports xAI's
business as its "Super Intelligence" (SI) segment: the Grok models, the
Cursor software-engineering tool, AI cloud services, X subscriptions and X
advertising [V]. In the quarter to 2026-09-30 the segment had revenue of
$7,560 million, of which $538 million was advertising, and an operating
profit of $431 million [V]
([SpaceX 10-Q, 2026-09-30](https://www.sec.gov/Archives/edgar/data/1181412/000162828026066880/spcx-20260930.htm)).
SpaceX fails rule 2: SI was 40% of its revenue over the first nine months of
2026 [V]. The Owner chose to keep the rule as it is rather than widen it to
separately reported segments. xAI would count if it ever became a
separately listed company again.

- **CoreWeave**: CIK `1769628`. It rents out computing power built for AI.
  Its revenue (`RevenueFromContractWithCustomerExcludingAssessedTax`) and
  operating profit (`OperatingIncomeLoss`) are in the SEC's machine-readable
  data from 2023 [V]. It is also in capital spending (Indicator 20): there
  it counts what it spends, here what it earns, so nothing is counted twice.
- **Anthropic, PBC**: CIK `2130357`, ticker `ANT`, year ending in December
  [V]. Its final prospectus (form 424B4) was filed on 2026-11-19 under
  accession number `0001628280-26-074944` [V]. The prospectus gives an
  initial price of $83.00 a share and a listing on the Nasdaq Global Select
  Market under the symbol `ANT` [V]. The first trading day (2026-11-19) comes
  from news reports [S].
- **No machine-readable figures yet.** Anthropic's `companyfacts` holds only
  filing-fee data, no accounting figures [V]. They should arrive with its
  first quarterly report (10-Q).
- **From the prospectus** [V]:
  - **total revenue** was $41 million (2023), $386 million (2024) and
    $4.6 billion (2025); for the nine months to 2026-09-30 it was
    $33.2 billion, against $2.5 billion a year earlier. The company warns it
    does not expect such growth rates to continue;
  - revenue from customers paying $100,000 or more over twelve months grew
    from about $37 million (2023) to $220 million (2024), $3.5 billion (2025)
    and $26.1 billion (twelve months to 2026-09-30);
  - operating loss of $1.3 billion for the nine months to 2026-09-30,
    against $5.2 billion a year earlier (Indicator 26);
  - purchases of property and equipment were small: $2 million, $15 million
    and $131 million for 2023 to 2025, and $925 million for the nine months
    to 2026-09-30, plus $1,955 million of prepayments for leased assets.
- **Not added to capital spending.** Anthropic mostly rents its computing
  power from cloud companies already in Indicator 20; adding its own small
  spending would count the same money twice.
- **Limits:** US-listed companies only; no French or EU equivalent exists.
  History starts in 2023.

## Watched relationships

Nine proposals. Each checks for a Divergence (two Indicators that normally
move together drifting apart) or a Pattern (several Indicators pointing the
same way at the same time).

| # | Indicators | Kind | Plain-English question | What it would mean |
| --- | --- | --- | --- | --- |
| W1 | Headline: 7 Productivity against 8 Real compensation per hour. Supporting: 9 Labour share, 10 Inequality | Divergence (with supporting Indicators) | Are workers getting their share of AI's gains? | Productivity rising while real pay stays flat; labour share falling and inequality rising at the same time confirm that AI's gains go to capital rather than workers. |
| W2 | 20 Hyperscaler spending; 21 IT investment; 22 Firms using AI; 23 Data-centre construction; 25 Revenue of AI model companies; 5 Employment in AI-exposed occupations | Pattern | Is AI investment replacing the jobs it targets? | Investment, adoption and spending on AI models rising while employment in exposed occupations falls. |
| W3 | 24 Output of information industry; 6 Employment in information and professional services; 2 Total employment (yardstick) | Divergence | Is the tech industry growing without hiring? | Output rising while employment stalls or falls, and the industry's share of total employment shrinking. |
| W4 | 4 Youth unemployment; 1 Unemployment rate | Divergence | Are young people hit first? | Youth unemployment rising while the overall rate stays stable. |
| W5 | 3 Job openings; 1 Unemployment rate | Divergence | Are employers hiring less without laying off yet? | Openings falling while unemployment stays low; or both rising, meaning jobs on offer no longer match the people looking. |
| W6 | 14 Confidence and unemployment fears; 13 Saving rate; 12 Real consumption; 11 Real disposable income | Pattern | Are households getting worried and cutting back? | Fear of unemployment and saving up, spending down, possibly before income falls. |
| W7 | 17 Lending standards; 18 Financial stress; 15 Business failures; 16 New business creations; 19 Household arrears | Pattern | Is the financial system turning against firms and households? | Tighter credit and higher stress, followed by more failures, fewer creations and more arrears. |
| W8 | 22 Firms using AI; 21 IT investment; 7 Productivity, compared across the three Regions | Divergence | Is AI adoption showing up in productivity, and where first? | One Region adopting and investing faster and pulling ahead in productivity, as the United States did during the Internet wave [U]; or adoption rising everywhere with no productivity gain anywhere. |
| W9 | 20 Hyperscaler spending; 25 Revenue of AI model companies; 26 Profitability of AI model companies | Divergence | Is the AI boom paying for itself? | Spending and revenue climbing while margins stay negative or worsen: the boom rests on investors' patience, which can run out abruptly. Margins turning positive as revenue grows: the spending is starting to pay. |

W1 merges the first pass's W1 and W2 (decision 8). Revenue of AI model
companies (25) joins W2: it is the most direct measure of AI being paid for.
W9 was added on 2026-11-20 (decision 18).

W1, W4, W5, W6 and W7 can be compared with the Internet wave in the United
States, and W1 (without labour share and inequality), W4, W5 and W6 also in
France, since Eurostat's French figures start in 1980 to 1985. The EU total
mostly starts in 1995 to 2000.

### Indicators added to a Watched relationship late

Decision 10 says every Indicator must appear in at least one Watched
relationship. Three were missing one: **2 Total employment**, **16 New
business creations** and **23 Data-centre construction spending**. The
Owner approved these homes on 2026-11-19 (decision 13), and the table above
includes them:

- 2 Total employment in **W3**, as the economy-wide yardstick: employment in
  information and professional services (6) as a share of total employment
  (2).
- 16 New business creations in **W7**: creations falling while failures rise
  is the same strain on firms seen from the other side.
- 23 Data-centre construction in **W2**, next to the other AI investment
  Indicators.

### How Watched relationships are calculated

Two Indicators measured in different units (an index, a rate, a number of
people) cannot be compared directly. Spock first puts them on the same
footing, in one of two ways:

- **12-month growth rates**: each Indicator's change over the past year, in
  per cent.
- **Indexes = 100 at a common start**: each Indicator divided by its own
  value at the same starting date, times 100. Both then start at 100 and
  show how far each has moved since.

For a pair, Spock then follows one number, the **ratio of the two indexes**.
For W1, it is the productivity index divided by the real pay index: 100
means both moved alike since the start; 120 means productivity has gained
20% more than real pay. For W5, it is **job openings per unemployed person**
(job openings divided by the number of unemployed people, which both
publishers give alongside the rate: FRED `UNEMPLOY` from 1948 [V], Eurostat
`une_rt_m` unit `THS_PER` [V]). For the EU total, Eurostat publishes only a
vacancy rate, not a count [V], so W5 uses the vacancy rate divided by the
unemployment rate there.

**When a Divergence is flagged** (decision 9, option A): the distance
between the two Indicators is wider than in 95% of its own history, and stays
so for two releases in a row. "Its own history" means all past values of
that same pair in that Region. The two-releases condition avoids flagging a
single odd value.

**When a Pattern is flagged:** each Indicator is judged against its own
history, the same way; the Pattern fires when all of them (or a number the
Owner agrees per Pattern) point the worrying way at the same time.

**Later option (C):** the Owner sets a threshold for a given Watched
relationship, which then replaces the default above for that one.

These are fixed, written-down rules, as ADR 0001 requires: Spock flags; the
Owner explains, in an Insight.

### Industry detail

Decided by the Owner (decision 10, option A):

- **Totals answer "how much", breakdowns answer "where", and Watched
  relationships point to the "why"**, which the Owner explains in an
  Insight.
- Indicators without an industry breakdown are kept, provided each appears
  in at least one Watched relationship (three need a home: see above).
- Wherever a breakdown exists, the Dashboard shows it: employment (2 and 6),
  job openings (3), business failures (15), business creations (16), and
  also unemployment (US only), firms using AI (22) and, if computed, real
  pay by industry (8). Each Indicator above has a line "Industry breakdown:"
  saying what exists in each Region.
- **NACE version change:** Eurostat's job vacancies already use NACE
  version 2.1, while national accounts and business registrations still use
  version 2 [V]. Some section letters differ (in version 2.1, IT services are
  in section K; in version 2, they are in J) [V]. Spock must map them
  explicitly and not match letters blindly.

### Dashboards

Decided by the Owner on 2026-11-19 and recorded in
[ADR 0004](../adr/0004-arrange-data-to-make-sense.md):

- **The principle, Spock's moat:** Spock doesn't just throw data at the
  people looking at it; it arranges it in ways that help them make sense of
  it.
- **Signals dashboard** (the main one): shows the Watched relationships.
- **Data dashboard** (the secondary one): shows the Indicators by Core
  family, for exploring them one by one.

**Proposed grouping for the Signals dashboard** (to confirm when the screens
are designed). The sections follow an AI shock through the economy, from
early signs to late consequences, with a one-line summary of each section
at the top:

| Section | Question | Watched relationships |
| --- | --- | --- |
| 1. Is AI arriving? | Are firms investing in AI and using it, does it raise productivity, and does it pay for itself? | W8, W9 |
| 2. Is AI replacing work? | Are jobs disappearing where AI hits first? | W2, W3, W4, W5 |
| 3. Who gets the gains? | Do the gains go to workers or to capital? | W1 |
| 4. Are households and firms paying the price? | Is the damage spreading to spending, credit and failures? | W6, W7 |

An Indicator can appear in more than one section.

### Charts

Decided by the Owner (decision 11):

- **Charts over time are the default**, with the Historical episodes (the
  Internet wave, the Global financial crisis, the Covid shock) shaded in the
  background.
- **Combinations of Watched relationships are a later idea.** When they
  come, they will be defined as named Patterns. Explaining what a
  combination means stays the Owner's work, in an Insight (ADR 0001).

## Keys, registration and usage limits

| Publisher | Key needed? | How to get it | Usage limits | Notes |
| --- | --- | --- | --- | --- |
| FRED (St. Louis Fed) | **Yes**, free: every request needs a key [V] | Log in to a FRED account, then request a key [V] | Up to 120 requests per minute [V] ([FRED API errors page](https://fred.stlouisfed.org/docs/api/fred/errors.html)) | Covers most US Indicators, so the most important key. Spock must show "This product uses the FRED® API but is not endorsed or certified by the Federal Reserve Bank of St. Louis." [V]. Data owned by third parties (University of Michigan) needs the owner's permission for anything beyond personal use [V] ([FRED API terms](https://fred.stlouisfed.org/docs/api/terms_of_use.html)). |
| BLS | **Yes** for version 2, free | Form at `data.bls.gov/registrationEngine`; key arrives by email [S] | Version 2: 500 requests a day, 50 data feeds per request, 20 years per request; version 1 (no key): 25 a day, 25 feeds, 10 years; both 50 requests per 10 seconds [S] | Must be renewed once a year [S] ([BLS API FAQ](https://www.bls.gov/developers/api_faqs.htm)). Needed only for what FRED lacks (OEWS). The keyless daily allowance ran out during this check [V], so a key is needed. |
| US Census Bureau | **Yes**, free: the API refuses requests without a key [V] | Sign-up at `api.census.gov/data/key_signup.html` [S] | Not checked [U] | Today Spock's Census data comes from files (data-centre construction, BTOS) that need no key [V]; the key is for using the API instead. |
| SEC EDGAR | **No key** [V] | — | 10 requests per second; declared User-Agent with contact details [V] | Contact: the Owner's personal email, stored as a private setting, never in this repository (decision 3). |
| Eurostat | No key [V] | — | None published [U] | "Open for public use" and "free of charge" per Eurostat [V] ([Eurostat API introduction](https://ec.europa.eu/eurostat/web/user-guides/data-browser/api-data-access/api-introduction)). |
| ECB | No key [V] | — | None published [U] | Used without a key in this check [V]. |
| AMECO (European Commission) | No key [V] | — | None published [U] | Web query service on `ec.europa.eu` [V]. |
| US Courts | No key [V] | — | — | One PDF and one Excel file per quarter [V]; no API. |

Keys dropped since the first pass: INSEE and the Banque de France (decisions
1 and 4). The BEA key is not needed: every BEA figure used comes through
FRED [V].

Never paste a key into the chat or an issue (`docs/agents/decisions.md`,
section 7).

## Hosts to allow

Two lists: hosts the **daily data collection** must reach, and hosts a
**future research or build session** needs to read documentation.

### Daily data collection

| Host | What for |
| --- | --- |
| `api.stlouisfed.org` | FRED API: most US Indicators [V] |
| `api.bls.gov` | BLS API: OEWS [V] |
| `www.census.gov` | Data-centre construction file and BTOS files [V] |
| `api.census.gov` | Census API, only if the files above are replaced by the API [V] |
| `data.sec.gov` | SEC EDGAR company figures [V] |
| `www.sec.gov` | SEC list matching companies to CIK numbers, and filings not yet in machine-readable form [U] |
| `ec.europa.eu` | Eurostat API (`/eurostat/api/dissemination/...`) and AMECO (`/economy_finance/ameco/...`) [V] |
| `data-api.ecb.europa.eu` | ECB API: lending survey, CISS [V] |
| `www.uscourts.gov` | US business bankruptcy tables [V] |
| `www.newyorkfed.org` | New York Fed unemployment expectations (decision 22) [U] |

**Dropped since the first pass**, because nothing in the starter list uses
them any more: `bdm.insee.fr` and `api.insee.fr` (INSEE, decision 1),
`webstat.banque-france.fr` (Banque de France, decision 4),
`www.data.gouv.fr`, `static.data.gouv.fr`, `dares.travail-emploi.gouv.fr`
and `statistiques.francetravail.org` (France Travail and DARES files: France
now comes from Eurostat, see [Later additions](#later-additions)), and
`apps.bea.gov` (BEA figures come through FRED). They can stay allowed in
the cloud environment for research; the data collection does not need them.

### Documentation

`fred.stlouisfed.org` [V], `www.bls.gov` (refuses automated requests, even
browser-like ones [V]), `www.census.gov` [V], `www.sec.gov` (needs a
declared contact [V]), `www.insee.fr` [V], `www.ecb.europa.eu`,
`data.ecb.europa.eu`, `economy-finance.ec.europa.eu` (refused by the network
in this check [V]).

## Missing or poorer coverage

These will be shown, labelled, on the Dashboard.

- **Hyperscaler capital spending** (20) and **revenue of AI model
  companies** (25): worldwide company totals, not split by Region; US-listed
  companies only; revenue of AI model companies has no French or EU
  equivalent and starts in 2023.
- **Data-centre construction** (23): United States only, from 2014.
- **Bank lending standards** (17) and **financial stress** (18): France and
  the member states using the euro, not all 27 members of the European
  Union.
- **Household arrears** (19): France and the European Union have only a
  yearly survey figure, from 2004 and 2010, shown labelled as yearly.
- **AI-exposed occupations** (5): yearly everywhere for easy-to-use data;
  translation cannot be isolated in EU data; history starts in 1997 (US) and
  2011 (France, EU).
- **Job openings** (3): no occupation detail in any Region at monthly or
  quarterly frequency without heavy work; France not strictly comparable with
  other member states; no count for the EU total, only a rate.
- **Business failures** (15) and **creations** (16) in France and the EU: an
  index from 2015 only; US failures have no API.
- **Firms using AI** (22): starts 2021 (EU) and 2023 (US); the US question
  changed in November 2025.
- **IT investment** (21) in France and the EU: no quarterly ICT-equipment or
  software figure; quarterly data covers all intellectual property products.
- **Internet wave comparison**: France is well covered from 1980 to 1985 for
  jobs, productivity, pay, household income, saving and confidence; the EU
  total mostly starts in 1995 to 2000, so the run-up to the Internet wave is
  missing for it.
- **Real compensation** (8) for France and the EU: computed by Spock, from
  1996 (France) and 2000 (EU) because of the price index.
- **Labour share** (9) for France and the EU: yearly only, and the latest
  years are forecasts.

## Later additions

Not part of the starter list; recorded so they are not lost.

- **INSEE** (decision 1). Eurostat already gives France from 1980 to 1985
  for most Indicators [V], so INSEE would mainly add: French history before
  1980 (unemployment, household accounts, labour share [U]); monthly French
  figures Eurostat does not have, such as household consumption of goods
  [U] and business creations as counts rather than an index [U]; INSEE's own
  consumer confidence survey, from January 1987 [S]; and a longer French
  inequality figure from tax data [U]. Hosts: `bdm.insee.fr` (no key [S]) or
  `api.insee.fr` (account [S]).
- **Banque de France account** (decision 4). It would add French business
  failures as counts back to December 1991, revised monthly as court records
  arrive [S], and household over-indebtedness cases, the closest French
  stand-in for household arrears [U]. Needs a free Webstat developer account
  [S].
- **France Travail and DARES**: the yearly hiring-plans survey (BMO, planned
  hires by job family, about 2.28 million planned hires in the 2026 edition
  [S]) and quarterly job seekers and job offers by occupation [U]. Left out
  because the files are poorly documented [S], have no EU equivalent, and
  Eurostat gives a comparable French occupation figure.
- **Nvidia's data-centre revenue**: needs reading each filing (see
  [Hyperscaler capital spending](#hyperscaler-capital-spending)).
- **OpenAI**: add to Indicator 25 if it becomes a listed company.
- **AI-exposed software firms** (decision 7): Adobe (CIK `796343`, ticker
  `ADBE` [V]) and Figma (CIK `1579878`, ticker `FIG` [V]). These ask a
  different question, at company level: are firms whose products AI can
  replace losing ground? They are not AI infrastructure spending.
- **Owner-set thresholds** per Watched relationship (option C of decision
  9).
- **Combinations of Watched relationships**, as named Patterns (decision 11).

## Decisions by the Owner (2026-11-19)

Approved by the Owner on 2026-11-19, answering the first pass's open
questions.

1. **France: Eurostat by default.** INSEE is dropped as a source for now (see
   [Later additions](#later-additions)). French business creations and
   failures come from Eurostat, from 2015. French household loan arrears are
   shown as missing, labelled.
2. **Computed Indicators are accepted**, labelled "computed by Spock" (for
   example real compensation per hour for France and the EU).
3. **SEC contact**: the Owner's personal email, stored as a private setting,
   never in the repository.
4. **Banque de France**: no account for now (see
   [Later additions](#later-additions)).
5. **Hyperscaler list**: Microsoft, Alphabet, Amazon, Meta and Oracle, plus
   CoreWeave and Nvidia.
6. **New Indicator 25, revenue of AI model companies**, starting with
   Anthropic; OpenAI to follow if it becomes listed. Anthropic is not added
   to capital spending.
7. **Adobe and Figma**: a later idea, not an Indicator.
8. **W1 and W2 merged** into "Are workers getting their share of AI's
   gains?", with productivity against real pay as the headline Divergence.
9. **Divergence rule, option A**: wider than in 95% of its own history, for
   two releases in a row. Patterns: each Indicator against its own history.
   Option C (Owner-set thresholds) is a later option.
10. **Industry detail, option A**: keep Indicators without a breakdown if
    each is in a Watched relationship; show breakdowns wherever they exist.
11. **Charts over time by default**, with Historical episodes shaded;
    combinations of Watched relationships later, as named Patterns.
12. **Two Dashboards**: the Signals dashboard (Watched relationships) first,
    the Data dashboard (Core families) second, under the principle that
    Spock arranges data so people can make sense of it (ADR 0004). See
    [Dashboards](#dashboards).
13. **Homes for three Indicators**: Total employment (2) in W3, New business
    creations (16) in W7, Data-centre construction (23) in W2.
14. **Household arrears for France and the EU**: shown from Eurostat's yearly
    survey figure, labelled as yearly, instead of as missing.
15. **Price index for real compensation (8) in France and the EU**: the
    price of household consumption from the national accounts, for the
    longer history.
16. **France Travail hiring plans (BMO)**: left out for now; France's
    AI-exposed occupations come from Eurostat only (see
    [Later additions](#later-additions)).
17. **Which AI model companies count** (2026-11-20): listed, mostly selling AI models or
    AI computing power, and reporting that revenue separately. The list:
    Anthropic and CoreWeave; OpenAI and Mistral AI if they become listed.
    See [Revenue of AI model companies](#revenue-of-ai-model-companies).
18. **New Indicator 26, profitability of AI model companies** (2026-11-20; operating
    margin), and **new Watched relationship W9**, "Is the AI boom paying for
    itself?", in the "Is AI arriving?" section of the Signals dashboard.
19. **xAI left out** (2026-11-20): it is part of SpaceX, which fails the rule; the rule
    is not widened to separately reported segments.
20. **AMECO forecasts** (2026-11-22, during the grill on the daily data
    collection; its other decisions are in `GLOSSARY.md` and ADR 0005): Spock keeps past years only for labour share (9).
21. **Two possible sources**: financial stress (18) uses the ECB's index in
    all three Regions; elsewhere, where this note offers two frequencies
    (12, 15, 16, 21), both are collected.
22. **US consumer confidence (14)**: the University of Michigan index is
    replaced by the New York Fed's unemployment expectations. Its terms and
    data file must be read at `www.newyorkfed.org` before it is built.
23. **Anthropic's prospectus figures** (25, 26) are entered once by hand, by
    the agent, labelled "from the prospectus" with a link, until its first
    machine-readable report takes over.
24. **Adding up hyperscalers (20)**: each company's quarter counts in the
    calendar quarter in which it ends; a quarter's total appears only once
    all seven have reported.

The first pass's question "allow the hosts first?" was answered by adding the
hosts to the cloud environment before this second pass.

## Open questions for the Owner

None at the moment: the Owner answered all of them (see
[Decisions by the Owner](#decisions-by-the-owner-2026-11-19)).

## Sources

Opened directly on 2026-11-19 unless marked [S] (seen only through search).

US

- FRED pages for each code (title, units, frequency, dates): `https://fred.stlouisfed.org/series/<code>` for every FRED code above, for example <https://fred.stlouisfed.org/series/OPHNFB>, <https://fred.stlouisfed.org/series/COMPRNFB>, <https://fred.stlouisfed.org/series/PRS85006173>, <https://fred.stlouisfed.org/series/DRTSCILM>, <https://fred.stlouisfed.org/series/Y034RA3Q086SBEA>, <https://fred.stlouisfed.org/series/RVAI>
- FRED API key page: <https://fred.stlouisfed.org/docs/api/api_key.html>
- FRED API errors and rate limit: <https://fred.stlouisfed.org/docs/api/fred/errors.html>
- FRED API terms of use: <https://fred.stlouisfed.org/docs/api/terms_of_use.html>
- BLS, Public Data API FAQ [S]: <https://www.bls.gov/developers/api_faqs.htm>
- BLS, JOLTS history (Handbook of Methods) [S]: <https://www.bls.gov/opub/hom/jlt/history.htm>
- BLS, OEWS history (Handbook of Methods) [S]: <https://www.bls.gov/opub/hom/oews/history.htm>
- Census Bureau, construction spending: <https://www.census.gov/construction/c30/c30index.html> and file <https://www.census.gov/construction/c30/xlsx/privsatime.xlsx>
- Census Bureau, API catalogue: <https://api.census.gov/data.json>
- Census Bureau, AI use in small businesses (BTOS): <https://www.census.gov/newsroom/blogs/research-matters/2024/12/ai-use-small-businesses.html>
- Census Bureau, AI use by firm size (2026): <https://www.census.gov/library/stories/2026/05/ai-use-businesses.html>
- US Courts, bankruptcy filing statistics: <https://www.uscourts.gov/data-news/reports/statistical-reports/bankruptcy-filings-statistics>
- US Courts, table F-2, three months to 30 September 2026: <https://www.uscourts.gov/data-news/data-tables/2026/09/30/bankruptcy-filings/f-2-three-months>
- SEC, company figures: `https://data.sec.gov/api/xbrl/companyfacts/CIK<10-digit CIK>.json` for each company above
- SEC, company filings lists: `https://data.sec.gov/submissions/CIK<10-digit CIK>.json`
- SEC, Accessing EDGAR data [S]: <https://www.sec.gov/os/accessing-edgar-data>
- SEC, Developer resources [S]: <https://www.sec.gov/developer>
- SEC, Anthropic, PBC final prospectus (form 424B4, read 2026-11-19): <https://www.sec.gov/Archives/edgar/data/2130357/000162828026074944/anthropicpbc-424b4.htm>

European Union and France

- Eurostat, dissemination API: `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/<dataset>` for every dataset above
- Eurostat, catalogue of all datasets: <https://ec.europa.eu/eurostat/api/dissemination/catalogue/toc/txt?lang=en>
- Eurostat, API introduction: <https://ec.europa.eu/eurostat/web/user-guides/data-browser/api-data-access/api-introduction>
- Eurostat, news "20% of EU enterprises use AI technologies": <https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20251211-2>
- Eurostat, job vacancy release (March 2024): <https://ec.europa.eu/eurostat/en/web/products-euro-indicators/w/3-15032024-ap>
- Eurostat, job vacancy metadata for France: <https://ec.europa.eu/eurostat/cache/metadata/EN/jvs_esqrs_fr.htm>
- Eurostat, registrations and bankruptcies (now redirects to Eurostat's main page) [S]: <https://ec.europa.eu/eurostat/statistics-explained/index.php/Quarterly_registrations_of_new_businesses_and_declarations_of_bankruptcies_-_statistics>
- European Commission, AMECO web query (adjusted wage share): <https://ec.europa.eu/economy_finance/ameco/wq/series?fullVariable=1.0.0.0.ALCD2&countries=FRA,EU27&years=1995,2025&defaultCountries=0&Lastyear=0&Yearorder=ASC>
- ECB, data API: `https://data-api.ecb.europa.eu/service/data/<dataset>/<key>` for the `BLS` and `CISS` keys above
- ECB, working paper 1426 (CISS) [S]: <https://www.ecb.europa.eu/pub/pdf/scpwps/ecbwp1426.pdf>
- INSEE, methodological note on labour indicators, 2026 Q2: <https://www.insee.fr/fr/statistiques/documentation/Note_methodologique_2026T2.pdf>

For the later additions only [S]

- INSEE, monthly consumer confidence survey (Camme): <https://www.insee.fr/en/metadonnees/source/s1046>
- INSEE, SDMX web service guide: <https://www.insee.fr/fr/statistiques/fichier/2862759/BDM_serviceweb_SDMX_V2_2_guideutilisation.pdf>
- Banque de France, business failures bulletin (July 2026): <https://www.banque-france.fr/fr/statistiques/entreprises/defaillances-dentreprises-2026-07>
- Banque de France, Webstat API page: <https://webstat.banque-france.fr/en/pages/api/>
- France Travail, BMO 2026: <https://www.francetravail.fr/candidat/decouvrir-le-marche-du-travail/besoins-en-main-doeuvre.html>
- data.gouv.fr, BMO dataset: <https://www.data.gouv.fr/datasets/enquete-besoins-en-main-doeuvre-bmo>
