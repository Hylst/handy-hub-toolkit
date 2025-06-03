
import React from 'react';
import { cn } from '@/lib/utils';
import { designSystem } from '@/lib/design-system';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'default' | 'muted' | 'accent';
}

export const Section: React.FC<SectionProps> = ({
  children,
  spacing = 'lg',
  background = 'default',
  className,
  ...props
}) => {
  const spacingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24',
  };

  const backgroundClasses = {
    default: '',
    muted: 'bg-muted/30',
    accent: 'bg-accent/10',
  };

  return (
    <section
      className={cn(
        spacingClasses[spacing],
        backgroundClasses[background],
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
};
