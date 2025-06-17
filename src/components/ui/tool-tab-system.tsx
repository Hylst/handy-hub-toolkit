
import React from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface ToolTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  content: React.ReactNode;
}

interface ToolTabSystemProps {
  tabs: ToolTab[];
  defaultTab?: string;
  className?: string;
  tabsListClassName?: string;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
}

export const ToolTabSystem: React.FC<ToolTabSystemProps> = ({
  tabs,
  defaultTab,
  className,
  tabsListClassName,
  orientation = 'horizontal',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'text-xs p-2',
    md: 'text-sm p-3',
    lg: 'text-base p-4',
  };

  const gridClasses = orientation === 'horizontal' 
    ? `grid-cols-${Math.min(tabs.length, 5)}` 
    : 'grid-cols-1';

  return (
    <Tabs defaultValue={defaultTab || tabs[0]?.id} className={cn('w-full', className)}>
      <TabsList className={cn(
        'grid w-full h-auto',
        gridClasses,
        tabsListClassName
      )}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className={cn(
              'flex flex-col sm:flex-row items-center gap-1 sm:gap-2',
              sizeClasses[size]
            )}
          >
            {tab.icon && (
              <div className="flex-shrink-0">
                {tab.icon}
              </div>
            )}
            <span className="text-center leading-tight">{tab.label}</span>
            {tab.badge && (
              <Badge variant="secondary" className="text-xs ml-1">
                {tab.badge}
              </Badge>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-4 lg:mt-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
