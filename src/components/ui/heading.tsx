
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

  const commonProps = {
    className: cn(
      sizeClasses[finalSize],
      weightClasses[weight],
      gradient && 'bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent',
      'leading-tight tracking-tight',
      className
    ),
    ...props,
  };

  // Use explicit conditional rendering to ensure proper typing
  switch (level) {
    case 1:
      return <h1 {...commonProps}>{children}</h1>;
    case 2:
      return <h2 {...commonProps}>{children}</h2>;
    case 3:
      return <h3 {...commonProps}>{children}</h3>;
    case 4:
      return <h4 {...commonProps}>{children}</h4>;
    case 5:
      return <h5 {...commonProps}>{children}</h5>;
    case 6:
      return <h6 {...commonProps}>{children}</h6>;
    default:
      return <h1 {...commonProps}>{children}</h1>;
  }
};
