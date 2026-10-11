'use client';

import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CollectionDataPoint } from '@/types';
import { formatDate, formatNumber } from '@/lib/utils';

interface CollectionChartProps {
  data: CollectionDataPoint[];
  metric?: 'count' | 'weight';
  title?: string;
  description?: string;
}

export function CollectionChart({ data, metric = 'count', title, description }: CollectionChartProps) {
  if (!data.length) {
    return (
      <Card variant="outlined" padding="md">
        <CardHeader>
          <CardTitle>{title || 'Collection Trend'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-400">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const formattedData = data.map(d => ({
    date: formatDate(d.date),
    count: d.count,
    weight: d.weightKg,
    rawDate: d.date,
  }));
  
  const yKey = metric === 'count' ? 'count' : 'weight';
  const yLabel = metric === 'count' ? 'Caps Collected' : 'Weight (kg)';
  const color = metric === 'count' ? '#16a34a' : '#dc7b24';
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="font-medium text-gray-900">{formatDate(item.rawDate)}</p>
          <p className="text-sm text-gray-600">
            {metric === 'count' ? formatNumber(item.count) : item.weight.toFixed(1)} {metric === 'count' ? 'caps' : 'kg'}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card variant="outlined" padding="md" className="h-full">
      <CardHeader>
        <CardTitle>{title || `Weekly ${yLabel}`}</CardTitle>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => metric === 'count' ? formatNumber(value) : value.toFixed(1)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={yKey}
                stroke={color}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#gradient-${metric})`}
              />
              <Line
                type="monotone"
                dataKey={yKey}
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 2, stroke: color, fill: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(formattedData.reduce((sum, d) => sum + d[yKey], 0))}
            </p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(Math.round(formattedData.reduce((sum, d) => sum + d[yKey], 0) / formattedData.length))}
            </p>
            <p className="text-xs text-gray-500">Weekly Avg</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(Math.max(...formattedData.map(d => d[yKey])))}
            </p>
            <p className="text-xs text-gray-500">Peak Week</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}