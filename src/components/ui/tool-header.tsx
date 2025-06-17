
import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface ToolHeaderProps {
  title: string;
  subtitle?: string;
  description: string;
  icon: React.ReactNode;
  badges?: string[];
  gradient?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal';
  className?: string;
}

const gradientVariants = {
  blue: 'bg-gradient-to-br from-blue-50 via-blue-50 to-cyan-50 dark:from-blue-950/50 dark:via-blue-950/50 dark:to-cyan-950/50 border-blue-200 dark:border-blue-800',
  green: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/50 dark:via-teal-950/50 dark:to-cyan-950/50 border-emerald-200 dark:border-emerald-800',
  purple: 'bg-gradient-to-br from-purple-50 via-purple-50 to-violet-50 dark:from-purple-950/50 dark:via-purple-950/50 dark:to-violet-950/50 border-purple-200 dark:border-purple-800',
  orange: 'bg-gradient-to-br from-orange-50 via-orange-50 to-amber-50 dark:from-orange-950/50 dark:via-orange-950/50 dark:to-amber-950/50 border-orange-200 dark:border-orange-800',
  red: 'bg-gradient-to-br from-red-50 via-red-50 to-pink-50 dark:from-red-950/50 dark:via-red-950/50 dark:to-pink-950/50 border-red-200 dark:border-red-800',
  teal: 'bg-gradient-to-br from-teal-50 via-teal-50 to-cyan-50 dark:from-teal-950/50 dark:via-teal-950/50 dark:to-cyan-950/50 border-teal-200 dark:border-teal-800',
};

export const ToolHeader: React.FC<ToolHeaderProps> = ({
  title,
  subtitle,
  description,
  icon,
  badges = [],
  gradient = 'blue',
  className,
}) => {
  return (
    <Card className={cn(
      'border-2 shadow-lg',
      gradientVariants[gradient],
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex justify-center sm:justify-start">
            <div className={cn(
              'p-3 lg:p-4 rounded-2xl shadow-lg animate-pulse',
              gradient === 'blue' && 'bg-gradient-to-r from-blue-500 to-cyan-500',
              gradient === 'green' && 'bg-gradient-to-r from-emerald-500 to-teal-500',
              gradient === 'purple' && 'bg-gradient-to-r from-purple-500 to-violet-500',
              gradient === 'orange' && 'bg-gradient-to-r from-orange-500 to-amber-500',
              gradient === 'red' && 'bg-gradient-to-r from-red-500 to-pink-500',
              gradient === 'teal' && 'bg-gradient-to-r from-teal-500 to-cyan-500',
            )}>
              <div className="w-8 h-8 lg:w-10 lg:h-10 text-white flex items-center justify-center">
                {icon}
              </div>
            </div>
          </div>
          <div className="text-center sm:text-left flex-1">
            <Heading level={1} size="3xl" className="mb-2" gradient>
              {title}
            </Heading>
            {subtitle && (
              <Text size="lg" color="muted" className="mb-2">
                {subtitle}
              </Text>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Text size="lg" color="muted" className="mb-4 leading-relaxed text-center sm:text-left">
          {description}
        </Text>
        
        {badges.length > 0 && (
          <div className="flex justify-center sm:justify-start gap-2 flex-wrap">
            {badges.map((badge, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-3 py-2">
                {badge}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
