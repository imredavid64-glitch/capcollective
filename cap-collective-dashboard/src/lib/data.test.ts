import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildCsvUrl,
  fetchCollectionTrend,
  fetchDashboardData,
  fetchImpactMetrics,
  fetchLeaderboard,
  fetchProductMix,
  fetchSensorData,
  parseCsv,
} from '@/lib/data';

describe('buildCsvUrl', () => {
  it('builds a Google Sheets CSV export URL with the given gid', () => {
    const url = buildCsvUrl('12345');
    expect(url).toContain('/export?format=csv&gid=12345');
    expect(url.startsWith('https://docs.google.com/spreadsheets/d/')).toBe(true);
  });
});

describe('parseCsv', () => {
  it('returns an empty array for empty or header-only input', () => {
    expect(parseCsv('')).toEqual([]);
    expect(parseCsv('a,b,c')).toEqual([]);
    expect(parseCsv('\n\n')).toEqual([]);
  });

  it('maps rows to objects keyed by header', () => {
    const csv = 'Caps Collected,Weight (kg)\n100,0.4\n250,1.0';
    expect(parseCsv(csv)).toEqual([
      { 'Caps Collected': '100', 'Weight (kg)': '0.4' },
      { 'Caps Collected': '250', 'Weight (kg)': '1.0' },
    ]);
  });

  it('trims whitespace and surrounding quotes', () => {
    const csv = ' name , role \n " Alex " , " Data Analyst " ';
    expect(parseCsv(csv)).toEqual([{ name: 'Alex', role: 'Data Analyst' }]);
  });

  it('drops rows whose column count does not match the header', () => {
    const csv = 'a,b\n1,2\n3\n4,5';
    expect(parseCsv(csv)).toEqual([
      { a: '1', b: '2' },
      { a: '4', b: '5' },
    ]);
  });
});

describe('sheet-backed fetchers', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    mockFetch.mockReset();
  });

  function okCsv(body: string) {
    return { ok: true, status: 200, text: async () => body };
  }

  it('parses impact metrics from the published CSV', async () => {
    mockFetch.mockResolvedValueOnce(
      okCsv(
        'Caps Collected,Weight (kg),CO2e Avoided (kg),Products Made,Revenue ($),Students Engaged,Last Updated\n' +
          '12450,43.6,65.4,312,2847.5,87,2026-10-01'
      )
    );

    const metrics = await fetchImpactMetrics();
    expect(metrics).toMatchObject({
      capsCollected: 12450,
      weightKg: 43.6,
      co2eAvoided: 65.4,
      productsMade: 312,
      revenue: 2847.5,
      studentsEngaged: 87,
      lastUpdated: '2026-10-01',
    });
  });

  it('falls back to mock data when the sheet returns an error', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500, text: async () => '' });

    const metrics = await fetchImpactMetrics();
    expect(metrics.capsCollected).toBeGreaterThan(0);
    expect(metrics.studentsEngaged).toBeGreaterThan(0);
  });

  it('sorts the leaderboard by caps and caps it at 10 entries', async () => {
    const rows = ['Student Name,Grade,Role,Hours Logged,Caps Collected'];
    for (let i = 0; i < 12; i++) {
      rows.push(`Student ${i},10,Member,${i},${i * 100}`);
    }
    mockFetch.mockResolvedValueOnce(okCsv(rows.join('\n')));

    const board = await fetchLeaderboard();
    expect(board).toHaveLength(10);
    expect(board[0].capsCollected).toBe(1100);
    expect(board[0].capsCollected).toBeGreaterThanOrEqual(board[1].capsCollected);
  });

  it('maps collection trend rows and ignores incomplete ones', async () => {
    mockFetch.mockResolvedValueOnce(
      okCsv('Date,Count,Weight (kg),Location\n2026-10-01,400,1.4,Cafeteria\n,,\n2026-10-08,450,1.6,Gym')
    );

    const trend = await fetchCollectionTrend();
    expect(trend).toEqual([
      { date: '2026-10-01', count: 400, weightKg: 1.4, location: 'Cafeteria' },
      { date: '2026-10-08', count: 450, weightKg: 1.6, location: 'Gym' },
    ]);
  });

  it('maps product mix rows', async () => {
    mockFetch.mockResolvedValueOnce(
      okCsv(
        'SKU,Product,Qty Made,Qty Sold,Price,Revenue,Material Cost,Margin\n' +
          'COASTER-4PK,Coaster Set (4),85,62,12,744,1.2,70'
      )
    );

    const products = await fetchProductMix();
    expect(products).toEqual([
      {
        sku: 'COASTER-4PK',
        name: 'Coaster Set (4)',
        quantityMade: 85,
        quantitySold: 62,
        price: 12,
        revenue: 744,
        materialCost: 1.2,
        margin: 70,
      },
    ]);
  });

  it('maps sensor rows and defaults missing values', async () => {
    mockFetch.mockResolvedValueOnce(
      okCsv('Timestamp,Bin ID,Count,Fill %,Temperature,Status\n2026-10-01T10:00,CAFE-01,120,45,21.5,OK')
    );

    const sensors = await fetchSensorData();
    expect(sensors).toEqual([
      {
        timestamp: '2026-10-01T10:00',
        binId: 'CAFE-01',
        count: 120,
        fillPercent: 45,
        temperature: 21.5,
        status: 'OK',
      },
    ]);
  });

  it('fetchDashboardData resolves all five panels', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404, text: async () => '' });

    const data = await fetchDashboardData();
    expect(data).toHaveProperty('impact');
    expect(data).toHaveProperty('collectionTrend');
    expect(data).toHaveProperty('productMix');
    expect(data).toHaveProperty('leaderboard');
    expect(data).toHaveProperty('sensorData');
    expect(data.collectionTrend.length).toBeGreaterThan(0);
  });
});
