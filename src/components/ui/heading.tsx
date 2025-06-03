
import React from 'react';
import { cn } from '@/lib/utils';
import { designSystem } from '@/lib/design-system';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  children: React.ReactNode;
  gradient?: boolean;
}

export const Heading: React.FC<HeadingProps> = ({
  level,
  size,
  weight = 'semibold',
  gradient = false,
  className,
  children,
  ...props
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  // Default sizes for each heading level if not specified
  const defaultSizes = {
    1: '4xl',
    2: '3xl',
    3: '2xl',
    4: 'xl',
    5: 'lg',
    6: 'base',
  } as const;

  const finalSize = size || defaultSizes[level];
  
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  return (
    <Tag
      className={cn(
        sizeClasses[finalSize],
        weightClasses[weight],
        gradient && 'bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent',
        'leading-tight tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};
