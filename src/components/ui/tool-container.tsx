
import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';

interface ToolContainerProps {
  children: React.ReactNode;
  variant?: 'default' | 'narrow' | 'wide';
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'default' | 'muted' | 'accent';
  className?: string;
}

export const ToolContainer: React.FC<ToolContainerProps> = ({
  children,
  variant = 'default',
  spacing = 'lg',
  background = 'default',
  className,
}) => {
  return (
    <Section spacing={spacing} background={background} className={className}>
      <Container variant={variant}>
        {children}
      </Container>
    </Section>
  );
};
