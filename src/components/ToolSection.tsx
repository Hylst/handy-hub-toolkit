
import React from 'react';
import { ToolCard } from '@/components/ui/tool-card';

interface ToolSectionProps {
  title: string;
  description: string;
  icon: string;
  tools: string[];
  onClick: () => void;
  highlighted?: boolean;
}

export const ToolSection: React.FC<ToolSectionProps> = ({
  title,
  description,
  icon,
  tools,
  onClick,
  highlighted = false,
}) => {
  return (
    <ToolCard
      title={title}
      description={description}
      icon={icon}
      tools={tools}
      onClick={onClick}
      variant={highlighted ? 'highlighted' : 'default'}
    />
  );
};
