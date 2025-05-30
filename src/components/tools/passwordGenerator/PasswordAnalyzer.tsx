
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
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
  hasRepeatedChars: boolean;
  hasSequentialChars: boolean;
  commonPatterns: string[];
}

interface PasswordAnalyzerProps {
  password: string;
  analyzeStrength: (password: string) => PasswordStrength;
}

export const PasswordAnalyzer = ({ password, analyzeStrength }: PasswordAnalyzerProps) => {
  const [analysis, setAnalysis] = useState<PasswordStrength | null>(null);
  const [isVisible, setIsVisible] = useState(false);

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
      <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Shield className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Analyseur de Sécurité
          </h3>
          <p className="text-gray-500 text-center">
            Entrez un mot de passe pour analyser sa sécurité en temps réel
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  const getStrengthIcon = () => {
    if (analysis.score >= 80) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (analysis.score >= 60) return <Shield className="w-5 h-5 text-yellow-500" />;
    if (analysis.score >= 40) return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getCrackTimeColor = (crackTime: string) => {
    if (crackTime.includes('siècles') || crackTime.includes('millénaires')) return 'text-green-600';
    if (crackTime.includes('années') || crackTime.includes('décennies')) return 'text-yellow-600';
    if (crackTime.includes('mois') || crackTime.includes('semaines')) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      {/* Affichage du mot de passe */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">Mot de passe analysé:</span>
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="text-blue-600 hover:text-blue-700"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
          <div className="font-mono text-lg p-3 bg-gray-100 dark:bg-gray-800 rounded border">
            {isVisible ? password : '•'.repeat(password.length)}
          </div>
        </CardContent>
      </Card>

      {/* Score de sécurité principal */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            {getStrengthIcon()}
            <span className={analysis.color}>Score de Sécurité: {analysis.level}</span>
            <Badge variant="secondary" className="ml-auto">
              {analysis.score}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={analysis.score} className="h-3" />
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="font-medium">Entropie:</span>
              <p className="text-gray-600 dark:text-gray-400">{analysis.entropy} bits</p>
            </div>
            <div className="space-y-1">
              <span className="font-medium flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Temps de crack:
              </span>
              <p className={`font-medium ${getCrackTimeColor(analysis.crackTime)}`}>
                {analysis.crackTime}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Caractéristiques détaillées */}
      <Card className="border-indigo-200 dark:border-indigo-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-indigo-700 dark:text-indigo-300">
            Caractéristiques du Mot de Passe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              {analysis.hasUppercase ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">Majuscules</span>
            </div>
            
            <div className="flex items-center gap-2">
              {analysis.hasLowercase ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">Minuscules</span>
            </div>
            
            <div className="flex items-center gap-2">
              {analysis.hasNumbers ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">Chiffres</span>
            </div>
            
            <div className="flex items-center gap-2">
              {analysis.hasSymbols ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">Symboles</span>
            </div>
          </div>

          {/* Problèmes détectés */}
          {(analysis.hasRepeatedChars || analysis.hasSequentialChars || analysis.commonPatterns.length > 0) && (
            <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded">
              <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                Problèmes détectés:
              </h4>
              <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                {analysis.hasRepeatedChars && (
                  <li>• Contient des caractères répétés</li>
                )}
                {analysis.hasSequentialChars && (
                  <li>• Contient des séquences de caractères</li>
                )}
                {analysis.commonPatterns.map((pattern, index) => (
                  <li key={index}>• Motif commun détecté: {pattern}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommandations */}
      {analysis.feedback.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-amber-700 dark:text-amber-300">
              Recommandations d'Amélioration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {analysis.feedback.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
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
