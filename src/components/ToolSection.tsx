
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";

interface ToolSectionProps {
  title: string;
  description: string;
  icon: string;
  tools: string[];
  onClick: () => void;
}

export const ToolSection = ({ title, description, icon, tools, onClick }: ToolSectionProps) => {
  return (
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.02] cursor-pointer border-2 hover:border-blue-200 dark:hover:border-blue-800" onClick={onClick}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-transparent to-teal-50/0 group-hover:from-blue-50/50 group-hover:to-teal-50/50 dark:group-hover:from-blue-900/20 dark:group-hover:to-teal-900/20 transition-all duration-500" />
      
      <CardHeader className="text-center relative z-10">
        <div className="relative">
          <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-500 group-hover:animate-pulse">
            {icon}
          </div>
          <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce" />
        </div>
        <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="space-y-3 mb-6">
          {tools.map((tool, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between group/item opacity-80 group-hover:opacity-100 transition-all duration-300"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors duration-200">
                  {tool}
                </span>
              </div>
              <Badge variant="secondary" className="text-xs opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                Nouveau
              </Badge>
            </div>
          ))}
        </div>
        
        <Button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg">
          <span className="flex items-center justify-center gap-2">
            Ouvrir les outils
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </span>
        </Button>
      </CardContent>
    </Card>
  );
};
