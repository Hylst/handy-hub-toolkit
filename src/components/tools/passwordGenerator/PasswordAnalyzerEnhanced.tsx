import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Clock, AlertTriangle, CheckCircle, XCircle, Search, Copy, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  details: {
    length: number;
    uniqueChars: number;
    characterVariety: number;
    commonWords: string[];
    keyboardPatterns: string[];
    datePatterns: string[];
  };
}

interface PasswordAnalyzerEnhancedProps {
  password: string;
  analyzeStrength: (password: string) => PasswordStrength;
  className?: string;
}

export const PasswordAnalyzerEnhanced = ({
  password,
  analyzeStrength,
  className = ""
}: PasswordAnalyzerEnhancedProps) => {
  const [analysis, setAnalysis] = useState<PasswordStrength | null>(null);
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (password) {
      setInputPassword(password);
    }
  }, [password]);

  useEffect(() => {
    if (inputPassword) {
      setIsAnalyzing(true);
      // Simulate analysis delay for better UX
      const timer = setTimeout(() => {
        const result = analyzeStrength(inputPassword);
        setAnalysis(result);
        setIsAnalyzing(false);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setAnalysis(null);
      setIsAnalyzing(false);
    }
  }, [inputPassword, analyzeStrength]);

  const handleCopyPassword = () => {
    if (inputPassword) {
      navigator.clipboard.writeText(inputPassword);
      toast.success("Mot de passe copié !");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100 dark:bg-green-900/20";
    if (score >= 60) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
    if (score >= 40) return "text-orange-600 bg-orange-100 dark:bg-orange-900/20";
    return "text-red-600 bg-red-100 dark:bg-red-900/20";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Input personnalisé pour l'analyse */}
      <Card className="border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Analyser un Mot de Passe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showPassword ? "text" : "password"}
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                placeholder="Entrez un mot de passe à analyser..."
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                  className="h-8 w-8 p-0"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                {inputPassword && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyPassword}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          {inputPassword && (
            <div className="text-sm text-muted-foreground">
              Longueur: {inputPassword.length} caractères
            </div>
          )}
        </CardContent>
      </Card>

      {!inputPassword && (
        <Card className="border-muted">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              Analyseur de Sécurité Avancé
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              Entrez un mot de passe ci-dessus pour obtenir une analyse détaillée de sa sécurité,
              incluant la détection de motifs courants et des recommandations personnalisées.
            </p>
          </CardContent>
        </Card>
      )}

      {isAnalyzing && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">Analyse en cours...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {analysis && !isAnalyzing && (
        <div className="space-y-6">
          {/* Score global amélioré */}
          <Card className="border-primary/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Analyse de Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium">Force du mot de passe</span>
                  <Badge className={getScoreColor(analysis.score)}>
                    {analysis.level} ({analysis.score}%)
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Progress value={analysis.score} className="h-4" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Faible</span>
                    <span>Moyenne</span>
                    <span>Forte</span>
                    <span>Très forte</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">Temps de cassage</div>
                  <div className="text-sm font-medium">{analysis.crackTime}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">Entropie</div>
                  <div className="text-sm font-medium">{analysis.entropy} bits</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Longueur</div>
                  <div className="text-sm font-medium">{analysis.details.length} chars</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Variété</div>
                  <div className="text-sm font-medium">{analysis.details.characterVariety}/4</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Composition détaillée */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Composition du Mot de Passe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {analysis.hasUppercase ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-sm font-medium">Majuscules (A-Z)</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {analysis.hasLowercase ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-sm font-medium">Minuscules (a-z)</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {analysis.hasNumbers ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-sm font-medium">Chiffres (0-9)</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {analysis.hasSymbols ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-sm font-medium">Symboles (!@#...)</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Caractères uniques: {analysis.details.uniqueChars} / {analysis.details.length}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Problèmes détectés avec plus de détails */}
          {(analysis.hasSequence || analysis.hasRepeatedChars || 
            analysis.commonPatterns.length > 0 || 
            analysis.details.commonWords.length > 0 ||
            analysis.details.keyboardPatterns.length > 0 ||
            analysis.details.datePatterns.length > 0) && (
            <Card className="border-destructive/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  Vulnérabilités Détectées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.hasSequence && (
                    <div className="flex items-start gap-3 p-3 bg-destructive/5 rounded-lg">
                      <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">Séquences communes</div>
                        <div className="text-sm text-muted-foreground">
                          Contient des séquences prévisibles (123, abc, qwerty, etc.)
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {analysis.hasRepeatedChars && (
                    <div className="flex items-start gap-3 p-3 bg-destructive/5 rounded-lg">
                      <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">Caractères répétés</div>
                        <div className="text-sm text-muted-foreground">
                          Contient des caractères répétés consécutivement
                        </div>
                      </div>
                    </div>
                  )}

                  {analysis.details.commonWords.length > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-destructive/5 rounded-lg">
                      <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">Mots courants détectés</div>
                        <div className="text-sm text-muted-foreground">
                          {analysis.details.commonWords.join(", ")}
                        </div>
                      </div>
                    </div>
                  )}

                  {analysis.details.keyboardPatterns.length > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-destructive/5 rounded-lg">
                      <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">Motifs de clavier</div>
                        <div className="text-sm text-muted-foreground">
                          {analysis.details.keyboardPatterns.join(", ")}
                        </div>
                      </div>
                    </div>
                  )}

                  {analysis.details.datePatterns.length > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-destructive/5 rounded-lg">
                      <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">Formats de date</div>
                        <div className="text-sm text-muted-foreground">
                          {analysis.details.datePatterns.join(", ")}
                        </div>
                      </div>
                    </div>
                  )}

                  {analysis.commonPatterns.map((pattern, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-destructive/5 rounded-lg">
                      <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                      <div>
                        <div className="text-sm">{pattern}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommandations améliorées */}
          {analysis.feedback.length > 0 && (
            <Card className="border-primary/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Shield className="w-5 h-5" />
                  Recommandations d'Amélioration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.feedback.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <span className="text-sm">{tip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};