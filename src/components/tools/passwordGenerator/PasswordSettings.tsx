
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PasswordSettingsProps {
  length: number[];
  setLength: (length: number[]) => void;
  includeUppercase: boolean;
  setIncludeUppercase: (value: boolean) => void;
  includeLowercase: boolean;
  setIncludeLowercase: (value: boolean) => void;
  includeNumbers: boolean;
  setIncludeNumbers: (value: boolean) => void;
  includeSymbols: boolean;
  setIncludeSymbols: (value: boolean) => void;
  excludeSimilar: boolean;
  setExcludeSimilar: (value: boolean) => void;
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
  passwordTemplates: Record<string, any>;
}

export const PasswordSettings = ({
  length,
  setLength,
  includeUppercase,
  setIncludeUppercase,
  includeLowercase,
  setIncludeLowercase,
  includeNumbers,
  setIncludeNumbers,
  includeSymbols,
  setIncludeSymbols,
  excludeSimilar,
  setExcludeSimilar,
  selectedTemplate,
  onTemplateChange,
  passwordTemplates
}: PasswordSettingsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label>Template prédéfini</Label>
        <Select value={selectedTemplate} onValueChange={onTemplateChange}>
          <SelectTrigger className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            {Object.entries(passwordTemplates).map(([key, template]) => (
              <SelectItem key={key} value={key}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">
          Longueur du mot de passe: {length[0]}
        </Label>
        <Slider
          value={length}
          onValueChange={setLength}
          max={50}
          min={4}
          step={1}
          className="w-full"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="uppercase"
            checked={includeUppercase}
            onCheckedChange={(checked) => setIncludeUppercase(checked === true)}
          />
          <Label htmlFor="uppercase" className="text-sm">Majuscules (A-Z)</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="lowercase"
            checked={includeLowercase}
            onCheckedChange={(checked) => setIncludeLowercase(checked === true)}
          />
          <Label htmlFor="lowercase" className="text-sm">Minuscules (a-z)</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="numbers"
            checked={includeNumbers}
            onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
          />
          <Label htmlFor="numbers" className="text-sm">Chiffres (0-9)</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="symbols"
            checked={includeSymbols}
            onCheckedChange={(checked) => setIncludeSymbols(checked === true)}
          />
          <Label htmlFor="symbols" className="text-sm">Symboles (!@#$%...)</Label>
        </div>
        
        <div className="flex items-center space-x-2 sm:col-span-2">
          <Checkbox
            id="exclude-similar"
            checked={excludeSimilar}
            onCheckedChange={(checked) => setExcludeSimilar(checked === true)}
          />
          <Label htmlFor="exclude-similar" className="text-sm">
            Exclure les caractères similaires (il1Lo0O)
          </Label>
        </div>
      </div>
    </div>
  );
};
