'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProductData } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/utils';

const COLORS = [
  '#16a34a', // cap-600
  '#15803d', // cap-700
  '#dc7b24', // earth-500
  '#c45f1a', // earth-600
  '#7c3aed', // purple-600
  '#2563eb', // blue-600
  '#ea580c', // orange-600
  '#db2777', // pink-600
];

interface ProductMixChartProps {
  data: ProductData[];
  metric?: 'revenue' | 'quantitySold' | 'quantityMade' | 'margin';
  title?: string;
  description?: string;
}

export function ProductMixChart({ data, metric = 'revenue', title, description }: ProductMixChartProps) {
  if (!data.length) {
    return (
      <Card variant="outlined" padding="md">
        <CardHeader>
          <CardTitle>{title || 'Product Mix'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-400">
            No product data available
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const metricLabels = {
    revenue: 'Revenue',
    quantitySold: 'Units Sold',
    quantityMade: 'Units Made',
    margin: 'Margin %',
  };
  
  const metricFormatters = {
    revenue: (v: number) => formatCurrency(v),
    quantitySold: (v: number) => formatNumber(v),
    quantityMade: (v: number) => formatNumber(v),
    margin: (v: number) => `${v}%`,
  };
  
  const chartData = data.map((item, index) => ({
    name: item.name,
    value: item[metric],
    color: COLORS[index % COLORS.length],
    sku: item.sku,
    margin: item.margin,
    price: item.price,
  }));
  
  const total = chartData.reduce((sum, d) => sum + d.value, 0);
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 min-w-[180px]">
          <p className="font-medium text-gray-900">{item.name}</p>
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>{metricLabels[metric]}:</span>
            <span className="font-medium">{metricFormatters[metric](item.value)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Margin:</span>
            <span className="font-medium">{item.margin}%</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Price:</span>
            <span className="font-medium">{formatCurrency(item.price)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>% of Total:</span>
            <span className="font-medium">{total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%</span>
          </div>
        </div>
      );
    }
    return null;
  };
  
  const CustomLegend = ({ payload }: any) => (
    <div className="flex flex-wrap gap-2 justify-center mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={entry.id} className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
  
  return (
    <Card variant="outlined" padding="md" className="h-full">
      <CardHeader>
        <CardTitle>{title || `Product Mix by ${metricLabels[metric]}`}</CardTitle>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="h-72 flex flex-col">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Custom Legend */}
          <CustomLegend payload={chartData} />
        </div>
        
        {/* Top products summary */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Top Products</h4>
          <div className="space-y-2">
            {chartData
              .sort((a, b) => b.value - a.value)
              .slice(0, 3)
              .map((item, index) => (
                <div key={item.sku} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{index + 1}.</span>
                    <span className="font-medium text-gray-900">{item.name}</span>
                    <Badge variant="outline" size="sm">{metricFormatters[metric](item.value)}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-gray-500">
                    <span>{formatCurrency(item.price)} each</span>
                    <Badge variant="success" size="sm">{item.margin}% margin</Badge>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}