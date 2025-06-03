
import React from 'react';
import { cn } from '@/lib/utils';
import { layoutUtilities } from '@/lib/design-system';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'responsive' | 'auto' | 'equal';
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Grid: React.FC<GridProps> = ({
  variant = 'responsive',
  columns,
  gap = 'md',
  className,
  children,
  ...props
}) => {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4 md:gap-6',
    lg: 'gap-6 md:gap-8',
  };

  // Custom columns override
  const customGridClasses = columns ? 
    `grid ${Object.entries(columns).map(([breakpoint, cols]) => 
      breakpoint === 'default' ? `grid-cols-${cols}` : `${breakpoint}:grid-cols-${cols}`
    ).join(' ')}` : 
    layoutUtilities.grid[variant];

  return (
    <div
      className={cn(
        columns ? customGridClasses : layoutUtilities.grid[variant],
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
