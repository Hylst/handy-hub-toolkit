
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Wand2, Zap } from "lucide-react";

interface PasswordSettingsAdvanced {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
  requireEveryCharType: boolean;
  template: string;
  customCharset: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  settings: Partial<PasswordSettingsAdvanced>;
  category: string;
}

interface PasswordSettingsAdvancedProps {
  settings: PasswordSettingsAdvanced;
  onSettingsChange: (settings: PasswordSettingsAdvanced) => void;
  templates: Template[];
  onApplyTemplate: (templateId: string) => void;
}

export const PasswordSettingsAdvanced = ({
  settings,
  onSettingsChange,
  templates,
  onApplyTemplate
}: PasswordSettingsAdvancedProps) => {
  const updateSetting = <K extends keyof PasswordSettingsAdvanced>(
    key: K,
    value: PasswordSettingsAdvanced[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const quickTemplates = templates.filter(t => t.category === 'quick');

  return (
    <div className="space-y-6">
      {/* Quick Templates */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <Wand2 className="w-5 h-5" />
            Templates Rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {quickTemplates.map((template) => (
              <Button
                key={template.id}
                variant={settings.template === template.id ? "default" : "outline"}
                size="sm"
                onClick={() => onApplyTemplate(template.id)}
                className="text-xs"
              >
                {template.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings avancés */}
      <Card className="border-indigo-200 dark:border-indigo-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
            <Settings className="w-5 h-5" />
            Configuration Avancée
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Longueur */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="length">Longueur du mot de passe</Label>
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                {settings.length} caractères
              </Badge>
            </div>
            <Slider
              id="length"
              min={4}
              max={128}
              step={1}
              value={[settings.length]}
              onValueChange={(value) => updateSetting('length', value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>4</span>
              <span>128</span>
            </div>
          </div>

          {/* Types de caractères */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Types de caractères</Label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="uppercase" className="text-sm">Majuscules (A-Z)</Label>
                <Switch
                  id="uppercase"
                  checked={settings.includeUppercase}
                  onCheckedChange={(checked) => updateSetting('includeUppercase', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="lowercase" className="text-sm">Minuscules (a-z)</Label>
                <Switch
                  id="lowercase"
                  checked={settings.includeLowercase}
                  onCheckedChange={(checked) => updateSetting('includeLowercase', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="numbers" className="text-sm">Chiffres (0-9)</Label>
                <Switch
                  id="numbers"
                  checked={settings.includeNumbers}
                  onCheckedChange={(checked) => updateSetting('includeNumbers', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="symbols" className="text-sm">Symboles (!@#$...)</Label>
                <Switch
                  id="symbols"
                  checked={settings.includeSymbols}
                  onCheckedChange={(checked) => updateSetting('includeSymbols', checked)}
                />
              </div>
            </div>
          </div>

          {/* Options avancées */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Label className="text-base font-medium">Options Avancées</Label>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="excludeSimilar" className="text-sm">Exclure caractères similaires</Label>
                  <p className="text-xs text-gray-500">Évite i, l, 1, L, o, 0, O</p>
                </div>
                <Switch
                  id="excludeSimilar"
                  checked={settings.excludeSimilar}
                  onCheckedChange={(checked) => updateSetting('excludeSimilar', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="excludeAmbiguous" className="text-sm">Exclure caractères ambigus</Label>
                  <p className="text-xs text-gray-500">Évite {}, [], (), /, \, ', ", ~, ;</p>
                </div>
                <Switch
                  id="excludeAmbiguous"
                  checked={settings.excludeAmbiguous}
                  onCheckedChange={(checked) => updateSetting('excludeAmbiguous', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requireEvery" className="text-sm">Forcer chaque type</Label>
                  <p className="text-xs text-gray-500">Garantit au moins un caractère de chaque type sélectionné</p>
                </div>
                <Switch
                  id="requireEvery"
                  checked={settings.requireEveryCharType}
                  onCheckedChange={(checked) => updateSetting('requireEveryCharType', checked)}
                />
              </div>
            </div>
          </div>

          {/* Template selector */}
          <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Label htmlFor="template">Template actuel</Label>
            <Select value={settings.template} onValueChange={(value) => updateSetting('template', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Personnalisé</SelectItem>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} - {template.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
