
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PasswordDisplayProps {
  password: string;
  memory: number;
  lastAnswer: number;
  strength: {
    level: number;
    text: string;
    color: string;
  };
  formatNumber: (num: number) => string;
}

export const PasswordDisplay = ({ 
  password, 
  memory, 
  lastAnswer, 
  strength, 
  formatNumber 
}: PasswordDisplayProps) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Mot de passe copié !",
      description: "Le mot de passe a été copié dans le presse-papiers.",
    });
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl text-right shadow-inner border-2 border-gray-700">
      <div className="text-xs text-gray-300 dark:text-gray-400 mb-2 flex flex-col sm:flex-row justify-between gap-2">
        <span className="text-left sm:text-right">Générateur actif</span>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs bg-green-800 text-green-200">
            <Zap className="w-3 h-3 mr-1" />
            Actif
          </Badge>
          {memory !== 0 && (
            <Badge variant="secondary" className="text-xs bg-blue-800 text-blue-200">
              M: {formatNumber(memory)}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="relative">
        <Input
          value={password}
          readOnly
          className="font-mono pr-12 text-lg sm:text-xl md:text-2xl bg-black/20 text-green-400 dark:text-green-300 border-gray-600"
          placeholder="Aucun mot de passe généré"
        />
        {password && (
          <Button
            onClick={() => copyToClipboard(password)}
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white hover:bg-gray-700"
          >
            <Copy className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      {password && (
        <div className="text-xs text-gray-300 dark:text-gray-400 mt-2 flex flex-col sm:flex-row justify-between gap-2">
          <span className="text-left sm:text-right">
            Force: <span className={`font-semibold ${strength.color}`}>{strength.text}</span>
          </span>
          <div className="flex gap-2">
            <span className="text-green-400 dark:text-green-300">● Sécurisé</span>
          </div>
        </div>
      )}
      
      {password && (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div 
            className={`h-2 rounded-full transition-all ${
              strength.level <= 3 ? 'bg-red-500' : 
              strength.level <= 5 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${(strength.level / 7) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};
