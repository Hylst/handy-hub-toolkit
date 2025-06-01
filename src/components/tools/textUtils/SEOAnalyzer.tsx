
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface SEOAnalyzerProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const SEOAnalyzer = ({ data, onDataChange }: SEOAnalyzerProps) => {
  const [content, setContent] = useState(data.content || '');
  const [keyword, setKeyword] = useState(data.keyword || '');
  const [title, setTitle] = useState(data.title || '');
  const [description, setDescription] = useState(data.description || '');
  const [analysis, setAnalysis] = useState({
    score: 0,
    keywordDensity: 0,
    readabilityScore: 0,
    issues: [],
    suggestions: [],
    stats: {
      words: 0,
      sentences: 0,
      paragraphs: 0,
      readingTime: 0
    },
    seoFactors: {
      titleLength: { value: 0, status: 'warning', message: '' },
      descriptionLength: { value: 0, status: 'warning', message: '' },
      keywordInTitle: { status: 'warning', message: '' },
      keywordInDescription: { status: 'warning', message: '' },
      keywordDensity: { value: 0, status: 'warning', message: '' },
      contentLength: { value: 0, status: 'warning', message: '' },
      headingStructure: { status: 'warning', message: '' }
    }
  });

  useEffect(() => {
    onDataChange({ content, keyword, title, description, analysis });
  }, [content, keyword, title, description, analysis]);

  useEffect(() => {
    analyzeSEO();
  }, [content, keyword, title, description]);

  const analyzeSEO = () => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const readingTime = Math.ceil(words / 250);

    // Calcul de la densité des mots-clés
    const keywordCount = keyword ? 
      (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length : 0;
    const keywordDensity = words > 0 ? (keywordCount / words) * 100 : 0;

    // Score de lisibilité simplifié
    const avgWordsPerSentence = sentences > 0 ? words / sentences : 0;
    const readabilityScore = Math.max(0, Math.min(100, 
      100 - (avgWordsPerSentence * 1.5) - (content.length / words * 0.1)
    ));

    // Analyse des facteurs SEO
    const seoFactors = {
      titleLength: analyzeTitle(title),
      descriptionLength: analyzeDescription(description),
      keywordInTitle: analyzeKeywordInTitle(title, keyword),
      keywordInDescription: analyzeKeywordInDescription(description, keyword),
      keywordDensity: analyzeKeywordDensity(keywordDensity),
      contentLength: analyzeContentLength(words),
      headingStructure: analyzeHeadingStructure(content)
    };

    // Calcul du score SEO global
    const factorScores = Object.values(seoFactors).map(factor => {
      switch (factor.status) {
        case 'good': return 100;
        case 'warning': return 60;
        case 'error': return 20;
        default: return 50;
      }
    });
    const score = Math.round(factorScores.reduce((sum, score) => sum + score, 0) / factorScores.length);

    // Génération des problèmes et suggestions
    const issues = [];
    const suggestions = [];

    Object.entries(seoFactors).forEach(([key, factor]) => {
      if (factor.status === 'error') {
        issues.push(factor.message);
      } else if (factor.status === 'warning') {
        suggestions.push(factor.message);
      }
    });

    setAnalysis({
      score,
      keywordDensity: Math.round(keywordDensity * 100) / 100,
      readabilityScore: Math.round(readabilityScore),
      issues,
      suggestions,
      stats: { words, sentences, paragraphs, readingTime },
      seoFactors
    });
  };

  const analyzeTitle = (titleText: string) => {
    const length = titleText.length;
    if (length === 0) {
      return { value: length, status: 'error', message: 'Le titre est manquant' };
    } else if (length < 30) {
      return { value: length, status: 'warning', message: 'Le titre est trop court (< 30 caractères)' };
    } else if (length > 60) {
      return { value: length, status: 'warning', message: 'Le titre est trop long (> 60 caractères)' };
    } else {
      return { value: length, status: 'good', message: 'Longueur du titre optimale' };
    }
  };

  const analyzeDescription = (descText: string) => {
    const length = descText.length;
    if (length === 0) {
      return { value: length, status: 'error', message: 'La meta description est manquante' };
    } else if (length < 120) {
      return { value: length, status: 'warning', message: 'La meta description est trop courte (< 120 caractères)' };
    } else if (length > 160) {
      return { value: length, status: 'warning', message: 'La meta description est trop longue (> 160 caractères)' };
    } else {
      return { value: length, status: 'good', message: 'Longueur de la meta description optimale' };
    }
  };

  const analyzeKeywordInTitle = (titleText: string, keywordText: string) => {
    if (!keywordText) {
      return { status: 'warning', message: 'Aucun mot-clé défini' };
    }
    
    const hasKeyword = titleText.toLowerCase().includes(keywordText.toLowerCase());
    if (hasKeyword) {
      return { status: 'good', message: 'Le mot-clé principal est présent dans le titre' };
    } else {
      return { status: 'warning', message: 'Le mot-clé principal devrait être dans le titre' };
    }
  };

  const analyzeKeywordInDescription = (descText: string, keywordText: string) => {
    if (!keywordText) {
      return { status: 'warning', message: 'Aucun mot-clé défini' };
    }
    
    const hasKeyword = descText.toLowerCase().includes(keywordText.toLowerCase());
    if (hasKeyword) {
      return { status: 'good', message: 'Le mot-clé principal est présent dans la description' };
    } else {
      return { status: 'warning', message: 'Le mot-clé principal devrait être dans la description' };
    }
  };

  const analyzeKeywordDensity = (density: number) => {
    if (density === 0) {
      return { value: density, status: 'warning', message: 'Le mot-clé principal n\'apparaît pas dans le contenu' };
    } else if (density < 1) {
      return { value: density, status: 'warning', message: 'Densité du mot-clé trop faible (< 1%)' };
    } else if (density > 3) {
      return { value: density, status: 'error', message: 'Densité du mot-clé trop élevée (> 3%) - risque de sur-optimisation' };
    } else {
      return { value: density, status: 'good', message: 'Densité du mot-clé optimale (1-3%)' };
    }
  };

  const analyzeContentLength = (words: number) => {
    if (words === 0) {
      return { value: words, status: 'error', message: 'Le contenu est vide' };
    } else if (words < 300) {
      return { value: words, status: 'warning', message: 'Contenu trop court pour un bon référencement (< 300 mots)' };
    } else if (words > 2000) {
      return { value: words, status: 'warning', message: 'Contenu très long, vérifiez la structure' };
    } else {
      return { value: words, status: 'good', message: 'Longueur de contenu appropriée' };
    }
  };

  const analyzeHeadingStructure = (text: string) => {
    const h1Count = (text.match(/^# /gm) || []).length;
    const h2Count = (text.match(/^## /gm) || []).length;
    
    if (h1Count === 0) {
      return { status: 'error', message: 'Aucun titre H1 trouvé' };
    } else if (h1Count > 1) {
      return { status: 'warning', message: 'Plusieurs titres H1 détectés, un seul est recommandé' };
    } else if (h2Count === 0) {
      return { status: 'warning', message: 'Aucun sous-titre H2 trouvé, ajoutez de la structure' };
    } else {
      return { status: 'good', message: 'Structure des titres correcte' };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Méta-données</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="keyword">Mot-clé principal</Label>
              <Input
                id="keyword"
                placeholder="ex: référencement naturel"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="title">Titre de la page</Label>
              <Input
                id="title"
                placeholder="Titre SEO de votre page"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="text-xs text-gray-500 mt-1">
                {title.length}/60 caractères
              </div>
            </div>
            <div>
              <Label htmlFor="description">Meta description</Label>
              <Textarea
                id="description"
                placeholder="Description qui apparaîtra dans les résultats de recherche"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
              <div className="text-xs text-gray-500 mt-1">
                {description.length}/160 caractères
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contenu</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Collez le contenu de votre page ici..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full"
            />
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>{analysis.stats.words} mots</span>
              <span>{analysis.stats.readingTime} min de lecture</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEO Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Search className="w-4 h-4" />
            Score SEO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>
              {analysis.score}/100
            </div>
            <Badge variant="outline" className="mt-2">
              {analysis.score >= 80 ? 'Excellent' : 
               analysis.score >= 60 ? 'Bon' : 
               analysis.score >= 40 ? 'Moyen' : 'À améliorer'}
            </Badge>
          </div>
          <Progress value={analysis.score} className="h-3" />
        </CardContent>
      </Card>

      {/* SEO Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-4 h-4" />
            Facteurs SEO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(analysis.seoFactors).map(([key, factor]) => (
              <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(factor.status)}
                  <span className="text-sm font-medium">
                    {key === 'titleLength' ? 'Longueur du titre' :
                     key === 'descriptionLength' ? 'Longueur de la description' :
                     key === 'keywordInTitle' ? 'Mot-clé dans le titre' :
                     key === 'keywordInDescription' ? 'Mot-clé dans la description' :
                     key === 'keywordDensity' ? 'Densité du mot-clé' :
                     key === 'contentLength' ? 'Longueur du contenu' :
                     key === 'headingStructure' ? 'Structure des titres' : key}
                  </span>
                </div>
                <div className="text-right">
                  {factor.value !== undefined && (
                    <div className="text-sm font-bold">
                      {typeof factor.value === 'number' ? 
                        (key === 'keywordDensity' ? `${factor.value}%` : factor.value) : 
                        factor.value}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">{factor.message}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Issues and Suggestions */}
      {(analysis.issues.length > 0 || analysis.suggestions.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {analysis.issues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-red-600">
                  Problèmes à corriger ({analysis.issues.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.issues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{issue}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {analysis.suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-yellow-600">
                  Suggestions d'amélioration ({analysis.suggestions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Statistiques du contenu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{analysis.stats.words}</div>
              <div className="text-xs text-gray-600">Mots</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-lg font-bold text-green-600">{analysis.keywordDensity}%</div>
              <div className="text-xs text-gray-600">Densité mot-clé</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{analysis.readabilityScore}</div>
              <div className="text-xs text-gray-600">Lisibilité</div>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div className="text-lg font-bold text-orange-600">{analysis.stats.readingTime}</div>
              <div className="text-xs text-gray-600">Min lecture</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
