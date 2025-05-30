
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface PasswordStrength {
  score: number;
  level: string;
  color: string;
  feedback: string[];
  entropy: number;
  crackTime: string;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  hasSequence: boolean;
  hasRepeatedChars: boolean;
  commonPatterns: string[];
}

interface PasswordAnalyzerProps {
  password: string;
  analyzeStrength: (password: string) => PasswordStrength;
}

export const PasswordAnalyzer = ({
  password,
  analyzeStrength
}: PasswordAnalyzerProps) => {
  const [analysis, setAnalysis] = useState<PasswordStrength | null>(null);

  useEffect(() => {
    if (password) {
      const result = analyzeStrength(password);
      setAnalysis(result);
    } else {
      setAnalysis(null);
    }
  }, [password, analyzeStrength]);

  if (!password) {
    return (
      <Card className="border-blue-200 dark:border-blue-800">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Shield className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Analyseur de Mot de Passe
          </h3>
          <p className="text-gray-500 text-center">
            Entrez un mot de passe pour voir son analyse de sécurité
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-4">
      {/* Score global */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Analyse de Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Force du mot de passe</span>
            <Badge className={`${analysis.color.replace('text-', 'bg-').replace('500', '100')} ${analysis.color.replace('500', '700')}`}>
              {analysis.level} ({analysis.score}%)
            </Badge>
          </div>
          <Progress value={analysis.score} className="h-3" />
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Temps de cassage: {analysis.crackTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Entropie: {analysis.entropy} bits</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Détails de composition */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Composition du Mot de Passe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              {analysis.hasUppercase ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">Majuscules (A-Z)</span>
            </div>
            
            <div className="flex items-center gap-2">
              {analysis.hasLowercase ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">Minuscules (a-z)</span>
            </div>
            
            <div className="flex items-center gap-2">
              {analysis.hasNumbers ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">Chiffres (0-9)</span>
            </div>
            
            <div className="flex items-center gap-2">
              {analysis.hasSymbols ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">Symboles (!@#...)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problèmes détectés */}
      {(analysis.hasSequence || analysis.hasRepeatedChars || analysis.commonPatterns.length > 0) && (
        <Card className="border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
              <AlertTriangle className="w-5 h-5" />
              Problèmes Détectés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.hasSequence && (
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <XCircle className="w-4 h-4" />
                  <span>Contient des séquences communes (123, abc, etc.)</span>
                </div>
              )}
              {analysis.hasRepeatedChars && (
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <XCircle className="w-4 h-4" />
                  <span>Contient des caractères répétés consécutivement</span>
                </div>
              )}
              {analysis.commonPatterns.map((pattern, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-orange-600">
                  <XCircle className="w-4 h-4" />
                  <span>{pattern}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommandations */}
      {analysis.feedback.length > 0 && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Shield className="w-5 h-5" />
              Recommandations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.feedback.map((tip, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
