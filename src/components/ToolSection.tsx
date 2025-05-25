
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ToolSectionProps {
  title: string;
  description: string;
  icon: string;
  tools: string[];
  onClick: () => void;
}

export const ToolSection = ({ title, description, icon, tools, onClick }: ToolSectionProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group" onClick={onClick}>
      <CardHeader className="text-center">
        <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <CardTitle className="text-xl font-bold text-gray-800">{title}</CardTitle>
        <CardDescription className="text-gray-600">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          {tools.map((tool, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>{tool}</span>
            </div>
          ))}
        </div>
        <Button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
          Ouvrir les outils
        </Button>
      </CardContent>
    </Card>
  );
};
