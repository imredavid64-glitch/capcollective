'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SensorDataPoint } from '@/types';
import { formatRelativeTime, cn } from '@/lib/utils';
import { Wifi, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

interface SensorStatusProps {
  data: SensorDataPoint[];
  title?: string;
  description?: string;
  maxBins?: number;
}

export function SensorStatus({ data, title = 'Live Collection Bins', description, maxBins = 8 }: SensorStatusProps) {
  // Group by binId and get latest reading for each
  const latestByBin = new Map<string, SensorDataPoint>();
  
  data.forEach(reading => {
    const existing = latestByBin.get(reading.binId);
    if (!existing || new Date(reading.timestamp) > new Date(existing.timestamp)) {
      latestByBin.set(reading.binId, reading);
    }
  });
  
  const bins = Array.from(latestByBin.values())
    .sort((a, b) => b.fillPercent - a.fillPercent)
    .slice(0, maxBins);
  
  if (!bins.length) {
    return (
      <Card variant="outlined" padding="md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-gray-400">
            <div className="text-center">
              <Wifi className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No sensor data available</p>
              <p className="text-sm">Connect ESP32 sensors to see live bin status</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const totalCaps = bins.reduce((sum, b) => sum + b.count, 0);
  const binsNeedingAttention = bins.filter(b => b.fillPercent >= 80 || b.status === 'ALERT').length;
  const onlineBins = bins.filter(b => b.status === 'OK').length;
  
  return (
    <Card variant="outlined" padding="md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Badge variant="success" dot size="sm">
              {onlineBins} Online
            </Badge>
            {binsNeedingAttention > 0 && (
              <Badge variant="warning" dot size="sm">
                {binsNeedingAttention} Need Attention
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-cap-50 rounded-lg">
            <p className="text-2xl font-bold text-cap-600">{formatRelativeTime(totalCaps.toString())}</p>
            <p className="text-xs text-gray-500">Total Caps (All Bins)</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{bins.length}</p>
            <p className="text-xs text-gray-500">Active Bins</p>
          </div>
          <div className="text-center p-3 bg-earth-50 rounded-lg">
            <p className="text-2xl font-bold text-earth-600">
              {bins.length > 0 ? Math.round(bins.reduce((s, b) => s + b.fillPercent, 0) / bins.length) : 0}%
            </p>
            <p className="text-xs text-gray-500">Avg Fill Level</p>
          </div>
        </div>
        
        {/* Bin cards */}
        <div className="space-y-3">
          {bins.map((bin) => {
            const isAlert = bin.status === 'ALERT' || bin.fillPercent >= 90;
            const isWarning = bin.fillPercent >= 70 && !isAlert;
            
            return (
              <div
                key={bin.binId}
                className={cn(
                  'flex items-center gap-4 p-3 rounded-lg border transition-colors',
                  isAlert ? 'border-red-200 bg-red-50' : 
                  isWarning ? 'border-yellow-200 bg-yellow-50' :
                  'border-gray-100 bg-white hover:bg-gray-50'
                )}
              >
                {/* Bin icon & status */}
                <div className={cn('p-2 rounded-lg', isAlert ? 'bg-red-100' : isWarning ? 'bg-yellow-100' : 'bg-cap-100')}>
                  {isAlert ? (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  ) : isWarning ? (
                    <Trash2 className="w-5 h-5 text-yellow-600" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-cap-600" />
                  )}
                </div>
                
                {/* Bin info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 truncate">{bin.binId}</span>
                    <Badge 
                      variant={isAlert ? 'danger' : isWarning ? 'warning' : 'success'} 
                      size="sm"
                    >
                      {bin.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{bin.count} caps collected</span>
                    <span>•</span>
                    <span>{formatRelativeTime(bin.timestamp)}</span>
                    {bin.temperature && (
                      <>
                        <span>•</span>
                        <span>{bin.temperature.toFixed(1)}°C</span>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Fill progress */}
                <div className="w-40">
                  <ProgressBar 
                    value={bin.fillPercent} 
                    max={100} 
                    variant={isAlert ? 'danger' : isWarning ? 'warning' : 'success'}
                    size="sm"
                    showLabel={true}
                    label={`${bin.fillPercent}% full`}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Last updated */}
        <div className="mt-4 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
          Last updated: {bins.length > 0 ? formatRelativeTime(bins[0].timestamp) : 'Never'}
        </div>
      </CardContent>
    </Card>
  );
}