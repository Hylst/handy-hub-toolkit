
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { animations } from '@/lib/design-system';

interface ToolCardProps {
  title: string;
  description: string;
  icon: string;
  tools?: string[];
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'highlighted';
}

export const ToolCard: React.FC<ToolCardProps> = ({
  title,
  description,
  icon,
  tools = [],
  onClick,
  className,
  variant = 'default',
}) => {
  const variantClasses = {
    default: 'border-border hover:border-primary/20',
    highlighted: 'border-2 border-primary/20 bg-primary/5',
  };

  return (
    <Card
      className={cn(
        'cursor-pointer',
        animations.transitions.normal,
        animations.hover.lift,
        'hover:shadow-md',
        variantClasses[variant],
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="text-2xl flex-shrink-0 bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <Heading level={3} size="lg" className="mb-1">
              {title}
            </Heading>
            <Text size="sm" color="muted" className="line-clamp-2">
              {description}
            </Text>
          </div>
        </div>
      </CardHeader>
      
      {tools.length > 0 && (
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1.5">
            {tools.slice(0, 4).map((tool, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs font-normal"
              >
                {tool}
              </Badge>
            ))}
            {tools.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{tools.length - 4} plus
              </Badge>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
