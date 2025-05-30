
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wand2, Shield, Globe, Gamepad2, Building, Smartphone, Wifi, CreditCard, Key } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  settings: {
    length: number;
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
    excludeSimilar: boolean;
    excludeAmbiguous: boolean;
    requireEveryCharType: boolean;
  };
  category: string;
  icon: string;
  securityLevel: 'basic' | 'medium' | 'high' | 'ultra';
  useCases: string[];
}

interface PasswordTemplatesAdvancedProps {
  templates: Template[];
  currentTemplate: string;
  onApplyTemplate: (templateId: string) => void;
}

export const PasswordTemplatesAdvanced = ({
  templates,
  currentTemplate,
  onApplyTemplate
}: PasswordTemplatesAdvancedProps) => {
  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      shield: <Shield className="w-5 h-5" />,
      globe: <Globe className="w-5 h-5" />,
      gamepad: <Gamepad2 className="w-5 h-5" />,
      building: <Building className="w-5 h-5" />,
      smartphone: <Smartphone className="w-5 h-5" />,
      wifi: <Wifi className="w-5 h-5" />,
      creditcard: <CreditCard className="w-5 h-5" />,
      key: <Key className="w-5 h-5" />
    };
    return icons[iconName] || <Key className="w-5 h-5" />;
  };

  const getSecurityColor = (level: string) => {
    switch (level) {
      case 'basic': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'medium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'high': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'ultra': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getSecurityLabel = (level: string) => {
    switch (level) {
      case 'basic': return 'Basique';
      case 'medium': return 'Moyen';
      case 'high': return 'Élevé';
      case 'ultra': return 'Ultra';
      default: return 'Standard';
    }
  };

  const categories = [...new Set(templates.map(t => t.category))];

  return (
    <div className="space-y-6">
      {categories.map(category => {
        const categoryTemplates = templates.filter(t => t.category === category);
        
        return (
          <Card key={category} className="border-indigo-200 dark:border-indigo-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 capitalize">
                <Wand2 className="w-5 h-5" />
                Templates {category}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <ScrollArea className="h-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-4 border rounded-lg transition-all cursor-pointer hover:shadow-md ${
                        currentTemplate === template.id
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50'
                          : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                      }`}
                      onClick={() => onApplyTemplate(template.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                          {getIcon(template.icon)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                              {template.name}
                            </h3>
                            <Badge className={`text-xs ${getSecurityColor(template.securityLevel)}`}>
                              {getSecurityLabel(template.securityLevel)}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {template.description}
                          </p>
                          
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1 text-xs">
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                                {template.settings.length} caractères
                              </span>
                              {template.settings.includeUppercase && (
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded">
                                  A-Z
                                </span>
                              )}
                              {template.settings.includeLowercase && (
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded">
                                  a-z
                                </span>
                              )}
                              {template.settings.includeNumbers && (
                                <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded">
                                  0-9
                                </span>
                              )}
                              {template.settings.includeSymbols && (
                                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded">
                                  !@#
                                </span>
                              )}
                            </div>
                            
                            <div className="text-xs text-gray-500">
                              <span className="font-medium">Idéal pour:</span>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {template.useCases.map((useCase, index) => (
                                  <span key={index} className="text-gray-600 dark:text-gray-400">
                                    {useCase}{index < template.useCases.length - 1 ? ',' : ''}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            size="sm"
                            className="w-full mt-3"
                            variant={currentTemplate === template.id ? "default" : "outline"}
                            onClick={(e) => {
                              e.stopPropagation();
                              onApplyTemplate(template.id);
                            }}
                          >
                            {currentTemplate === template.id ? 'Sélectionné' : 'Utiliser ce template'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        );
      })}
      
      {templates.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wand2 className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Aucun template disponible
            </h3>
            <p className="text-gray-500 text-center">
              Les templates seront chargés automatiquement
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
