
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { animations } from '@/lib/design-system';

interface InfoCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  variant?: 'default' | 'highlighted' | 'muted' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

const variantClasses = {
  default: 'border-border bg-card',
  highlighted: 'border-2 border-primary/20 bg-primary/5',
  muted: 'border-muted bg-muted/30',
  success: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
  warning: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950',
  error: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
};

const sizeClasses = {
  sm: 'p-3',
  md: 'p-4 lg:p-6',
  lg: 'p-6 lg:p-8',
};

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  icon,
  children,
  variant = 'default',
  size = 'md',
  interactive = false,
  onClick,
  className,
}) => {
  return (
    <Card
      className={cn(
        variantClasses[variant],
        interactive && [
          'cursor-pointer',
          animations.transitions.normal,
          animations.hover.lift,
          'hover:shadow-md',
        ],
        className
      )}
      onClick={onClick}
    >
      <CardHeader className={cn('pb-3', sizeClasses[size])}>
        <div className="flex items-start gap-3">
          {icon && (
            <div className="flex-shrink-0 text-2xl">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg lg:text-xl mb-1">
              {title}
            </CardTitle>
            {description && (
              <Text size="sm" color="muted">
                {description}
              </Text>
            )}
          </div>
        </div>
      </CardHeader>
      
      {children && (
        <CardContent className={cn('pt-0', sizeClasses[size])}>
          {children}
        </CardContent>
      )}
    </Card>
  );
};
