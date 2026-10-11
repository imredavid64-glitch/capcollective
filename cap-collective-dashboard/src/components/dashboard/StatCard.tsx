'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatNumber, formatCurrency, formatWeight, calculatePercentageChange, getProgressPercentage, TARGETS, cn } from '@/lib/utils';
import { 
  Recycle, 
  Scale, 
  Leaf, 
  Package, 
  DollarSign, 
  Users, 
  TrendingUp,
  Target 
} from 'lucide-react';
import { ImpactMetrics } from '@/types';

interface StatCardProps {
  metric: keyof ImpactMetrics;
  value: number;
  label: string;
  icon: React.ReactNode;
  target?: number;
  previousValue?: number;
  color: 'cap' | 'earth' | 'blue' | 'purple' | 'orange' | 'red' | 'green';
  unit?: 'number' | 'weight' | 'currency' | 'percent';
  trend?: 'up' | 'down' | 'neutral';
}

const colorClasses = {
  cap: 'text-cap-600 bg-cap-100',
  earth: 'text-earth-600 bg-earth-100',
  blue: 'text-blue-600 bg-blue-100',
  purple: 'text-purple-600 bg-purple-100',
  orange: 'text-orange-600 bg-orange-100',
  red: 'text-red-600 bg-red-100',
  green: 'text-green-600 bg-green-100',
};

const iconBgClasses = {
  cap: 'bg-cap-100 text-cap-600',
  earth: 'bg-earth-100 text-earth-600',
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
  red: 'bg-red-100 text-red-600',
  green: 'bg-green-100 text-green-600',
};

export function StatCard({ 
  metric, 
  value, 
  label, 
  icon, 
  target, 
  previousValue, 
  color, 
  unit = 'number',
}: StatCardProps) {
  const progress = target ? getProgressPercentage(value, target) : undefined;
  const change = previousValue !== undefined ? calculatePercentageChange(value, previousValue) : undefined;
  
  const formatValue = () => {
    switch (unit) {
      case 'weight': return formatWeight(value);
      case 'currency': return formatCurrency(value);
      case 'percent': return `${value}%`;
      default: return formatNumber(value);
    }
  };
  
  const trend = change !== undefined && change >= 0 ? 'up' : change !== undefined && change < 0 ? 'down' : 'neutral';
  
  return (
    <Card variant="outlined" padding="md">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className={cn('p-2 rounded-lg', iconBgClasses[color])}>
              {icon}
            </div>
            <span className="text-sm font-medium text-gray-500 truncate">{label}</span>
          </div>
          
          <div className="flex items-baseline gap-2 mb-3">
            <span className={cn('text-3xl font-bold text-gray-900', colorClasses[color].replace('text-', '').replace('bg-', 'text-'))}>
              {formatValue()}
            </span>
            {change !== undefined && (
              <Badge 
                variant={change >= 0 ? 'success' : 'danger'} 
                size="sm"
                className="whitespace-nowrap flex items-center gap-1"
              >
                {trend === 'up' && <TrendingUp className="w-3 h-3" />}
                {trend === 'down' && <TrendingUp className="w-3 h-3 rotate-180" />}
                {Math.abs(change).toFixed(1)}%
              </Badge>
            )}
          </div>
          
          {progress !== undefined && (
            <div>
              <ProgressBar 
                value={value} 
                max={target} 
                variant={progress >= 100 ? 'success' : progress >= 75 ? 'default' : 'warning'}
                size="sm"
                showLabel={false}
              />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Target: {target ? (unit === 'currency' ? formatCurrency(target) : unit === 'weight' ? formatWeight(target) : formatNumber(target)) : '—'}</span>
                <span>{progress}% complete</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// Pre-configured stat cards for the impact metrics
export function ImpactStatCards({ data, previousData }: { data: ImpactMetrics; previousData?: ImpactMetrics }) {
  const cards = [
    {
      metric: 'capsCollected' as keyof ImpactMetrics,
      value: data.capsCollected,
      label: 'Caps Collected',
      icon: <Recycle className="w-5 h-5" />,
      target: TARGETS.capsCollected,
      previousValue: previousData?.capsCollected,
      color: 'cap' as const,
      unit: 'number' as const,
    },
    {
      metric: 'weightKg' as keyof ImpactMetrics,
      value: data.weightKg,
      label: 'Waste Diverted',
      icon: <Scale className="w-5 h-5" />,
      target: TARGETS.weightKg,
      previousValue: previousData?.weightKg,
      color: 'earth' as const,
      unit: 'weight' as const,
    },
    {
      metric: 'co2eAvoided' as keyof ImpactMetrics,
      value: data.co2eAvoided,
      label: 'CO₂e Avoided',
      icon: <Leaf className="w-5 h-5" />,
      target: TARGETS.co2eAvoided,
      previousValue: previousData?.co2eAvoided,
      color: 'green' as const,
      unit: 'weight' as const,
    },
    {
      metric: 'productsMade' as keyof ImpactMetrics,
      value: data.productsMade,
      label: 'Products Made',
      icon: <Package className="w-5 h-5" />,
      target: TARGETS.productsMade,
      previousValue: previousData?.productsMade,
      color: 'purple' as const,
      unit: 'number' as const,
    },
    {
      metric: 'revenue' as keyof ImpactMetrics,
      value: data.revenue,
      label: 'Revenue Generated',
      icon: <DollarSign className="w-5 h-5" />,
      target: TARGETS.revenue,
      previousValue: previousData?.revenue,
      color: 'orange' as const,
      unit: 'currency' as const,
    },
    {
      metric: 'studentsEngaged' as keyof ImpactMetrics,
      value: data.studentsEngaged,
      label: 'Students Engaged',
      icon: <Users className="w-5 h-5" />,
      target: TARGETS.studentsEngaged,
      previousValue: previousData?.studentsEngaged,
      color: 'blue' as const,
      unit: 'percent' as const,
    },
  ];
  
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card, index) => (
        <StatCard key={card.metric} {...card} />
      ))}
    </div>
  );
}