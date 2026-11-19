# Starter Indicators and Watched relationships

Research note for issue #3: which Indicators and Watched relationships the
first version of Spock should contain. Written on 2026-11-19.

## In short

- **24 Indicators** across the five Core families: Jobs and labour markets
  (6), Productivity, wages and income distribution (4), Household income and
  consumption (4), Financial conditions and business failures (5), AI
  investment and technological adoption (5).
- **9 Watched relationships**, from "productivity against real wages" to "is
  AI adoption showing up in productivity in all three Regions?".
- Almost everything comes from **free official sources with a documented
  API** (an API is a web address a program can call to fetch data
  automatically, instead of a person downloading a file). Six publishers
  cover most of the list: FRED (which republishes US agency data), Eurostat,
  the ECB, INSEE, the Banque de France and the SEC.
- **The Owner needs three free keys** (a key is a password-like code that
  identifies who is calling an API): FRED, BLS and the US Census Bureau. Two
  more are optional (Banque de France, INSEE portal). See
  [Keys, registration and usage limits](#keys-registration-and-usage-limits).
- **The United States has the richest data.** France and the European Union
  are thinner on AI-exposed occupations (yearly instead of monthly), on bank
  lending (only the member states that use the euro) and on AI investment
  (no data-centre or company-spending equivalent).
- **Important limit of this note.** The cloud session that wrote it could not
  open any of the publishers' websites: the network blocked them all (see
  [How this note was checked](#how-this-note-was-checked)). Claims were
  checked only through web-search results of official pages, and many codes
  and start dates are marked **unverified**. They must be checked against the
  publishers before the data collection is built.

## How this note was checked

Every fact below carries one of two marks:

- **[S]**: seen on the publisher's own page, but only through a web-search
  result describing that page; the page itself could not be opened.
- **[U]**: unverified. Comes from prior knowledge or from an unofficial copy
  of the data (for example DBnomics). Treat it as a lead, not a fact.

No claim could be marked as directly verified. From this session, both a
direct download and the web-page reader were refused for every host tried:
`api.bls.gov`, `fred.stlouisfed.org`, `api.stlouisfed.org`, `ec.europa.eu`,
`data-api.ecb.europa.eu`, `api.insee.fr`, `bdm.insee.fr`,
`webstat.banque-france.fr`, `data.sec.gov`, `www.sec.gov`,
`dares.travail-emploi.gouv.fr`, `statistiques.francetravail.org`,
`www.bls.gov` and `www.insee.fr`. The network gateway answered "403
Forbidden" (access refused).

Following `docs/agents/decisions.md`, section 10: before anyone writes the
data collection, these hosts should be added to the cloud environment's
allowed domains (list in [Hosts to allow](#hosts-to-allow)), and every [U]
item re-checked against the publisher.

### Words used in this note

- **Publisher code** (publishers call it a *series ID* or *dataset code*):
  the publisher's own label for one data feed, such as `UNRATE` at FRED.
- **Frequency**: how often a new value is published (monthly, quarterly,
  yearly).
- **Seasonally adjusted**: corrected for regular calendar effects (summer
  jobs, Christmas shopping) so that months can be compared with each other.
- **Index (2017 = 100)**: a value shown relative to a reference year set to
  100. A value of 110 means 10% higher than in 2017.
- **ISCO / SOC / FAP / PCS / ROME**: job classifications. ISCO is the
  international one used by Eurostat; SOC is the US one; FAP, PCS and ROME are
  French ones (used by DARES, INSEE and France Travail).
- **NACE**: the European classification of industries.

## The 24 Indicators

Each Indicator below gives what it measures, why it reveals the economic
consequences of AI, its Core family, whether it is Leading or Lagging, and a
table with one row per Region.

"Before 1995?" says whether the data goes back far enough to compare with
the Internet wave (1995 to 2005), the main Historical episode.

Some Indicators move at about the same time as the economy rather than
clearly before or after. The glossary has only two labels, so those were
placed where they best fit Spock's purpose; the reason is given each time.

### Family 1: Jobs and labour markets

#### 1. Unemployment rate

Share of people who want a job and are actively looking but have none. It is
the final, widely understood measure of whether job losses from AI are
outpacing new jobs.

- Core family: Jobs and labour markets
- **Lagging**: firms usually stop hiring and cut hours before they lay off.

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BLS (Current Population Survey), via FRED | `UNRATE` (BLS `LNS14000000`) [U] | Monthly | 1948 [U] | Yes | FRED API (key) or BLS API |
| France | INSEE (Labour Force Survey, ILO definition) | INSEE BDM code to confirm [U]; alternative Eurostat `une_rt_m`, geo `FR` [S] | Quarterly (INSEE); monthly (Eurostat) | 1975 for mainland France [U]; INSEE's own tables show 2004 onward [S] | Probably (mainland France) [U] | INSEE BDM; Eurostat API |
| European Union | Eurostat | `une_rt_m`, geo `EU27_2020`, seasonally adjusted [S] | Monthly | 2000 for the EU aggregate [U] | No (EU aggregate) | Eurostat API |

Notes: from the second quarter of 2026, INSEE publishes its main labour
figures for "France" including Mayotte, and keeps the old "France excluding
Mayotte" rate only in a side file [S]
([INSEE methodological note 2026 Q2](https://www.insee.fr/fr/statistiques/documentation/Note_methodologique_2026T2.pdf)).
Spock must pick one and keep it.

#### 2. Total employment

Number of people in work. With output (Indicator 24) and productivity
(Indicator 7), it shows whether the economy grows while employing fewer
people.

- Core family: Jobs and labour markets
- **Lagging**: it confirms what openings and hiring plans showed earlier.

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BLS (payroll survey), via FRED | `PAYEMS` (BLS `CES0000000001`) [U] | Monthly | 1939 [U] | Yes | FRED API |
| France | Eurostat (national accounts) | `namq_10_pe`, geo `FR` [U] | Quarterly | 1995 [U] | No | Eurostat API |
| European Union | Eurostat (national accounts) | `namq_10_pe`, geo `EU27_2020` [U] | Quarterly | 1995 [U] | No | Eurostat API |

INSEE's quarterly salaried-employment estimates are a French alternative with
longer history [U].

#### 3. Job openings (vacancies)

Number or share of jobs employers are trying to fill. If AI lets firms do
more with the same staff, openings fall before unemployment rises.

- Core family: Jobs and labour markets
- **Leading**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BLS (JOLTS survey), via FRED | `JTSJOL` (BLS `JTS000000000000000JOL`) [U] | Monthly | December 2000 [S] | No | FRED API |
| France | Eurostat job vacancy statistics (data from DARES) | `jvs_q_nace2`, geo `FR` [S] | Quarterly | Dataset from 2001; France's start date not confirmed [S] | No | Eurostat API |
| European Union | Eurostat | `jvs_q_nace2`, geo `EU27_2020` [S] | Quarterly | 2001 for the dataset [S]; EU aggregate start unconfirmed | No | Eurostat API |

Notes: JOLTS gives openings by industry and US census region, **not by
occupation** [S]
([BLS JOLTS history](https://www.bls.gov/opub/hom/jlt/history.htm)).
Eurostat notes that France's vacancy figures are "not strictly comparable"
with other member states, and France widened its coverage to firms with fewer
than 10 employees at some point [S]
([Eurostat release](https://ec.europa.eu/eurostat/en/web/products-euro-indicators/w/3-15032024-ap)).
The ECB republishes the same Eurostat data [S].

#### 4. Youth unemployment rate (under 25)

Unemployment among young people. AI first replaces the junior,
routine tasks that young people are hired for, so they may be hit before
everyone else.

- Core family: Jobs and labour markets
- **Leading**: entry-level hiring freezes show here before they reach the
  overall rate.

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BLS, via FRED | `LNS14024887` (ages 16 to 24) [U] | Monthly | 1948 [U] | Yes | FRED API |
| France | Eurostat | `une_rt_m`, geo `FR`, age `Y_LT25` [S] | Monthly | 1983 per an unofficial copy [U] | Probably [U] | Eurostat API |
| European Union | Eurostat | `une_rt_m`, geo `EU27_2020`, age `Y_LT25` [S] | Monthly | 2000 [U] | No | Eurostat API |

The US uses ages 16 to 24, Eurostat 15 to 24: the levels are not directly
comparable, only their direction.

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
| France | France Travail (BMO hiring plans) and INSEE/DARES (Labour Force Survey) | BMO by FAP2021 job family [S]; Eurostat `lfsa_egai2d`, geo `FR` [S] | Yearly | BMO yearly since the 2000s [U]; `lfsa_egai2d` from 2011 [S] | No | Eurostat API; BMO as open-data files [S] |
| European Union | Eurostat (Labour Force Survey) | `lfsa_egai2d`, ISCO-08 two-digit codes `41`, `42`, `25` [S] | Yearly (two-digit); quarterly only at one-digit level [S] | 2011 [S] | No (ISCO-88 data before 2011 is a separate, not comparable dataset [U]) | Eurostat API |

#### 6. Employment in the information and professional-services industries

Number of people working in the industries that use AI most, such as
publishing, telecoms, IT services, consulting, legal and accounting. Industry
data is monthly or quarterly, so it moves faster than the yearly occupation
data of Indicator 5.

- Core family: Jobs and labour markets
- **Leading**: these industries adopt AI first.

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BLS, via FRED | `USINFO` (Information, BLS `CES5000000001`); BLS `CES6054000001` (professional, scientific and technical services); BLS `CES6054150001` (computer systems design) [U] | Monthly | 1939 (Information) [U]; 1990 (the others) [U] | Yes | FRED API; BLS API |
| France | Eurostat (national accounts by industry) | `namq_10_a10_e`, geo `FR`, NACE sections `J` and `M_N` [U] | Quarterly | 1995 [U] | No | Eurostat API |
| European Union | Eurostat | `namq_10_a10_e`, geo `EU27_2020`, `J` and `M_N` [U] | Quarterly | 1995 [U] | No | Eurostat API |

### Family 2: Productivity, wages and income distribution

#### 7. Labour productivity per hour

Output produced per hour worked. If AI makes workers more productive, this
rises; it is the first place the benefit of AI should appear.

- Core family: Productivity, wages and income distribution
- **Leading**: productivity gains come before their effects on wages and
  jobs.

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BLS (Productivity and Costs), via FRED | `OPHNFB`, nonfarm business, index 2017 = 100, seasonally adjusted [S] | Quarterly [S] | 1947 [U] | Yes | FRED API |
| France | Eurostat | `namq_10_lp_ulc`, geo `FR`, real labour productivity per hour [U] | Quarterly | 1995 [U] | No | Eurostat API |
| European Union | Eurostat | `namq_10_lp_ulc`, geo `EU27_2020` [U] | Quarterly | 1995 [U] | No | Eurostat API |

Source for the US code: [FRED OPHNFB](https://fred.stlouisfed.org/series/OPHNFB) [S].
For France and the EU, the European Commission's AMECO database has yearly
productivity back to 1960 [U] and would cover the Internet wave.

#### 8. Real compensation per hour

Pay per hour worked (wages plus employer contributions), corrected for price
rises. It tells whether workers share in AI productivity gains.

- Core family: Productivity, wages and income distribution
- **Lagging**: pay adjusts slowly, through contracts and negotiations.

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BLS, via FRED | `COMPRNFB`, nonfarm business, index 2017 = 100, seasonally adjusted [S] | Quarterly [S] | 1947 [S] | Yes | FRED API |
| France | Eurostat (compensation of employees and hours, national accounts) divided by Eurostat consumer prices | Computed from `namq_10_a10` (compensation `D1`), `namq_10_a10_e` (hours) and `prc_hicp_midx` (prices) [U] | Quarterly | 1995 [U] | No | Eurostat API |
| European Union | Eurostat, same method | Same codes, geo `EU27_2020` [U] | Quarterly | 1995 [U]; EU prices from 1996 [U] | No | Eurostat API |

For France and the EU this Indicator is **computed by Spock**, not published
as such. That is a choice the Owner may want to make knowingly (see
[Open questions](#open-questions-for-the-owner)).
Source for the US code: [FRED COMPRNFB](https://fred.stlouisfed.org/series/COMPRNFB) [S].

#### 9. Labour share of income

Share of the value produced that goes to workers as pay, the rest going to
profits and capital. If AI replaces labour with machines and software, this
share falls.

- Core family: Productivity, wages and income distribution
- **Lagging**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BLS, via FRED | `PRS85006173`, nonfarm business labour share, index 2017 = 100 [S] | Quarterly [S] | 1947 [S] | Yes | FRED API |
| France | European Commission (AMECO) | Adjusted wage share, AMECO code `ALCD2` [U] | Yearly | 1960 [U] | Yes | AMECO download; API not confirmed [U] |
| European Union | European Commission (AMECO) | `ALCD2`, EU27 [U] | Yearly | 1960 [U] | Yes | Same |

A quarterly French and EU version can be computed from Eurostat national
accounts (compensation of employees divided by value added), but it ignores
the self-employed [U]. Source for the US code:
[FRED PRS85006173](https://fred.stlouisfed.org/series/PRS85006173) [S].
Note: the BLS figure is an index of labour's share of business output, not a
percentage of GDP [S].

#### 10. Income inequality (Gini coefficient)

A single number from 0 (everyone has the same income) to 1 (one person has
everything). It shows whether AI's gains concentrate on a few.

- Core family: Productivity, wages and income distribution
- **Lagging**: surveys are yearly and published one to two years late.

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | Census Bureau, via FRED | `GINIALLRH` (household income) [U] | Yearly | 1967 [U] | Yes | FRED API |
| France | Eurostat (EU-SILC survey) | `ilc_di12`, geo `FR` [U] | Yearly | 2004 [U] | No | Eurostat API |
| European Union | Eurostat (EU-SILC survey) | `ilc_di12`, geo `EU27_2020` [U] | Yearly | 2010 [U] | No | Eurostat API |

INSEE publishes a longer French Gini from its own tax-based survey [U].

### Family 3: Household income and consumption

#### 11. Real household disposable income

Income households have left after taxes and benefits, corrected for price
rises ("purchasing power"). If AI reduces jobs or pay, this is where
households feel it.

- Core family: Household income and consumption
- **Lagging**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BEA, via FRED | `DSPIC96` [U] | Monthly | 1959 [U] | Yes | FRED API |
| France | INSEE (quarterly accounts), or Eurostat | INSEE household purchasing power, BDM code to confirm [U]; Eurostat `nasq_10_ki`, geo `FR` [U] | Quarterly | 1949 (INSEE) [U]; 1999 (Eurostat) [U] | Yes (INSEE) [U] | INSEE BDM; Eurostat API |
| European Union | Eurostat | `nasq_10_ki`, real household income per person, `EU27_2020` [U] | Quarterly | 1999 [U] | No | Eurostat API |

#### 12. Real household consumption

What households spend, corrected for price rises. It tells whether AI's
effects on jobs and income have reached demand, which is the third concern
named in the glossary.

- Core family: Household income and consumption
- **Lagging**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BEA, via FRED | `PCEC96` (monthly) [U]; `PCECC96` (quarterly) [U] | Monthly / quarterly | 2002 monthly [U]; 1947 quarterly [U] | Yes (quarterly) | FRED API |
| France | INSEE (household consumption of goods) or Eurostat | INSEE BDM code to confirm (monthly, goods only) [U]; Eurostat `namq_10_gdp`, item `P31_S14`, geo `FR` [U] | Monthly (INSEE) / quarterly (Eurostat) | 1980 (INSEE) [U]; 1995 (Eurostat) [U] | Yes (INSEE) [U] | INSEE BDM; Eurostat API |
| European Union | Eurostat | `namq_10_gdp`, `P31_S14`, `EU27_2020` [U] | Quarterly | 1995 [U] | No | Eurostat API |

#### 13. Household saving rate

Share of disposable income households save rather than spend. Households
who fear for their jobs save more; a rising saving rate can come before weaker
spending ahead.

- Core family: Household income and consumption
- **Leading**: precautionary saving rises before spending falls.

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BEA, via FRED | `PSAVERT` [U] | Monthly | 1959 [U] | Yes | FRED API |
| France | INSEE or Eurostat | INSEE BDM code to confirm [U]; Eurostat `nasq_10_ki`, gross household saving rate, `FR` [U] | Quarterly | 1949 (INSEE) [U]; 1999 (Eurostat) [U] | Yes (INSEE) [U] | INSEE BDM; Eurostat API |
| European Union | Eurostat | `nasq_10_ki`, `EU27_2020` [U] | Quarterly | 1999 [U] | No | Eurostat API |

US and European saving rates are defined differently (net versus gross);
compare their direction, not their level [U].

#### 14. Consumer confidence and unemployment fears

Monthly surveys asking households how they see their finances and whether
they expect unemployment to rise. Fear of AI-driven job loss should show here
before it shows in spending.

- Core family: Household income and consumption
- **Leading**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | University of Michigan, via FRED | `UMCSENT` [U] | Monthly | 1978 monthly [U] | Yes | FRED API; reuse terms to check [U] |
| France | INSEE (household survey "Camme") | Synthetic confidence indicator, BDM code to confirm [U]; INSEE also publishes an unemployment-fears balance [U] | Monthly | January 1987 [S] | Yes | INSEE BDM |
| European Union | European Commission survey, via Eurostat | `ei_bsco_m`, indicator `BS-CSMCI` [S]; unemployment expectations code to confirm [U] | Monthly | 1985 for many member states [S]; EU aggregate start unconfirmed | Yes [S] | Eurostat API |

Sources: [INSEE Camme survey](https://www.insee.fr/en/metadonnees/source/s1046) [S].
INSEE's index and the European Commission's French figure are weighted
differently and can move differently [S].

### Family 4: Financial conditions and business failures

#### 15. Business failures (insolvencies)

Number of firms going bankrupt. It shows firms whose business AI makes
obsolete (for example call centres or translation agencies), and also the
overall strain on firms.

- Core family: Financial conditions and business failures
- **Lagging**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | Administrative Office of the US Courts | Business bankruptcy filings, statistical table F-2 [U] | Quarterly | Decades back [U] | Probably [U] | **No API**: downloadable tables only [U] |
| France | Banque de France | Business failures, 12-month total; Webstat code to confirm [S] | Monthly [S] | December 1991 [S] | Yes | Webstat API (free account) [S]; or Eurostat `sts_rb_q`, geo `FR` [S] |
| European Union | Eurostat | `sts_rb_q`, bankruptcy declarations, index 2021 = 100 [S] | Quarterly [S] | 2015 [S] | No | Eurostat API |

Sources: [Banque de France monthly bulletin](https://www.banque-france.fr/fr/statistiques/entreprises/defaillances-dentreprises-2026-07) [S];
[Eurostat registrations and bankruptcies](https://ec.europa.eu/eurostat/statistics-explained/index.php/Quarterly_registrations_of_new_businesses_and_declarations_of_bankruptcies_-_statistics) [S].
Eurostat publishes an index, not counts, because registration procedures differ
between member states [S]. Banque de France figures are revised each month
as court records arrive [S].

#### 16. New business creations

Number of new firms started. AI may let people start one-person businesses,
or push laid-off workers into self-employment.

- Core family: Financial conditions and business failures
- **Leading**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | Census Bureau (Business Formation Statistics), via FRED | `BABATOTALSAUS` (business applications) [U] | Monthly (also weekly) [U] | July 2004 [U] | No | FRED API |
| France | INSEE (business creations) | BDM code to confirm [U] | Monthly | 2000 [U] | No | INSEE BDM |
| European Union | Eurostat | `sts_rb_q`, registrations, index 2021 = 100 [S] | Quarterly [S] | 2015 [S] | No | Eurostat API |

French creations include many sole traders ("micro-entrepreneurs"), so
changes in their legal regime move the number [U].

#### 17. Bank lending standards

Surveys asking banks whether they are making loans harder to get. Banks
that see firms threatened by AI, or households at risk of job loss, tighten
first.

- Core family: Financial conditions and business failures
- **Leading**: tightening came before the 2001 and 2008 recessions [S].

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | Federal Reserve (Senior Loan Officer Survey), via FRED | `DRTSCILM` (loans to large and mid-sized firms) [S] | Quarterly [S] | 1990 [U] | Yes | FRED API |
| France | ECB and Banque de France (Bank Lending Survey) | ECB dataset `BLS`, France key to confirm [U] | Quarterly | 2003 [U] | No | ECB API |
| European Union | **Not available for all 27**: the ECB survey covers only member states using the euro [U] | ECB `BLS`, total for the member states using the euro [U] | Quarterly | 2003 [U] | No | ECB API |

#### 18. Financial stress index

One daily number that sums up stress in stock, bond, money and currency
trading. An AI investment boom that turns to bust would show here first.

- Core family: Financial conditions and business failures
- **Leading**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | ECB (CISS for the US) [S]; or St. Louis Fed, via FRED | ECB `CISS`, US key to confirm [U]; FRED `STLFSI4` [U] | Daily (ECB) [S]; weekly (FRED) [U] | 1980 (ECB) [U]; 1993 (FRED) [U] | Yes | ECB API; FRED API |
| France | ECB | `CISS`, version for France: existence to confirm [U] | Weekly or daily [U] | Unconfirmed | Unconfirmed | ECB API |
| European Union | **Not available for all 27**: the ECB's main CISS covers member states using the euro [S] | `CISS`, key to confirm [U] | Daily [S] | 1980 [U] | Yes [U] | ECB API |

Source: [ECB working paper 1426 on the CISS](https://www.ecb.europa.eu/pub/pdf/scpwps/ecbwp1426.pdf) [S].
Corporate bond spreads (for example ICE BofA on FRED) were rejected: the data
owner limits how much history FRED may show [U].

#### 19. Household loan arrears

Share of household loans (credit cards, consumer loans) that are late. If AI
causes job losses, households fall behind on payments.

- Core family: Financial conditions and business failures
- **Lagging**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | Federal Reserve, via FRED | `DRCCLACBS` (credit cards) [U] | Quarterly | 1991 [U] | Yes | FRED API |
| France | Banque de France (household over-indebtedness cases) | Webstat code to confirm [U] | Monthly or quarterly [U] | Unconfirmed | Unconfirmed | Webstat API [U] |
| European Union | **Much poorer**: no comparable household arrears figure for all 27 was found [U] | — | — | — | — | — |

### Family 5: AI investment and technological adoption

#### 20. Hyperscaler capital spending

Money spent on data centres, servers and chips by the five largest cloud and
AI companies (Microsoft, Alphabet, Amazon, Meta, Oracle). It is the clearest
measure of how much is being bet on AI. Details in
[Hyperscaler capital spending](#hyperscaler-capital-spending).

- Core family: AI investment and technological adoption
- **Leading**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | Company filings to the SEC (EDGAR) | XBRL tag per company, e.g. `PaymentsToAcquirePropertyPlantAndEquipment` [U] | Quarterly | About 2009 in machine-readable form [U] | No | SEC EDGAR API (no key) |
| France | **Not applicable**: these companies are American and report worldwide totals | — | — | — | — | — |
| European Union | **Not applicable**, same reason | — | — | — | — | — |

Shown as one worldwide Indicator, labelled as not tied to a Region.

#### 21. Business investment in IT equipment and software

What all firms spend on computers, communication equipment and software,
corrected for price changes. It measures AI investment across the whole
economy, not only five companies, and goes back to the Internet wave.

- Core family: AI investment and technological adoption
- **Leading**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BEA (national accounts table 5.3.6, real private fixed investment), via FRED | Lines "information processing equipment" and "software"; FRED codes to confirm [U] | Quarterly | 1947 [U] | Yes | FRED API or BEA API |
| France | Eurostat (investment by asset) | `namq_10_an6`, geo `FR`, ICT equipment and intellectual property products [U]; yearly `nama_10_an6` has "computer software and databases" [U] | Quarterly / yearly | 1995 [U] | No | Eurostat API |
| European Union | Eurostat | Same codes, `EU27_2020` [U] | Quarterly / yearly | 1995 [U] | No | Eurostat API |

#### 22. Share of firms using AI

Share of businesses that say they use AI. It measures how far adoption has
spread beyond the tech industry.

- Core family: AI investment and technological adoption
- **Leading**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | Census Bureau (Business Trends and Outlook Survey, BTOS) | AI use rate [S] | Every two weeks [S] | September 2023 [S] | No | Downloadable files; API to confirm [U] |
| France | Eurostat (ICT usage in enterprises survey) | `isoc_eb_ai`, geo `FR` [S] | Yearly (2021, then from 2023) [S] | 2021 [S] | No | Eurostat API |
| European Union | Eurostat | `isoc_eb_ai`, `EU27_2020` [S]; 20% of firms with 10+ employees in 2025 [S] | Yearly [S] | 2021 [S] | No | Eurostat API |

Notes: the US question was reworded in November 2025, from AI use "in
producing goods or services" to use "in any business function". Values
before and after are **not comparable** [S]
([Census research note](https://www.census.gov/newsroom/blogs/research-matters/2024/12/ai-use-small-businesses.html),
[Census 2026 story](https://census.gov/library/stories/2026/05/ai-use-businesses.html)).
The US and EU surveys ask different questions and cover different firm sizes;
compare directions only. Eurostat source:
[Eurostat news, 11 December 2025](https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20251211-2) [S].

#### 23. Data-centre construction spending

Money spent each month building data centres. It shows AI investment turning
into physical buildings, and reaches the real economy (construction jobs,
electricity).

- Core family: AI investment and technological adoption
- **Leading**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | Census Bureau (construction spending) | Private data-centre line, now shown apart from offices [S]; code to confirm [U] | Monthly [S] | Start date of the separate line unconfirmed [U] | No | Census API [U] |
| France | **Not available** | — | — | — | — | — |
| European Union | **Not available** | — | — | — | — | — |

#### 24. Output of the information and communication industry

Value produced by publishing, telecoms, IT and software firms, corrected for
price changes. Compared with Indicator 6, it shows whether this industry
grows without hiring.

- Core family: AI investment and technological adoption
- **Leading**

| Region | Publisher | Publisher code | Frequency | Since | Before 1995? | Free API |
| --- | --- | --- | --- | --- | --- | --- |
| United States | BEA (GDP by industry), via FRED or BEA API | Real value added, Information; code to confirm [U] | Quarterly | 2005 quarterly [U]; 1947 yearly [U] | Yes (yearly) [U] | FRED API or BEA API |
| France | Eurostat | `namq_10_a10`, NACE `J`, chain-linked volumes, `FR` [U] | Quarterly | 1995 [U] | No | Eurostat API |
| European Union | Eurostat | Same, `EU27_2020` [U] | Quarterly | 1995 [U] | No | Eurostat API |

## AI-exposed occupations

This is where the three Regions differ most.

### Which job codes

| Occupation | US code (SOC 2018) | International code (ISCO-08) | Usable at Eurostat? |
| --- | --- | --- | --- |
| Administrative work | `43-0000` Office and administrative support [U] | `41` General and keyboard clerks [U] | Yes, two-digit [S] |
| Customer support | `43-4051` Customer service representatives [U] | `42` Customer services clerks [U] | Yes, two-digit [S] |
| Translation | `27-3091` Interpreters and translators [U] | `2643` Translators, interpreters and other linguists [U] | **No**: inside `26`, which also holds lawyers, artists and others [U] |
| Software development | `15-1252` Software developers [U] | `25` ICT professionals (includes `2512` software developers) [U] | Yes, but only as all ICT professionals [U] |

### United States

- **OEWS** (Occupational Employment and Wage Statistics, BLS): employment and
  wages for about 800 occupations. Yearly, with a May reference date, since
  1997 [S]. Classification changes in 1999, 2010 and 2018 break comparisons
  over time [S]
  ([BLS OEWS history](https://www.bls.gov/opub/hom/oews/history.htm)).
  Published about a year after the reference date [U]. The BLS API carries
  only the latest year; history comes from yearly files [U].
- **CPS** (Current Population Survey, the household survey behind the
  unemployment rate): monthly, but BLS publishes employment by detailed
  occupation as yearly averages; monthly occupation detail needs the raw
  survey files, which is heavy work [U].
- **JOLTS** (job openings): monthly, but **no occupation detail**, only
  industries and US census regions [S].

### France

- **France Travail BMO** (hiring-plans survey, *Besoins en main-d'œuvre*):
  once a year, planned hiring by job family (FAP2021), including how many
  are hard to fill. The 2026 edition surveyed 416,588 workplaces from October
  to December 2025 and counted about 2.28 million planned hires [S]. Open
  data on data.gouv.fr, but the files lack documentation and use non-standard
  formats [S]
  ([data.gouv.fr BMO](https://www.data.gouv.fr/datasets/enquete-besoins-en-main-doeuvre-bmo)).
- **Job seekers and job offers by occupation** (France Travail and DARES, by
  ROME code): quarterly [U]. This could be the most frequent French
  occupation figure, but it was not verified.
- **Labour Force Survey** (INSEE), by PCS or FAP: yearly [U]; also reported
  to Eurostat as `lfsa_egai2d` [S].

### European Union

- **Eurostat Labour Force Survey** `lfsa_egai2d`: employment by ISCO-08
  two-digit occupation, yearly, from 2011 [S]. Quarterly data exists only
  at the one-digit level (e.g. all "clerical support workers") [S]. This is
  the same source for France and the EU, so the two are comparable.
- **Eurostat job vacancies by occupation** (`jvs_q_isco_r2`) exists [S], but
  many member states do not report it [U].

### What this means for Spock

- Only the United States has an occupation figure that comes more often than
  once a year, and even there the easy one (OEWS) is yearly.
- Translation cannot be isolated in EU data; Spock should say so on the
  Indicator.
- Indicator 6 (employment in AI-heavy industries, monthly or quarterly in all
  three Regions) is the faster stand-in until yearly occupation data arrives.

## Hyperscaler capital spending

Hyperscalers report capital spending in their quarterly and yearly filings
to the SEC (the US financial regulator). Since about 2009, these filings
carry machine-readable tags (called XBRL) that the SEC republishes for free
[U].

- **Where:** the SEC's free EDGAR API on `data.sec.gov`. It offers, per
  company, all reported figures (`companyfacts`) or one figure over time
  (`companyconcept`), as JSON (a structured text format programs read) [S]
  ([SEC: Accessing EDGAR data](https://www.sec.gov/os/accessing-edgar-data)).
- **No key**, but **conditions**: at most 10 requests per second, and every
  request must declare who sends it in a "User-Agent" header, the SEC's
  example being a company name and an administrator's email [S]
  ([SEC developer resources](https://www.sec.gov/developer)). The SEC may
  block senders who ignore these conditions [S]. Spock needs only a handful of
  requests a day, far below the limit.
- **Companies and identifiers** (the SEC's company number, called CIK):
  Microsoft `0000789019` [U], Alphabet `0001652044` [U], Amazon `0001018724`
  [S], Meta `0001326801` [U], Oracle `0001341439` [U].
- **Which figure:** "purchases of property and equipment" in the cash-flow
  statement. Most of these companies tag it
  `PaymentsToAcquirePropertyPlantAndEquipment`; Amazon's tag could not be
  confirmed [U]. The first build must read each company's latest filing to
  confirm the tag.
- **Traps to handle:**
  - Quarterly filings report the year so far, not the quarter alone; the
    quarter must be computed by subtraction [U].
  - Microsoft's year ends in June and Oracle's in May, so "Q1" means
    different months [U].
  - Some spending is through leases and does not appear in this line [U].
  - The figure covers all buildings and equipment, not only AI.
- **History:** machine-readable from about 2009 only [U], so this Indicator
  cannot be compared with the Internet wave. Indicator 21 (IT investment)
  covers that.

## Watched relationships

Nine proposals. Each checks for a Divergence (two Indicators that normally
move together drifting apart) or a Pattern (several Indicators pointing the
same way at the same time).

| # | Indicators | Kind | Plain-English question | What it would mean |
| --- | --- | --- | --- | --- |
| W1 | 7 Productivity; 8 Real compensation per hour | Divergence | Are workers getting their share of AI's productivity gains? | Productivity rising while real pay stays flat: AI's gains go elsewhere. |
| W2 | 7 Productivity; 9 Labour share; 10 Inequality | Pattern | Do AI's gains go to capital rather than workers? | Productivity up, labour share down, inequality up at the same time. |
| W3 | 20 Hyperscaler spending; 21 IT investment; 22 Firms using AI; 5 Employment in AI-exposed occupations | Pattern | Is AI investment replacing the jobs it targets? | Investment and adoption rising while employment in exposed occupations falls. |
| W4 | 24 Output of information industry; 6 Employment in information and professional services | Divergence | Is the tech industry growing without hiring? | Output rising while employment stalls or falls. |
| W5 | 4 Youth unemployment; 1 Unemployment rate | Divergence | Are young people hit first? | Youth unemployment rising while the overall rate stays stable. |
| W6 | 3 Job openings; 1 Unemployment rate | Divergence | Are employers hiring less without laying off yet? | Openings falling while unemployment stays low; or both rising, meaning jobs on offer no longer match the people looking. |
| W7 | 14 Confidence and unemployment fears; 13 Saving rate; 12 Real consumption; 11 Real disposable income | Pattern | Are households getting worried and cutting back? | Fear of unemployment and saving up, spending down, possibly before income falls. |
| W8 | 17 Lending standards; 18 Financial stress; 15 Business failures; 19 Household arrears | Pattern | Is the financial system turning against firms and households? | Tighter credit and higher stress, followed by more failures and arrears. |
| W9 | 22 Firms using AI; 21 IT investment; 7 Productivity, compared across the three Regions | Divergence | Is AI adoption showing up in productivity, and where first? | One Region adopting and investing faster and pulling ahead in productivity, as the United States did during the Internet wave [U]; or adoption rising everywhere with no productivity gain anywhere. |

W1, W2, W5, W6 and W8 can be compared with the Internet wave in the United
States; most French and EU data starts in 1995 or later.

## Keys, registration and usage limits

| Publisher | Key needed? | How to get it | Usage limits | Notes |
| --- | --- | --- | --- | --- |
| FRED (St. Louis Fed) | **Yes**, free | Account on the FRED website, then request an API key [U] | 120 requests per minute is widely reported, but the official page could not be read [U] | Covers most US Indicators, so the most important key. FRED asks for attribution [U]. Some data on FRED belongs to third parties (University of Michigan) with their own terms [U]. |
| BLS | **Yes** for version 2, free | Form at `data.bls.gov/registrationEngine`; key arrives by email [S] | Version 2: 500 requests a day, 50 data feeds per request, 20 years per request; version 1 (no key): 25 a day, 25 feeds, 10 years; both 50 requests per 10 seconds [S] | Must be renewed once a year [S] ([BLS API FAQ](https://www.bls.gov/developers/api_faqs.htm)). Needed only for what FRED lacks (OEWS). |
| US Census Bureau | **Yes**, free | Sign-up at `api.census.gov/data/key_signup.html` [S] | Officially 500 requests a day without a key [S]; a May 2026 report says a key is now required for every request [U] | Needed for data-centre construction and possibly BTOS. Get the key to be safe. |
| BEA | Optional, free | Registration on the BEA API site [U] | Not confirmed [U] | Only if FRED lacks a needed BEA line. |
| SEC EDGAR | **No key** | — | 10 requests per second; declared User-Agent with contact details [S] | The User-Agent needs a contact email: a decision for the Owner (see Open questions). |
| Eurostat | No key [U] | — | None published [U] | "Open for public use" per Eurostat [S] ([Eurostat API introduction](https://ec.europa.eu/eurostat/web/user-guides/data-browser/api-data-access/api-introduction)). |
| ECB | No key [U] | — | None published [U] | ([ECB API help](https://data.ecb.europa.eu/help/api/data)) [S]. |
| INSEE | No key on `bdm.insee.fr` [S]; account needed for the `api.insee.fr` portal [S] | Portal sign-up only if needed | Not confirmed [U] | INSEE's guide says the same paths work on both hosts [S] ([INSEE SDMX guide](https://www.insee.fr/fr/statistiques/fichier/2862759/BDM_serviceweb_SDMX_V2_2_guideutilisation.pdf)). |
| Banque de France Webstat | **Yes**, free | Sign up on the Webstat developer portal, create an "app", which gives a client ID [S] | Not confirmed [U] | Only for French business failures with history before 2015 and household over-indebtedness. Eurostat covers failures from 2015 without a key. |
| France Travail BMO, DARES | No key for the files [U] | — | — | Files, not an API; yearly or quarterly download. |

Never paste a key into the chat or an issue (`docs/agents/decisions.md`,
section 7).

## Hosts to allow

Two lists: hosts the **daily data collection** must reach, and hosts the
**next research or build session** must reach to check this note's [U]
items. Exact API hosts marked [U] should be confirmed when the docs can be
read.

### Daily data collection

| Host | What for |
| --- | --- |
| `api.stlouisfed.org` | FRED API: most US Indicators |
| `api.bls.gov` | BLS API: OEWS and BLS-only figures |
| `api.census.gov` | Census API: construction spending, possibly BTOS [U] |
| `www.census.gov` | BTOS download files [U] |
| `apps.bea.gov` | BEA API, only if needed [U] |
| `data.sec.gov` | SEC EDGAR company figures [S] |
| `www.sec.gov` | SEC list matching companies to CIK numbers [U] |
| `ec.europa.eu` | Eurostat API (`/eurostat/api/dissemination/...`) [S]; AMECO may also live here [U] |
| `data-api.ecb.europa.eu` | ECB API: lending survey, CISS [S] |
| `bdm.insee.fr` | INSEE statistics API without a key [S] |
| `api.insee.fr` | INSEE API portal, if the keyless host is retired [S] |
| `webstat.banque-france.fr` | Banque de France Webstat; the exact API host may differ [U] |
| `www.data.gouv.fr` and `static.data.gouv.fr` | France Travail BMO files [U] |
| `dares.travail-emploi.gouv.fr` | DARES files (job seekers and vacancies by occupation) [U] |
| `www.uscourts.gov` | US business bankruptcy tables [U] |

### Documentation, for checking this note

`fred.stlouisfed.org`, `www.bls.gov`, `data.bls.gov`, `www.bea.gov`,
`www.census.gov`, `www.federalreserve.gov`, `www.insee.fr`,
`portail-api.insee.fr`, `www.banque-france.fr`,
`developer.webstat.banque-france.fr`, `data.ecb.europa.eu`,
`www.ecb.europa.eu`, `economy-finance.ec.europa.eu`, `francetravail.org`,
`www.sec.gov`.

## Missing or poorer coverage

These will be shown, labelled, on the Dashboard.

- **Hyperscaler capital spending** (20): worldwide, not split by Region.
- **Data-centre construction** (23): United States only.
- **Bank lending standards** (17) and **financial stress** (18): France and
  the member states using the euro, not all 27 members of the European
  Union.
- **Household arrears** (19): no EU-wide figure; French figure unconfirmed.
- **AI-exposed occupations** (5): yearly everywhere for easy-to-use data;
  translation cannot be isolated in EU data; history starts in 1997 (US) and
  2011 (France, EU).
- **Job openings** (3): no occupation detail in any Region at monthly or
  quarterly frequency without heavy work.
- **Business failures** (15): EU index only from 2015; US has no API.
- **Firms using AI** (22): starts 2021 (EU) and 2023 (US); the US question
  changed in November 2025.
- **Internet wave comparison**: most French and EU Indicators start in 1995
  or later; only the US, AMECO and some INSEE data cover 1995 to 2005 with a
  run-up before it.
- **Real compensation** (8) and **labour share** (9) for France and the EU:
  computed by Spock or yearly only.

## Open questions for the Owner

1. **Allow the hosts first?** This note could not open any publisher's site.
   Should the hosts above be added to the cloud environment before anyone
   checks the [U] items and builds the data collection? (Recommended: yes.)
2. **France: INSEE or Eurostat?** For France, many Indicators exist both at
   INSEE (longer history, French definitions) and at Eurostat (same
   definitions as the EU, shorter history). Recommended: Eurostat by default,
   so France and the EU are comparable, and INSEE only where it adds history
   before 1995.
3. **Computed Indicators.** Real compensation per hour (8) for France and the
   EU must be computed from three Eurostat figures. Is the Owner comfortable
   showing an Indicator Spock computes, clearly labelled, rather than one a
   publisher publishes?
4. **SEC contact email.** The SEC requires each request to carry contact
   details. Which email should Spock declare: the Owner's, or a dedicated
   address?
5. **Banque de France account.** Worth one more account to get French
   business failures back to 1991, or is Eurostat from 2015 enough?
6. **Hyperscaler list.** Microsoft, Alphabet, Amazon, Meta and Oracle. Add or
   remove any (for example Apple, or a European firm)?

## Sources

Every source below was seen only through a web-search result, not opened
directly (see [How this note was checked](#how-this-note-was-checked)).

US

- BLS, Public Data API FAQ: <https://www.bls.gov/developers/api_faqs.htm>
- BLS, JOLTS history (Handbook of Methods): <https://www.bls.gov/opub/hom/jlt/history.htm>
- BLS, OEWS history (Handbook of Methods): <https://www.bls.gov/opub/hom/oews/history.htm>
- FRED, OPHNFB: <https://fred.stlouisfed.org/series/OPHNFB>
- FRED, COMPRNFB: <https://fred.stlouisfed.org/series/COMPRNFB>
- FRED, PRS85006173: <https://fred.stlouisfed.org/series/PRS85006173>
- FRED, DRTSCILM: <https://fred.stlouisfed.org/series/DRTSCILM>
- Census Bureau, AI use in small businesses (BTOS): <https://www.census.gov/newsroom/blogs/research-matters/2024/12/ai-use-small-businesses.html>
- Census Bureau, AI use by firm size (2026): <https://census.gov/library/stories/2026/05/ai-use-businesses.html>
- Census Bureau, Data API user guide: <https://www.census.gov/data/developers/guidance/api-user-guide.Help_&_Contact_Us.html>
- SEC, Accessing EDGAR data: <https://www.sec.gov/os/accessing-edgar-data>
- SEC, Developer resources: <https://www.sec.gov/developer>
- SEC, Amazon filing index (CIK 1018724): <https://www.sec.gov/Archives/edgar/data/1018724/000101872425000123/R8.htm>

France

- INSEE, methodological note on labour indicators, 2026 Q2: <https://www.insee.fr/fr/statistiques/documentation/Note_methodologique_2026T2.pdf>
- INSEE, "L'essentiel sur... le chômage": <https://www.insee.fr/fr/statistiques/4805248>
- INSEE, monthly consumer confidence survey (Camme): <https://www.insee.fr/en/metadonnees/source/s1046>
- INSEE, SDMX web service guide: <https://www.insee.fr/fr/statistiques/fichier/2862759/BDM_serviceweb_SDMX_V2_2_guideutilisation.pdf>
- INSEE, SDMX web service (English): <https://insee.fr/en/information/2868055>
- Banque de France, business failures bulletin (July 2026): <https://www.banque-france.fr/fr/statistiques/entreprises/defaillances-dentreprises-2026-07>
- Banque de France, Webstat API page: <https://webstat.banque-france.fr/en/pages/api/>
- France Travail, BMO 2026: <https://www.francetravail.fr/candidat/decouvrir-le-marche-du-travail/besoins-en-main-doeuvre.html>
- data.gouv.fr, BMO dataset: <https://www.data.gouv.fr/datasets/enquete-besoins-en-main-doeuvre-bmo>

European Union

- Eurostat, API introduction: <https://ec.europa.eu/eurostat/web/user-guides/data-browser/api-data-access/api-introduction>
- Eurostat, API getting started: <https://ec.europa.eu/eurostat/web/user-guides/data-browser/api-data-access/api-getting-started>
- Eurostat, une_rt_m metadata: <https://ec.europa.eu/eurostat/cache/metadata/en/une_rt_m_esms.htm>
- Eurostat, registrations and bankruptcies: <https://ec.europa.eu/eurostat/statistics-explained/index.php/Quarterly_registrations_of_new_businesses_and_declarations_of_bankruptcies_-_statistics>
- Eurostat, use of AI in enterprises: <https://ec.europa.eu/eurostat/statistics-explained/index.php/Use_of_artificial_intelligence_in_enterprises>
- Eurostat, news "20% of EU enterprises use AI technologies": <https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20251211-2>
- Eurostat, job vacancy release (March 2024): <https://ec.europa.eu/eurostat/en/web/products-euro-indicators/w/3-15032024-ap>
- Eurostat, job vacancy metadata for France: <https://ec.europa.eu/eurostat/cache/metadata/EN/jvs_esqrs_fr.htm>
- ECB, Data Portal API help: <https://data.ecb.europa.eu/help/api/data>
- ECB, working paper 1426 (CISS): <https://www.ecb.europa.eu/pub/pdf/scpwps/ecbwp1426.pdf>

Unofficial copies consulted only as leads (marked [U] where used)

- DBnomics copies of Eurostat datasets `lfsa_egai2d`, `une_rt_m`,
  `ei_bsco_m`, `sts_rb_a`: <https://db.nomics.world/Eurostat>
