
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Copy, Zap, Shield, Target, TrendingUp } from "lucide-react";

interface PasswordDisplayAdvancedProps {
  password: string;
  strength: {
    score: number;
    level: string;
    color: string;
    feedback: string[];
    entropy: number;
  };
  onCopy: (password: string) => void;
  stats: {
    totalGenerated: number;
    averageStrength: number;
    mostUsedLength: number;
    strongPasswords: number;
  };
}

export const PasswordDisplayAdvanced = ({ 
  password, 
  strength, 
  onCopy,
  stats
}: PasswordDisplayAdvancedProps) => {
  return (
    <div className="space-y-4">
      {/* Affichage principal du mot de passe */}
      <div className="p-4 lg:p-6 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 rounded-xl shadow-inner border-2 border-purple-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <span className="text-sm text-purple-200">Mot de passe généré</span>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary" className="bg-purple-800 text-purple-200">
              <Shield className="w-3 h-3 mr-1" />
              Sécurisé
            </Badge>
            {strength.entropy > 0 && (
              <Badge variant="secondary" className="bg-indigo-800 text-indigo-200">
                {strength.entropy} bits entropie
              </Badge>
            )}
          </div>
        </div>
        
        <div className="relative">
          <Input
            value={password}
            readOnly
            className="font-mono pr-12 text-lg sm:text-xl lg:text-2xl bg-black/30 text-green-300 border-purple-600 placeholder:text-purple-300"
            placeholder="Aucun mot de passe généré"
          />
          {password && (
            <Button
              onClick={() => onCopy(password)}
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-300 hover:text-white hover:bg-purple-700/50"
            >
              <Copy className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {password && (
          <div className="mt-4 space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-sm text-purple-200">
                Force: <span className={`font-semibold ${strength.color === 'text-red-500' ? 'text-red-400' : 
                  strength.color === 'text-orange-500' ? 'text-orange-400' :
                  strength.color === 'text-yellow-500' ? 'text-yellow-400' :
                  strength.color === 'text-green-500' ? 'text-green-400' : 'text-green-300'}`}>
                  {strength.level} ({strength.score}%)
                </span>
              </span>
              <span className="text-sm text-green-300">● Chiffré</span>
            </div>
            
            <Progress 
              value={strength.score} 
              className="h-3 bg-gray-800"
            />
            
            {strength.feedback.length > 0 && (
              <div className="text-xs text-purple-200 space-y-1">
                <span className="font-medium">Recommandations:</span>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  {strength.feedback.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Zap className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Total</span>
          </div>
          <p className="text-lg font-bold text-purple-600">{stats.totalGenerated}</p>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Force Moy.</span>
          </div>
          <p className="text-lg font-bold text-blue-600">{stats.averageStrength}%</p>
        </div>
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-700 dark:text-green-300">Forts</span>
          </div>
          <p className="text-lg font-bold text-green-600">{stats.strongPasswords}</p>
        </div>
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Longueur</span>
          </div>
          <p className="text-lg font-bold text-indigo-600">{stats.mostUsedLength}</p>
        </div>
      </div>
    </div>
  );
};
