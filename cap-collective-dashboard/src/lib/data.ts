import { DashboardData, ImpactMetrics, CollectionDataPoint, ProductData, StudentLeaderboardEntry, SensorDataPoint } from '@/types';

// Configuration - Replace with your actual Google Sheets IDs
export const SHEETS_CONFIG = {
  // Get these from your Google Sheet URL: https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit#gid={GID}
  sheetId: process.env.NEXT_PUBLIC_SHEETS_ID || 'YOUR_SHEET_ID_HERE',
  tabs: {
    impactDashboard: process.env.NEXT_PUBLIC_GID_IMPACT || '0',
    collectionTracker: process.env.NEXT_PUBLIC_GID_COLLECTION || '0',
    productInventory: process.env.NEXT_PUBLIC_GID_PRODUCTS || '0',
    studentRoles: process.env.NEXT_PUBLIC_GID_ROLES || '0',
    sensorDataLog: process.env.NEXT_PUBLIC_GID_SENSORS || '0',
  },
};

// Build CSV export URLs
export function buildCsvUrl(gid: string): string {
  const base = `https://docs.google.com/spreadsheets/d/${SHEETS_CONFIG.sheetId}/export`;
  return `${base}?format=csv&gid=${gid}`;
}

// Parse CSV text to array of objects
export function parseCsv(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  // Strip surrounding quotes, then trim: handles ` " value " ` correctly.
  const cleanCell = (cell: string) => cell.trim().replace(/^"|"$/g, '').trim();

  const headers = lines[0].split(',').map(cleanCell);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(cleanCell);
    if (values.length === headers.length) {
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      rows.push(row);
    }
  }
  return rows;
}

