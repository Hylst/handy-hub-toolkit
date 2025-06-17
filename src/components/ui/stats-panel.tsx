
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';

interface StatItem {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

interface StatsPanelProps {
  title?: string;
  stats: StatItem[];
  layout?: 'grid' | 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantClasses = {
  default: 'bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-400',
  primary: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300',
  success: 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-300',
  warning: 'bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-300',
  error: 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-300',
};

const trendClasses = {
  positive: 'text-green-600 dark:text-green-400',
  negative: 'text-red-600 dark:text-red-400',
  neutral: 'text-gray-600 dark:text-gray-400',
};

export const StatsPanel: React.FC<StatsPanelProps> = ({
  title,
  stats,
  layout = 'grid',
  size = 'md',
  className,
}) => {
  const layoutClasses = {
    grid: `grid grid-cols-1 ${stats.length > 1 ? 'sm:grid-cols-2' : ''} ${stats.length > 2 ? 'lg:grid-cols-3' : ''} gap-3`,
    horizontal: 'flex flex-wrap gap-3',
    vertical: 'flex flex-col gap-3',
  };

  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };

  const StatCard: React.FC<{ stat: StatItem; index: number }> = ({ stat, index }) => (
    <div
      key={index}
      className={cn(
        'text-center rounded-lg',
        sizeClasses[size],
        variantClasses[stat.variant || 'default']
      )}
    >
      <div className="flex flex-col items-center gap-1">
        {stat.icon && (
          <div className="text-lg">
            {stat.icon}
          </div>
        )}
        <div className="text-lg font-bold">
          {stat.value}
        </div>
        <Text size="xs" className="opacity-80">
          {stat.label}
        </Text>
        {stat.trend && (
          <Badge
            variant="outline"
            className={cn('text-xs', trendClasses[stat.trend.type])}
          >
            {stat.trend.value}
          </Badge>
        )}
      </div>
    </div>
  );

  if (!title) {
    return (
      <div className={cn(layoutClasses[layout], className)}>
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} index={index} />
        ))}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className={layoutClasses[layout]}>
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
