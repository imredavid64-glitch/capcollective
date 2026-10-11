export interface ImpactMetrics {
  capsCollected: number;
  weightKg: number;
  co2eAvoided: number;
  productsMade: number;
  revenue: number;
  studentsEngaged: number;
  lastUpdated: string;
}

export interface CollectionDataPoint {
  date: string;
  count: number;
  weightKg: number;
  location: string;
}

export interface ProductData {
  sku: string;
  name: string;
  quantityMade: number;
  quantitySold: number;
  price: number;
  revenue: number;
  materialCost: number;
  margin: number;
}

export interface StudentLeaderboardEntry {
  name: string;
  grade: string;
  role: string;
  hours: number;
  capsCollected: number;
}

export interface SensorDataPoint {
  timestamp: string;
  binId: string;
  count: number;
  fillPercent: number;
  temperature: number;
  status: string;
}

export interface DashboardData {
  impact: ImpactMetrics;
  collectionTrend: CollectionDataPoint[];
  productMix: ProductData[];
  leaderboard: StudentLeaderboardEntry[];
  sensorData: SensorDataPoint[];
}