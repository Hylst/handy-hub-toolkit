
import React from 'react';
import { cn } from '@/lib/utils';

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'accent' | 'destructive';
  children: React.ReactNode;
  as?: 'p' | 'span' | 'div';
}

export const Text: React.FC<TextProps> = ({
  size = 'base',
  weight = 'normal',
  color = 'default',
  as: Tag = 'p',
  className,
  children,
  ...props
}) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const colorClasses = {
    default: 'text-foreground',
    muted: 'text-muted-foreground',
    accent: 'text-accent-foreground',
    destructive: 'text-destructive',
  };

  return (
    <Tag
      className={cn(
        sizeClasses[size],
        weightClasses[weight],
        colorClasses[color],
        'leading-relaxed',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};
