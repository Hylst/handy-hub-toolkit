
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Save, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { PasswordDisplay } from "./passwordGenerator/PasswordDisplay";
import { PasswordSettings } from "./passwordGenerator/PasswordSettings";
import { PasswordHistory } from "./passwordGenerator/PasswordHistory";
import { PasswordTemplates } from "./passwordGenerator/PasswordTemplates";

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

  const formatNumber = (num: number): string => {
    return parseFloat(num.toFixed(12)).toString();
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="shadow-lg border-2 border-gray-200 dark:border-gray-700">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950">
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <Settings className="w-6 h-6" />
            Générateur de Mots de Passe Avancé
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-6">
            <PasswordDisplay
              password={password}
              memory={0}
              lastAnswer={0}
              strength={strength}
              formatNumber={formatNumber}
            />

            <Tabs defaultValue="generator" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 h-auto bg-gray-100 dark:bg-gray-800">
                <TabsTrigger 
                  value="generator"
                  className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-300 text-sm p-3"
                >
                  Générateur
                </TabsTrigger>
                <TabsTrigger 
                  value="history"
                  className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900 dark:data-[state=active]:text-green-300 text-sm p-3"
                >
                  Historique
                </TabsTrigger>
                <TabsTrigger 
                  value="templates"
                  className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-300 text-sm p-3"
                >
                  Templates
                </TabsTrigger>
              </TabsList>

              <TabsContent value="generator" className="space-y-6">
                <PasswordSettings
                  length={length}
                  setLength={setLength}
                  includeUppercase={includeUppercase}
                  setIncludeUppercase={setIncludeUppercase}
                  includeLowercase={includeLowercase}
                  setIncludeLowercase={setIncludeLowercase}
                  includeNumbers={includeNumbers}
                  setIncludeNumbers={setIncludeNumbers}
                  includeSymbols={includeSymbols}
                  setIncludeSymbols={setIncludeSymbols}
                  excludeSimilar={excludeSimilar}
                  setExcludeSimilar={setExcludeSimilar}
                  selectedTemplate={selectedTemplate}
                  onTemplateChange={applyTemplate}
                  passwordTemplates={passwordTemplates}
                />
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={generatePassword} 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                    size="lg"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Générer un mot de passe
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={saveCurrentPreferences}
                    size="lg"
                    className="sm:w-auto"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="history">
                <PasswordHistory
                  passwordHistory={passwordHistory}
                  passwordTemplates={passwordTemplates}
                />
              </TabsContent>

              <TabsContent value="templates">
                <PasswordTemplates
                  passwordTemplates={passwordTemplates}
                  onApplyTemplate={applyTemplate}
                />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
