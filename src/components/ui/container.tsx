
import React from 'react';
import { cn } from '@/lib/utils';
import { layoutUtilities } from '@/lib/design-system';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'narrow' | 'wide';
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  variant = 'default',
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(layoutUtilities.container[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
};
