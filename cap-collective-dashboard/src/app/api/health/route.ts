import { NextResponse } from 'next/server';
import { fetchDashboardData } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const startTime = Date.now();
    const data = await fetchDashboardData();
    const latency = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      latencyMs: latency,
      dataFreshness: data.impact.lastUpdated,
      metrics: {
        capsCollected: data.impact.capsCollected,
        studentsEngaged: data.impact.studentsEngaged,
        sensorCount: data.sensorData.length,
        collectionWeeks: data.collectionTrend.length,
        productLines: data.productMix.length,
      },
      checks: {
        sheets: 'ok',
        dataFetch: 'ok',
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        checks: {
          sheets: 'failed',
          dataFetch: 'failed',
        },
      },
      { status: 503 }
    );
  }
}