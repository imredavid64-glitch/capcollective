'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StudentLeaderboardEntry } from '@/types';
import { formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Trophy, Medal, Award } from 'lucide-react';

const RANK_ICONS = {
  1: Trophy,
  2: Medal,
  3: Award,
};

const RANK_COLORS = {
  1: 'text-yellow-500',
  2: 'text-gray-400',
  3: 'text-orange-600',
};

interface LeaderboardProps {
  data: StudentLeaderboardEntry[];
  title?: string;
  description?: string;
  maxEntries?: number;
  showHours?: boolean;
  compact?: boolean;
}

export function Leaderboard({ 
  data, 
  title = 'Student Leaderboard', 
  description,
  maxEntries = 10,
  showHours = true,
  compact = false,
}: LeaderboardProps) {
  const displayData = data.slice(0, maxEntries);
  
  if (!displayData.length) {
    return (
      <Card variant="outlined" padding={compact ? 'sm' : 'md'}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-gray-400">
            No leaderboard data available
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card variant="outlined" padding={compact ? 'sm' : 'md'}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </CardHeader>
      <CardContent className={compact ? 'p-0' : ''}>
        <div className="space-y-1">
          {displayData.map((student, index) => {
            const rank = index + 1;
            const RankIcon = RANK_ICONS[rank as keyof typeof RANK_ICONS];
            const rankColor = RANK_COLORS[rank as keyof typeof RANK_COLORS] || 'text-gray-400';
            
            return (
              <div
                key={student.name}
                className={cn(
                  'flex items-center gap-3 px-2 py-2 rounded-lg transition-colors',
                  rank <= 3 ? 'bg-yellow-50' : 'hover:bg-gray-50',
                  compact && 'px-3 py-1.5'
                )}
              >
                {/* Rank */}
                <div className={cn('w-8 flex items-center justify-center font-bold', rankColor)}>
                  {rank <= 3 && RankIcon ? (
                    <RankIcon className="w-5 h-5" />
                  ) : (
                    <span className="text-gray-500">#{rank}</span>
                  )}
                </div>
                
                {/* Student info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn('font-medium truncate', rank <= 3 ? 'text-gray-900' : 'text-gray-700')}>
                      {student.name}
                    </span>
                    <Badge variant="outline" size="sm" className="text-xs">
                      {student.grade}
                    </Badge>
                  </div>
                  {showHours && !compact && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Badge variant="outline" size="sm" className="gap-1">
                        {student.role}
                      </Badge>
                      <span>{student.hours}h logged</span>
                    </div>
                  )}
                </div>
                
                {/* Caps collected */}
                <div className="text-right">
                  <div className={cn('font-bold', rank <= 3 ? 'text-gray-900' : 'text-gray-700')}>
                    {formatNumber(student.capsCollected)}
                  </div>
                  <div className="text-xs text-gray-400">caps</div>
                </div>
              </div>
            );
          })}
        </div>
        
        {data.length > maxEntries && !compact && (
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <span className="text-sm text-gray-500">
              +{data.length - maxEntries} more students engaged
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Compact version for sidebar/widget
export function CompactLeaderboard({ data, title = 'Top Collectors', maxEntries = 5 }: LeaderboardProps) {
  return <Leaderboard data={data} title={title} maxEntries={maxEntries} compact showHours={false} />;
}