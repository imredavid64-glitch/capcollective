import { Suspense } from 'react';
import { 
  ImpactStatCards, 
  CollectionChart, 
  ProductMixChart, 
  Leaderboard, 
  SensorStatus,
  ImplementationKit
} from '@/components/dashboard';
import { 
  StatCardSkeleton, 
  ChartSkeleton, 
  LeaderboardSkeleton, 
  SensorStatusSkeleton 
} from '@/components/dashboard/Skeletons';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { fetchDashboardData } from '@/lib/data';
import { formatRelativeTime } from '@/lib/utils';
import { 
  ArrowUpRight, 
  Download, 
  RefreshCw, 
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering to avoid static generation issues with client components
export const dynamic = 'force-dynamic';

async function getDashboardData() {
  return fetchDashboardData();
}

// Client component that renders the dashboard with data
async function DashboardContent({ data }: { data: Awaited<ReturnType<typeof fetchDashboardData>> }) {
  const lastUpdated = data.impact.lastUpdated;
  
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 tracking-tight">
              Live Impact Dashboard
            </h1>
            <p className="mt-2 text-lg text-gray-600 max-w-2xl">
              Real-time tracking of Cap Collective's circular economy program. 
              Students collect caps, process them into products, and measure environmental impact.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle2 className="h-4 w-4 text-cap-600" />
              <span>Last updated: {formatRelativeTime(lastUpdated)}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Button variant="primary" size="sm" onClick={() => window.location.href = '/impact'}>
                View Full Report
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Status badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="success" dot>Live Data Active</Badge>
          <Badge variant="outline">{data.sensorData.length} Sensor Readings</Badge>
          <Badge variant="outline">{data.collectionTrend.length} Weeks Tracked</Badge>
          <Badge variant="outline">{data.productMix.length} Product Lines</Badge>
          <Badge variant="outline">{data.leaderboard.length} Active Students</Badge>
        </div>
      </div>
      
      {/* Key Metrics */}
      <section aria-labelledby="metrics-heading" className="mb-8">
        <h2 id="metrics-heading" className="sr-only">Key Impact Metrics</h2>
        <ImpactStatCards data={data.impact} />
      </section>
      
      {/* Main Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <CollectionChart 
          data={data.collectionTrend} 
          metric="count"
          title="Weekly Cap Collection"
          description="Total caps collected per week across all school locations"
        />
        <CollectionChart 
          data={data.collectionTrend} 
          metric="weight"
          title="Weekly Weight Diverted"
          description="Total weight (kg) of HDPE/PP diverted from landfill per week"
        />
      </div>
      
      {/* Second Row - Product Mix & Sensor Status */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <ProductMixChart 
          data={data.productMix} 
          metric="revenue"
          title="Product Revenue Mix"
          description="Revenue breakdown by product line"
        />
        <SensorStatus 
          data={data.sensorData}
          title="Live Collection Bin Status"
          description="Real-time fill levels from ESP32 IR sensors on collection boxes"
        />
      </div>
      
      {/* Third Row - Leaderboard & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2">
          <Leaderboard 
            data={data.leaderboard}
            title="Top Student Collectors"
            description="Students ranked by caps collected this semester"
            maxEntries={10}
            showHours={true}
          />
        </div>
        
        <div className="space-y-4">
          {/* Quick Stats Cards */}
          <Card variant="outlined" padding="md">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Common tasks for program leads</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => window.location.href = '/collection/new'}>
                <span>+ Log Collection</span>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => window.location.href = '/products/new'}>
                <span>+ Add Product Batch</span>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => window.location.href = '/students/new'}>
                <span>+ Register Student</span>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => window.location.href = '/reports/generate'}>
                <Download className="h-4 w-4" />
                <span>Generate Report</span>
              </Button>
            </CardContent>
          </Card>
          
          {/* Program Status */}
          <Card variant="outlined" padding="md">
            <CardHeader>
              <CardTitle className="text-lg">Program Status</CardTitle>
              <CardDescription>Current operational state</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-cap-500" />
                  <span className="text-sm font-medium">Collection Active</span>
                </div>
                <Badge variant="success" size="sm">Running</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-earth-500" />
                  <span className="text-sm font-medium">Processing</span>
                </div>
                <Badge variant="success" size="sm">Running</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium">Eco-Store</span>
                </div>
                <Badge variant="success" size="sm">Open</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="text-sm font-medium">Sensor Network</span>
                </div>
                <Badge variant="warning" size="sm">
                  {data.sensorData.filter(s => s.status === 'OK').length}/{data.sensorData.length} Online
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          {/* Alerts */}
          {data.sensorData.some(s => s.status === 'ALERT') && (
            <Card variant="outlined" padding="md" className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.sensorData
                    .filter(s => s.status === 'ALERT')
                    .slice(0, 3)
                    .map((alert, i) => (
                      <div key={i} className="text-sm text-yellow-800 bg-yellow-100 p-2 rounded">
                        {alert.binId}: {alert.fillPercent}% full — needs collection
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Implementation Kit Progress Tracker */}
      <section aria-labelledby="implementation-kit-heading" className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 id="implementation-kit-heading" className="text-2xl font-display font-bold text-gray-900">
            Implementation Progress Tracker
          </h2>
          <Badge variant="outline" className="text-sm">
            <BookOpen className="h-3 w-3 mr-1" />
            Visual Kit — Local Progress Saved
          </Badge>
        </div>
        <ImplementationKit />
      </section>
      
      {/* Footer CTA */}
      <div className="bg-cap-600 rounded-2xl p-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">
            Want to bring Cap Collective to your school?
          </h2>
          <p className="text-cap-100 mb-6 max-w-xl mx-auto">
            Join 10+ schools worldwide turning bottle caps into student-led circular economies. 
            Get the complete implementation kit — free and open source.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto" onClick={() => window.location.href = '/get-started'}>
                Get the Kit
                <ArrowUpRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="ghost" className="w-full sm:w-auto border-white text-white hover:bg-white/10" onClick={() => window.open('https://github.com/capcollective', '_blank')}>
                <ExternalLink className="h-5 w-5" />
                View on GitHub
              </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const data = await getDashboardData();
  
  return (
    <>
      <section aria-label="Dashboard Overview">
        <Suspense fallback={
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
              {[...Array(6)].map((_, i) => <StatCardSkeleton key={i} />)}
            </div>
            <div className="grid gap-6 lg:grid-cols-2 mb-8">
              <ChartSkeleton title="Weekly Collection" />
              <ChartSkeleton title="Weekly Weight" />
            </div>
            <div className="grid gap-6 lg:grid-cols-2 mb-8">
              <ChartSkeleton title="Product Mix" />
              <SensorStatusSkeleton />
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <LeaderboardSkeleton />
              <ChartSkeleton title="Quick Actions" />
              <ChartSkeleton title="Program Status" />
            </div>
          </div>
        }>
          <DashboardContent data={data} />
        </Suspense>
      </section>
    </>
  );
}