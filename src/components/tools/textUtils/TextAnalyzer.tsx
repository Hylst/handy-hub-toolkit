
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Eye, Clock } from 'lucide-react';

interface TextAnalyzerProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const TextAnalyzer = ({ data, onDataChange }: TextAnalyzerProps) => {
  const [text, setText] = useState(data.text || '');
  const [analysis, setAnalysis] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    readabilityScore: 0,
    sentiment: 'neutral',
    keywordDensity: [],
    avgWordsPerSentence: 0,
    avgCharsPerWord: 0
  });

  useEffect(() => {
    if (text !== data.text) {
      onDataChange({ ...data, text });
    }
  }, [text]);

  useEffect(() => {
    analyzeText(text);
  }, [text]);

  const analyzeText = (inputText: string) => {
    const characters = inputText.length;
    const charactersNoSpaces = inputText.replace(/\s/g, '').length;
    const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = inputText.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    
    // Temps de lecture (250 mots par minute)
    const readingTime = Math.ceil(words / 250);
    
    // Score de lisibilité simplifié
    const avgWordsPerSentence = sentences > 0 ? words / sentences : 0;
    const avgCharsPerWord = words > 0 ? charactersNoSpaces / words : 0;
    const readabilityScore = Math.max(0, Math.min(100, 
      100 - (avgWordsPerSentence * 1.5) - (avgCharsPerWord * 2)
    ));

    // Analyse de sentiment simplifiée
    const positiveWords = ['bon', 'bien', 'excellent', 'parfait', 'génial', 'super', 'formidable'];
    const negativeWords = ['mauvais', 'mal', 'terrible', 'horrible', 'nul', 'pire'];
    const wordList = inputText.toLowerCase().split(/\W+/);
    const positiveCount = wordList.filter(word => positiveWords.includes(word)).length;
    const negativeCount = wordList.filter(word => negativeWords.includes(word)).length;
    let sentiment = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';

    // Densité des mots-clés
    const wordFreq: { [key: string]: number } = {};
    wordList.forEach(word => {
      if (word.length > 3) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });
    const keywordDensity = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word, count]) => ({ word, count, density: (count / words * 100).toFixed(1) }));

    setAnalysis({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
      readabilityScore: Math.round(readabilityScore),
      sentiment,
      keywordDensity,
      avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
      avgCharsPerWord: Math.round(avgCharsPerWord * 10) / 10
    });
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReadabilityColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="w-4 h-4" />
            Texte à analyser
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Saisissez votre texte ici pour l'analyser..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Basic Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{analysis.characters}</div>
            <div className="text-xs text-gray-600">Caractères</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{analysis.words}</div>
            <div className="text-xs text-gray-600">Mots</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{analysis.sentences}</div>
            <div className="text-xs text-gray-600">Phrases</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{analysis.paragraphs}</div>
            <div className="text-xs text-gray-600">Paragraphes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{analysis.readingTime}</div>
            <div className="text-xs text-gray-600">Min lecture</div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Readability & Sentiment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Eye className="w-4 h-4" />
              Lisibilité & Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Score de lisibilité</span>
                <span className={`text-sm font-bold ${getReadabilityColor(analysis.readabilityScore)}`}>
                  {analysis.readabilityScore}/100
                </span>
              </div>
              <Progress value={analysis.readabilityScore} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">
                Plus le score est élevé, plus le texte est facile à lire
              </p>
            </div>
            
            <div>
              <span className="text-sm font-medium">Sentiment détecté</span>
              <div className="mt-1">
                <Badge className={getSentimentColor(analysis.sentiment)}>
                  {analysis.sentiment === 'positive' ? '😊 Positif' : 
                   analysis.sentiment === 'negative' ? '😞 Négatif' : '😐 Neutre'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Mots/phrase</span>
                <div className="font-semibold">{analysis.avgWordsPerSentence}</div>
              </div>
              <div>
                <span className="text-gray-600">Chars/mot</span>
                <div className="font-semibold">{analysis.avgCharsPerWord}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Keywords */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-4 h-4" />
              Mots-clés fréquents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysis.keywordDensity.length > 0 ? (
              <div className="space-y-2">
                {analysis.keywordDensity.map((keyword, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{keyword.word}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {keyword.count}x ({keyword.density}%)
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min(100, parseFloat(keyword.density) * 10)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                Aucun mot-clé détecté. Ajoutez du texte pour voir l'analyse.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="w-4 h-4" />
            Statistiques détaillées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="font-semibold">{analysis.charactersNoSpaces}</div>
              <div className="text-xs text-gray-600">Caractères (sans espaces)</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="font-semibold">{Math.round((analysis.words / Math.max(1, analysis.paragraphs)) * 10) / 10}</div>
              <div className="text-xs text-gray-600">Mots par paragraphe</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="font-semibold">{Math.round((analysis.characters / Math.max(1, analysis.sentences)) * 10) / 10}</div>
              <div className="text-xs text-gray-600">Caractères par phrase</div>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div className="font-semibold">{Math.round((analysis.readingTime / Math.max(1, analysis.paragraphs)) * 10) / 10}</div>
              <div className="text-xs text-gray-600">Minutes par paragraphe</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
