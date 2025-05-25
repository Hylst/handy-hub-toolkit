
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState([12]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const generatePassword = () => {
    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

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
  };

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      toast({
        title: "Mot de passe copié !",
        description: "Le mot de passe a été copié dans le presse-papiers.",
      });
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { level: 0, text: "Aucun", color: "text-gray-500" };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { level: score, text: "Faible", color: "text-red-500" };
    if (score <= 4) return { level: score, text: "Moyen", color: "text-yellow-500" };
    return { level: score, text: "Fort", color: "text-green-500" };
  };

  const strength = getPasswordStrength();

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Générateur de Mots de Passe Sécurisés</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Longueur du mot de passe: {length[0]}
            </label>
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
              <label htmlFor="uppercase" className="text-sm">Majuscules (A-Z)</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lowercase"
                checked={includeLowercase}
                onCheckedChange={(checked) => setIncludeLowercase(checked === true)}
              />
              <label htmlFor="lowercase" className="text-sm">Minuscules (a-z)</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="numbers"
                checked={includeNumbers}
                onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
              />
              <label htmlFor="numbers" className="text-sm">Chiffres (0-9)</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="symbols"
                checked={includeSymbols}
                onCheckedChange={(checked) => setIncludeSymbols(checked === true)}
              />
              <label htmlFor="symbols" className="text-sm">Symboles (!@#$%...)</label>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={generatePassword} 
          className="w-full bg-gradient-to-r from-blue-600 to-teal-600"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Générer un mot de passe
        </Button>
        
        {password && (
          <div className="space-y-3">
            <div className="relative">
              <Input
                value={password}
                readOnly
                className="font-mono pr-12"
              />
              <Button
                onClick={copyToClipboard}
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
                  strength.level <= 2 ? 'bg-red-500' : 
                  strength.level <= 4 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${(strength.level / 6) * 100}%` }}
              />
            </div>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>💡 Conseils pour un mot de passe sûr :</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Au moins 12 caractères</li>
                <li>Mélange de majuscules, minuscules, chiffres et symboles</li>
                <li>Unique pour chaque compte</li>
                <li>Ne contient pas d'informations personnelles</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
