
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, GitCompare, TrendingUp } from 'lucide-react';

interface TextComparatorProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const TextComparator = ({ data, onDataChange }: TextComparatorProps) => {
  const [text1, setText1] = useState(data.text1 || '');
  const [text2, setText2] = useState(data.text2 || '');
  const [comparison, setComparison] = useState({
    similarity: 0,
    differences: 0,
    commonWords: 0,
    uniqueWords1: 0,
    uniqueWords2: 0,
    lengthDiff: 0,
    wordsDiff: 0,
    stats: {
      text1: { chars: 0, words: 0, sentences: 0 },
      text2: { chars: 0, words: 0, sentences: 0 }
    },
    details: {
      commonWords: [],
      uniqueWords1: [],
      uniqueWords2: []
    }
  });

  useEffect(() => {
    onDataChange({ ...data, text1, text2, comparison });
  }, [text1, text2, comparison]);

  useEffect(() => {
    compareTexts(text1, text2);
  }, [text1, text2]);

  const compareTexts = (textA: string, textB: string) => {
    // Statistiques de base
    const stats1 = getTextStats(textA);
    const stats2 = getTextStats(textB);

    // Extraction des mots
    const words1 = getWords(textA);
    const words2 = getWords(textB);

    // Mots communs et uniques
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    const commonWords = [...set1].filter(word => set2.has(word));
    const uniqueWords1 = [...set1].filter(word => !set2.has(word));
    const uniqueWords2 = [...set2].filter(word => !set1.has(word));

    // Calcul de la similarité (Jaccard similarity)
    const union = new Set([...words1, ...words2]);
    const similarity = union.size > 0 ? (commonWords.length / union.size) * 100 : 0;

    // Différences
    const lengthDiff = Math.abs(textA.length - textB.length);
    const wordsDiff = Math.abs(words1.length - words2.length);
    const differences = uniqueWords1.length + uniqueWords2.length;

    setComparison({
      similarity: Math.round(similarity * 10) / 10,
      differences,
      commonWords: commonWords.length,
      uniqueWords1: uniqueWords1.length,
      uniqueWords2: uniqueWords2.length,
      lengthDiff,
      wordsDiff,
      stats: {
        text1: stats1,
        text2: stats2
      },
      details: {
        commonWords: commonWords.slice(0, 20), // Limite pour l'affichage
        uniqueWords1: uniqueWords1.slice(0, 20),
        uniqueWords2: uniqueWords2.slice(0, 20)
      }
    });
  };

  const getTextStats = (text: string) => {
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    return { chars, words, sentences };
  };

  const getWords = (text: string): string[] => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2); // Mots de plus de 2 caractères
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 80) return 'text-green-600';
    if (similarity >= 60) return 'text-yellow-600';
    if (similarity >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSimilarityLabel = (similarity: number) => {
    if (similarity >= 80) return 'Très similaire';
    if (similarity >= 60) return 'Assez similaire';
    if (similarity >= 40) return 'Peu similaire';
    return 'Très différent';
  };

  return (
    <div className="space-y-6">
      {/* Input Texts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Texte 1</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Collez le premier texte ici..."
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              rows={8}
              className="w-full"
            />
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>{comparison.stats.text1.chars} caractères</span>
              <span>{comparison.stats.text1.words} mots</span>
              <span>{comparison.stats.text1.sentences} phrases</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Texte 2</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Collez le second texte ici..."
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              rows={8}
              className="w-full"
            />
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>{comparison.stats.text2.chars} caractères</span>
              <span>{comparison.stats.text2.words} mots</span>
              <span>{comparison.stats.text2.sentences} phrases</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Similarity Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <GitCompare className="w-4 h-4" />
            Score de similarité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className={`text-4xl font-bold ${getSimilarityColor(comparison.similarity)}`}>
              {comparison.similarity}%
            </div>
            <Badge variant="outline" className="mt-2">
              {getSimilarityLabel(comparison.similarity)}
            </Badge>
          </div>
          <Progress value={comparison.similarity} className="h-3" />
          <p className="text-sm text-gray-500 text-center mt-2">
            Basé sur les mots communs entre les deux textes
          </p>
        </CardContent>
      </Card>

      {/* Comparison Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{comparison.commonWords}</div>
            <div className="text-xs text-gray-600">Mots communs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{comparison.uniqueWords1}</div>
            <div className="text-xs text-gray-600">Uniques au texte 1</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{comparison.uniqueWords2}</div>
            <div className="text-xs text-gray-600">Uniques au texte 2</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{comparison.differences}</div>
            <div className="text-xs text-gray-600">Total différences</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      {(text1 || text2) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Common Words */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Mots communs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {comparison.details.commonWords.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {comparison.details.commonWords.map((word, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {word}
                    </Badge>
                  ))}
                  {comparison.commonWords > 20 && (
                    <Badge variant="outline" className="text-xs">
                      +{comparison.commonWords - 20} autres
                    </Badge>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Aucun mot commun trouvé</p>
              )}
            </CardContent>
          </Card>

          {/* Unique to Text 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="w-4 h-4 text-blue-600" />
                Uniques au texte 1
              </CardTitle>
            </CardHeader>
            <CardContent>
              {comparison.details.uniqueWords1.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {comparison.details.uniqueWords1.map((word, index) => (
                    <Badge key={index} variant="outline" className="text-xs text-blue-600">
                      {word}
                    </Badge>
                  ))}
                  {comparison.uniqueWords1 > 20 && (
                    <Badge variant="outline" className="text-xs">
                      +{comparison.uniqueWords1 - 20} autres
                    </Badge>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Aucun mot unique</p>
              )}
            </CardContent>
          </Card>

          {/* Unique to Text 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="w-4 h-4 text-purple-600" />
                Uniques au texte 2
              </CardTitle>
            </CardHeader>
            <CardContent>
              {comparison.details.uniqueWords2.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {comparison.details.uniqueWords2.map((word, index) => (
                    <Badge key={index} variant="outline" className="text-xs text-purple-600">
                      {word}
                    </Badge>
                  ))}
                  {comparison.uniqueWords2 > 20 && (
                    <Badge variant="outline" className="text-xs">
                      +{comparison.uniqueWords2 - 20} autres
                    </Badge>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Aucun mot unique</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Differences Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Résumé des différences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Différence de longueur:</span>
                <span className="font-semibold">{comparison.lengthDiff} caractères</span>
              </div>
              <div className="flex justify-between">
                <span>Différence de mots:</span>
                <span className="font-semibold">{comparison.wordsDiff} mots</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Texte le plus long:</span>
                <span className="font-semibold">
                  {comparison.stats.text1.chars > comparison.stats.text2.chars ? 'Texte 1' : 
                   comparison.stats.text1.chars < comparison.stats.text2.chars ? 'Texte 2' : 'Égaux'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Plus de mots:</span>
                <span className="font-semibold">
                  {comparison.stats.text1.words > comparison.stats.text2.words ? 'Texte 1' : 
                   comparison.stats.text1.words < comparison.stats.text2.words ? 'Texte 2' : 'Égaux'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