// Fetch and parse a CSV tab
async function fetchSheetTab(gid: string): Promise<Record<string, string>[]> {
  try {
    const url = buildCsvUrl(gid);
    const response = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Accept': 'text/csv',
      }
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch sheet tab ${gid}: ${response.status}`);
      return [];
    }
    
    const text = await response.text();
    return parseCsv(text);
  } catch (error) {
    console.error(`Error fetching sheet tab ${gid}:`, error);
    return [];
  }
}

// Transform raw sheet data to typed structures
export async function fetchImpactMetrics(): Promise<ImpactMetrics> {
  const data = await fetchSheetTab(SHEETS_CONFIG.tabs.impactDashboard);
  
  if (data.length === 0) {
    // Return mock data for development
    return getMockImpactMetrics();
  }
  
  // Expecting a single row with these columns
  const row = data[0];
  return {
    capsCollected: parseInt(row['Caps Collected'] || row['caps_collected'] || '0'),
    weightKg: parseFloat(row['Weight (kg)'] || row['weight_kg'] || '0'),
    co2eAvoided: parseFloat(row['CO2e Avoided (kg)'] || row['co2e_avoided'] || '0'),
    productsMade: parseInt(row['Products Made'] || row['products_made'] || '0'),
    revenue: parseFloat(row['Revenue ($)'] || row['revenue'] || '0'),
    studentsEngaged: parseInt(row['Students Engaged'] || row['students_engaged'] || '0'),
    lastUpdated: row['Last Updated'] || row['last_updated'] || new Date().toISOString(),
  };
}

export async function fetchCollectionTrend(): Promise<CollectionDataPoint[]> {
  const data = await fetchSheetTab(SHEETS_CONFIG.tabs.collectionTracker);
  
  if (data.length === 0) {
    return getMockCollectionTrend();
  }
  
  return data
    .filter(row => row['Date'] && row['Count'])
    .map(row => ({
      date: row['Date'],
      count: parseInt(row['Count'] || '0'),
      weightKg: parseFloat(row['Weight (kg)'] || row['Weight_kg'] || '0'),
      location: row['Location'] || 'Unknown',
    }))
    .slice(-52); // Last 52 weeks
}

export async function fetchProductMix(): Promise<ProductData[]> {
  const data = await fetchSheetTab(SHEETS_CONFIG.tabs.productInventory);
  
  if (data.length === 0) {
    return getMockProductMix();
  }
  
  return data
    .filter(row => row['SKU'] && row['Product'])
    .map(row => ({
      sku: row['SKU'],
      name: row['Product'],
      quantityMade: parseInt(row['Qty Made'] || row['Quantity Made'] || '0'),
      quantitySold: parseInt(row['Qty Sold'] || row['Quantity Sold'] || '0'),
      price: parseFloat(row['Price'] || '0'),
      revenue: parseFloat(row['Revenue'] || '0'),
      materialCost: parseFloat(row['Material Cost'] || row['Material_Cost'] || '0'),
      margin: parseFloat(row['Margin'] || '0'),
    }));
}

export async function fetchLeaderboard(): Promise<StudentLeaderboardEntry[]> {
  const data = await fetchSheetTab(SHEETS_CONFIG.tabs.studentRoles);
  
  if (data.length === 0) {
    return getMockLeaderboard();
  }
  
  return data
    .filter(row => row['Student Name'] || row['Name'])
    .map(row => ({
      name: row['Student Name'] || row['Name'] || 'Anonymous',
      grade: row['Grade'] || 'N/A',
      role: row['Role'] || row['Roles'] || 'Member',
      hours: parseFloat(row['Hours Logged'] || row['Hours'] || '0'),
      capsCollected: parseInt(row['Caps Collected'] || row['Caps_Collected'] || '0'),
    }))
    .sort((a, b) => b.capsCollected - a.capsCollected)
    .slice(0, 10);
}

export async function fetchSensorData(): Promise<SensorDataPoint[]> {
  const data = await fetchSheetTab(SHEETS_CONFIG.tabs.sensorDataLog);
  
  if (data.length === 0) {
    return getMockSensorData();
  }
  
  return data
    .filter(row => row['Timestamp'] && row['Bin ID'])
    .map(row => ({
      timestamp: row['Timestamp'],
      binId: row['Bin ID'],
      count: parseInt(row['Count'] || '0'),
      fillPercent: parseFloat(row['Fill %'] || row['Fill_Percent'] || '0'),
      temperature: parseFloat(row['Temperature'] || '22'),
      status: row['Status'] || 'OK',
    }))
    .slice(-100);
}

// Fetch all dashboard data in parallel
export async function fetchDashboardData(): Promise<DashboardData> {
  const [impact, collectionTrend, productMix, leaderboard, sensorData] = await Promise.all([
    fetchImpactMetrics(),
    fetchCollectionTrend(),
    fetchProductMix(),
    fetchLeaderboard(),
    fetchSensorData(),
  ]);
  
  return {
    impact,
    collectionTrend,
    productMix,
    leaderboard,
    sensorData,
  };
}

// Mock data for development/testing
function getMockImpactMetrics(): ImpactMetrics {
  return {
    capsCollected: 12450,
    weightKg: 43.6,
    co2eAvoided: 65.4,
    productsMade: 312,
    revenue: 2847.50,
    studentsEngaged: 87,
    lastUpdated: new Date().toISOString(),
  };
}

function getMockCollectionTrend(): CollectionDataPoint[] {
  const now = new Date();
  const data: CollectionDataPoint[] = [];
  
  for (let i = 20; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i * 7);
    const baseCount = 400 + Math.random() * 300;
    const seasonalBoost = Math.sin((now.getMonth() - i * 0.25) * Math.PI / 6) * 100;
    
    data.push({
      date: date.toISOString().split('T')[0],
      count: Math.round(baseCount + seasonalBoost + Math.random() * 100),
      weightKg: Math.round((baseCount + seasonalBoost) * 0.0035 * 10) / 10,
      location: 'School Campus',
    });
  }
  
  return data;
}

function getMockProductMix(): ProductData[] {
  return [
    { sku: 'COASTER-4PK', name: 'Coaster Set (4)', quantityMade: 85, quantitySold: 62, price: 12, revenue: 744, materialCost: 1.20, margin: 70 },
    { sku: 'ORGANIZER-1', name: 'Desk Organizer', quantityMade: 42, quantitySold: 28, price: 18, revenue: 504, materialCost: 2.80, margin: 65 },
    { sku: 'KEYCHAIN-1', name: 'Keychain', quantityMade: 120, quantitySold: 95, price: 4, revenue: 380, materialCost: 0.60, margin: 80 },
    { sku: 'TILE-12', name: 'Outdoor Tile 12"', quantityMade: 15, quantitySold: 8, price: 25, revenue: 200, materialCost: 4.50, margin: 60 },
    { sku: 'POT-SEED', name: 'Seedling Pot', quantityMade: 50, quantitySold: 35, price: 6, revenue: 210, materialCost: 0.90, margin: 75 },
  ];
}

function getMockLeaderboard(): StudentLeaderboardEntry[] {
  return [
    { name: 'Alex Chen', grade: '11', role: 'Data Analyst', hours: 42, capsCollected: 2340 },
    { name: 'Maria Rodriguez', grade: '10', role: 'Collection Captain', hours: 38, capsCollected: 1980 },
    { name: 'James Kim', grade: '9', role: 'Press Operator', hours: 35, capsCollected: 1650 },
    { name: 'Priya Patel', grade: '11', role: 'Design Engineer', hours: 40, capsCollected: 1520 },
    { name: 'Sam Thompson', grade: '8', role: 'Shredder Operator', hours: 28, capsCollected: 1200 },
    { name: 'Emma Wilson', grade: '7', role: 'Wash Station Lead', hours: 25, capsCollected: 980 },
    { name: 'Carlos Mendez', grade: '10', role: 'Business Manager', hours: 30, capsCollected: 870 },
    { name: 'Aisha Johnson', grade: '9', role: 'Quality Control', hours: 22, capsCollected: 760 },
  ];
}

function getMockSensorData(): SensorDataPoint[] {
  const now = new Date();
  const data: SensorDataPoint[] = [];
  
  for (let i = 0; i < 50; i++) {
    const timestamp = new Date(now);
    timestamp.setHours(timestamp.getHours() - i * 2);
    
    data.push({
      timestamp: timestamp.toISOString(),
      binId: ['CAFE-01', 'GYM-02', 'LIB-01', 'ENT-01'][Math.floor(Math.random() * 4)],
      count: Math.floor(Math.random() * 50) + 10,
      fillPercent: Math.floor(Math.random() * 80) + 10,
      temperature: 20 + Math.random() * 5,
      status: Math.random() > 0.95 ? 'ALERT' : 'OK',
    });
  }
  
  return data;
}