
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, RefreshCw, Save, Clock, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUserPreferences } from "@/hooks/useUserPreferences";

interface PasswordEntry {
  id: string;
  password: string;
  timestamp: number;
  settings: PasswordSettings;
}

interface PasswordSettings {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  template: string;
}

export const PasswordGeneratorAdvanced = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("custom");
  const [passwordHistory, setPasswordHistory] = useState<PasswordEntry[]>([]);

  const { preferences, savePreferences, updateUsageCount } = useUserPreferences('password-generator');

  // Load preferences on mount
  useEffect(() => {
    if (preferences && Object.keys(preferences).length > 0) {
      setLength([preferences.length || 16]);
      setIncludeUppercase(preferences.includeUppercase !== false);
      setIncludeLowercase(preferences.includeLowercase !== false);
      setIncludeNumbers(preferences.includeNumbers !== false);
      setIncludeSymbols(preferences.includeSymbols !== false);
      setExcludeSimilar(preferences.excludeSimilar || false);
      setSelectedTemplate(preferences.template || "custom");
      setPasswordHistory(preferences.history || []);
    }
  }, [preferences]);

  const passwordTemplates = {
    custom: { name: "Personnalisé", length: 16, upper: true, lower: true, numbers: true, symbols: true },
    web: { name: "Site Web", length: 14, upper: true, lower: true, numbers: true, symbols: false },
    banking: { name: "Banque", length: 20, upper: true, lower: true, numbers: true, symbols: true },
    gaming: { name: "Jeux", length: 12, upper: true, lower: true, numbers: true, symbols: false },
    enterprise: { name: "Entreprise", length: 18, upper: true, lower: true, numbers: true, symbols: true },
    simple: { name: "Simple", length: 10, upper: true, lower: true, numbers: true, symbols: false }
  };

  const applyTemplate = (templateKey: string) => {
    const template = passwordTemplates[templateKey as keyof typeof passwordTemplates];
    if (template && templateKey !== "custom") {
      setLength([template.length]);
      setIncludeUppercase(template.upper);
      setIncludeLowercase(template.lower);
      setIncludeNumbers(template.numbers);
      setIncludeSymbols(template.symbols);
    }
    setSelectedTemplate(templateKey);
  };

  const generatePassword = () => {
    let charset = "";
    const similarChars = "il1Lo0O";
    
    if (includeUppercase) {
      charset += excludeSimilar ? "ABCDEFGHJKMNPQRSTUVWXYZ" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
    if (includeLowercase) {
      charset += excludeSimilar ? "abcdefghjkmnpqrstuvwxyz" : "abcdefghijklmnopqrstuvwxyz";
    }
    if (includeNumbers) {
      charset += excludeSimilar ? "23456789" : "0123456789";
    }
    if (includeSymbols) {
      charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    }

    if (charset === "") {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un type de caractère.",
        variant: "destructive",
      });
      return;
    }

    let result = "";
    for (let i = 0; i < length[0]; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setPassword(result);
    updateUsageCount();

    // Add to history
    const newEntry: PasswordEntry = {
      id: Date.now().toString(),
      password: result,
      timestamp: Date.now(),
      settings: {
        length: length[0],
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
        excludeSimilar,
        template: selectedTemplate
      }
    };

    const updatedHistory = [newEntry, ...passwordHistory.slice(0, 9)]; // Keep last 10
    setPasswordHistory(updatedHistory);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Mot de passe copié !",
      description: "Le mot de passe a été copié dans le presse-papiers.",
    });
  };

  const saveCurrentPreferences = () => {
    const currentPrefs = {
      length: length[0],
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
      excludeSimilar,
      template: selectedTemplate,
      history: passwordHistory
    };
    savePreferences(currentPrefs);
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { level: 0, text: "Aucun", color: "text-gray-500" };
    
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (pwd.length >= 16) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 3) return { level: score, text: "Faible", color: "text-red-500" };
    if (score <= 5) return { level: score, text: "Moyen", color: "text-yellow-500" };
    return { level: score, text: "Fort", color: "text-green-500" };
  };

  const strength = getPasswordStrength(password);

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Générateur de Mots de Passe Avancé
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generator" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generator">Générateur</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Template prédéfini</Label>
                <Select value={selectedTemplate} onValueChange={applyTemplate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
              
              <div className="grid grid-cols-2 gap-4">
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
                
                <div className="flex items-center space-x-2 col-span-2">
                  <Checkbox
                    id="exclude-similar"
                    checked={excludeSimilar}
                    onCheckedChange={(checked) => setExcludeSimilar(checked === true)}
                  />
                  <Label htmlFor="exclude-similar" className="text-sm">Exclure les caractères similaires (il1Lo0O)</Label>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={generatePassword} 
                className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Générer un mot de passe
              </Button>
              <Button variant="outline" onClick={saveCurrentPreferences}>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
            
            {password && (
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    value={password}
                    readOnly
                    className="font-mono pr-12"
                  />
                  <Button
                    onClick={() => copyToClipboard(password)}
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Force du mot de passe:</span>
                  <span className={`font-semibold ${strength.color}`}>
                    {strength.text}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      strength.level <= 3 ? 'bg-red-500' : 
                      strength.level <= 5 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(strength.level / 7) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Historique des mots de passe</h3>
              <Clock className="w-5 h-5 text-gray-500" />
            </div>
            
            {passwordHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucun mot de passe généré récemment.</p>
            ) : (
              <div className="space-y-2">
                {passwordHistory.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-mono text-sm">{entry.password}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(entry.timestamp).toLocaleString()} - 
                        Longueur: {entry.settings.length} - 
                        Template: {passwordTemplates[entry.settings.template as keyof typeof passwordTemplates]?.name || "Personnalisé"}
                      </div>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(entry.password)}
                      variant="ghost"
                      size="sm"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <h3 className="text-lg font-semibold">Templates prédéfinis</h3>
            <div className="grid gap-4">
              {Object.entries(passwordTemplates).map(([key, template]) => (
                <div key={key} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{template.name}</h4>
                    <Button
                      onClick={() => applyTemplate(key)}
                      variant="outline"
                      size="sm"
                    >
                      Utiliser
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Longueur: {template.length} caractères - 
                    Inclut: {[
                      template.upper && "Majuscules",
                      template.lower && "Minuscules", 
                      template.numbers && "Chiffres",
                      template.symbols && "Symboles"
                    ].filter(Boolean).join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
