
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileDown, Copy, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TextExtractorProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const TextExtractor = ({ data, onDataChange }: TextExtractorProps) => {
  const [inputText, setInputText] = useState(data.inputText || '');
  const [extractionType, setExtractionType] = useState(data.extractionType || 'emails');
  const [extractedItems, setExtractedItems] = useState<string[]>([]);

  useEffect(() => {
    onDataChange({ ...data, inputText, extractionType, extractedItems });
  }, [inputText, extractionType, extractedItems]);

  useEffect(() => {
    if (inputText) {
      performExtraction(inputText, extractionType);
    } else {
      setExtractedItems([]);
    }
  }, [inputText, extractionType]);

  const performExtraction = (text: string, type: string) => {
    let results: string[] = [];

    switch (type) {
      case 'emails':
        results = extractEmails(text);
        break;
      case 'urls':
        results = extractUrls(text);
        break;
      case 'phones':
        results = extractPhones(text);
        break;
      case 'dates':
        results = extractDates(text);
        break;
      case 'numbers':
        results = extractNumbers(text);
        break;
      case 'hashtags':
        results = extractHashtags(text);
        break;
      case 'mentions':
        results = extractMentions(text);
        break;
      case 'ips':
        results = extractIPs(text);
        break;
      case 'domains':
        results = extractDomains(text);
        break;
      case 'sentences':
        results = extractSentences(text);
        break;
      case 'words':
        results = extractWords(text);
        break;
      case 'lines':
        results = extractLines(text);
        break;
      default:
        results = [];
    }

    // Supprimer les doublons et trier
    const uniqueResults = [...new Set(results)].sort();
    setExtractedItems(uniqueResults);
  };

  const extractEmails = (text: string): string[] => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    return text.match(emailRegex) || [];
  };

  const extractUrls = (text: string): string[] => {
    const urlRegex = /https?:\/\/[^\s]+/g;
    return text.match(urlRegex) || [];
  };

  const extractPhones = (text: string): string[] => {
    const phoneRegex = /(\+33|0)[1-9](?:[.\-\s]?\d{2}){4}/g;
    return text.match(phoneRegex) || [];
  };

  const extractDates = (text: string): string[] => {
    const dateRegex = /\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/g;
    return text.match(dateRegex) || [];
  };

  const extractNumbers = (text: string): string[] => {
    const numberRegex = /\b\d+(?:\.\d+)?\b/g;
    return text.match(numberRegex) || [];
  };

  const extractHashtags = (text: string): string[] => {
    const hashtagRegex = /#\w+/g;
    return text.match(hashtagRegex) || [];
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@\w+/g;
    return text.match(mentionRegex) || [];
  };

  const extractIPs = (text: string): string[] => {
    const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g;
    return text.match(ipRegex) || [];
  };

  const extractDomains = (text: string): string[] => {
    const domainRegex = /\b[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}\b/g;
    return text.match(domainRegex) || [];
  };

  const extractSentences = (text: string): string[] => {
    return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).map(s => s.trim());
  };

  const extractWords = (text: string): string[] => {
    return text.split(/\s+/).filter(word => word.length > 0);
  };

  const extractLines = (text: string): string[] => {
    return text.split('\n').filter(line => line.trim().length > 0);
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copié !",
        description: "Les éléments extraits ont été copiés",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le contenu",
        variant: "destructive",
      });
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Téléchargement",
      description: `Fichier ${filename} téléchargé`,
    });
  };

  const extractionOptions = [
    { value: 'emails', label: 'Emails', description: 'Adresses email' },
    { value: 'urls', label: 'URLs', description: 'Liens web' },
    { value: 'phones', label: 'Téléphones', description: 'Numéros de téléphone' },
    { value: 'dates', label: 'Dates', description: 'Dates (jj/mm/aaaa)' },
    { value: 'numbers', label: 'Nombres', description: 'Nombres et décimaux' },
    { value: 'hashtags', label: 'Hashtags', description: 'Tags (#example)' },
    { value: 'mentions', label: 'Mentions', description: 'Mentions (@username)' },
    { value: 'ips', label: 'IP', description: 'Adresses IP' },
    { value: 'domains', label: 'Domaines', description: 'Noms de domaine' },
    { value: 'sentences', label: 'Phrases', description: 'Phrases complètes' },
    { value: 'words', label: 'Mots', description: 'Mots individuels' },
    { value: 'lines', label: 'Lignes', description: 'Lignes non vides' }
  ];

  const exampleTexts = {
    emails: "Contactez-nous à contact@example.com ou support@test.fr pour plus d'informations.",
    urls: "Visitez https://www.google.com et https://github.com pour plus de ressources.",
    phones: "Appelez-nous au 01.23.45.67.89 ou au +33 6 12 34 56 78",
    dates: "Rendez-vous le 15/03/2024 ou le 20-12-2023 pour la réunion.",
    numbers: "Le prix est de 29.99€ et la quantité est 150 unités.",
    hashtags: "Suivez-nous sur #DigitalMarketing #SEO #WebDev pour les dernières nouvelles.",
    mentions: "Merci à @john_doe et @marie_martin pour leur contribution.",
    ips: "Serveurs: 192.168.1.1, 10.0.0.1 et 172.16.0.1",
    domains: "Visitez google.com, github.com et stackoverflow.com",
    sentences: "Première phrase. Deuxième phrase! Troisième phrase?",
    words: "Voici quelques mots séparés par des espaces",
    lines: "Première ligne\nDeuxième ligne\n\nQuatrième ligne"
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="w-4 h-4" />
            Extraction de données
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Type d'extraction</label>
              <Select value={extractionType} onValueChange={setExtractionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir le type" />
                </SelectTrigger>
                <SelectContent>
                  {extractionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => setInputText(exampleTexts[extractionType as keyof typeof exampleTexts] || '')}
                className="w-full"
              >
                Charger un exemple
              </Button>
            </div>
          </div>

          {extractionType && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Badge variant="outline" className="mb-2">
                {extractionOptions.find(o => o.value === extractionType)?.label}
              </Badge>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {extractionOptions.find(o => o.value === extractionType)?.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Input/Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Texte source</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Collez votre texte ici..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={12}
              className="w-full"
            />
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>{inputText.length} caractères</span>
              <span>{inputText.split('\n').length} lignes</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              Éléments extraits ({extractedItems.length})
            </CardTitle>
            {extractedItems.length > 0 && (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => copyToClipboard(extractedItems.join('\n'))}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copier
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => downloadFile(extractedItems.join('\n'), `extracted_${extractionType}.txt`)}
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {extractedItems.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {extractedItems.map((item, index) => (
                  <div key={index} className="p-2 bg-gray-50 dark:bg-gray-900 rounded border text-sm font-mono">
                    {item}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Filter className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Aucun élément extrait</p>
                <p className="text-sm">Ajoutez du texte pour voir les résultats</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      {extractedItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Statistiques d'extraction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{extractedItems.length}</div>
                <div className="text-xs text-gray-600">Éléments trouvés</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {new Set(extractedItems).size}
                </div>
                <div className="text-xs text-gray-600">Éléments uniques</div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {extractedItems.length - new Set(extractedItems).size}
                </div>
                <div className="text-xs text-gray-600">Doublons</div>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {extractedItems.reduce((sum, item) => sum + item.length, 0)}
                </div>
                <div className="text-xs text-gray-600">Caractères totaux</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setExtractionType('emails'); }}
            >
              Extraire emails
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setExtractionType('urls'); }}
            >
              Extraire URLs
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setExtractionType('phones'); }}
            >
              Extraire téléphones
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setExtractionType('numbers'); }}
            >
              Extraire nombres
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
