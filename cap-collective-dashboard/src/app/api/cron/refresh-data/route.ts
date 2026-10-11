import { NextResponse } from 'next/server';
import { fetchDashboardData } from '@/lib/data';

// This endpoint is called by Vercel Cron every 15 minutes
// It warms up the data cache and can trigger revalidation
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const startTime = Date.now();
    const data = await fetchDashboardData();
    const latency = Date.now() - startTime;
    
    // Check for alerts
    const alerts = data.sensorData
      .filter(s => s.status === 'ALERT' || s.fillPercent >= 90)
      .map(s => ({
        binId: s.binId,
        fillPercent: s.fillPercent,
        status: s.status,
        timestamp: s.timestamp,
      }));
    
    // Check if data is stale (older than 2 hours)
    const lastUpdated = new Date(data.impact.lastUpdated);
    const isStale = Date.now() - lastUpdated.getTime() > 2 * 60 * 60 * 1000;
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      latencyMs: latency,
      dataFreshness: data.impact.lastUpdated,
      isStale,
      alerts: alerts.length > 0 ? alerts : undefined,
      summary: {
        capsCollected: data.impact.capsCollected,
        weightKg: data.impact.weightKg,
        revenue: data.impact.revenue,
        studentsEngaged: data.impact.studentsEngaged,
        activeBins: data.sensorData.length,
        binsNeedingAttention: alerts.length,
      },
    });
  } catch (error) {
    console.error('Cron refresh failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}