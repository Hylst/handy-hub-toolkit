
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Type, Copy, RotateCcw, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TextFormatterProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const TextFormatter = ({ data, onDataChange }: TextFormatterProps) => {
  const [inputText, setInputText] = useState(data.inputText || '');
  const [outputText, setOutputText] = useState(data.outputText || '');
  const [selectedFormat, setSelectedFormat] = useState(data.selectedFormat || 'clean');

  useEffect(() => {
    onDataChange({ ...data, inputText, outputText, selectedFormat });
  }, [inputText, outputText, selectedFormat]);

  const formatOptions = [
    { value: 'clean', label: 'Nettoyer le texte', description: 'Supprime espaces multiples, tabs, retours à la ligne' },
    { value: 'normalize', label: 'Normaliser', description: 'Uniforme la ponctuation et les espaces' },
    { value: 'paragraph', label: 'Paragraphes', description: 'Formate en paragraphes propres' },
    { value: 'list', label: 'Liste', description: 'Convertit en liste à puces' },
    { value: 'numberedList', label: 'Liste numérotée', description: 'Convertit en liste numérotée' },
    { value: 'quotes', label: 'Citations', description: 'Formate comme des citations' },
    { value: 'code', label: 'Code', description: 'Formate comme du code' },
    { value: 'table', label: 'Tableau', description: 'Convertit en tableau markdown' },
    { value: 'removeLineBreaks', label: 'Supprimer retours ligne', description: 'Supprime tous les retours à la ligne' },
    { value: 'addLineBreaks', label: 'Ajouter retours ligne', description: 'Ajoute des retours à la ligne' },
    { value: 'removeExtraSpaces', label: 'Supprimer espaces', description: 'Supprime les espaces en trop' },
    { value: 'trimLines', label: 'Nettoyer lignes', description: 'Supprime espaces début/fin de chaque ligne' }
  ];

  const applyFormat = () => {
    let result = inputText;

    switch (selectedFormat) {
      case 'clean':
        result = inputText
          .replace(/\s+/g, ' ')
          .replace(/\n\s*\n/g, '\n\n')
          .trim();
        break;

      case 'normalize':
        result = inputText
          .replace(/[""]/g, '"')
          .replace(/['']/g, "'")
          .replace(/…/g, '...')
          .replace(/\s+/g, ' ')
          .replace(/\s*([,.!?;:])\s*/g, '$1 ')
          .replace(/\s+$/gm, '')
          .trim();
        break;

      case 'paragraph':
        result = inputText
          .split(/\n\s*\n/)
          .map(p => p.replace(/\s+/g, ' ').trim())
          .filter(p => p.length > 0)
          .join('\n\n');
        break;

      case 'list':
        result = inputText
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .map(line => `• ${line}`)
          .join('\n');
        break;

      case 'numberedList':
        result = inputText
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .map((line, index) => `${index + 1}. ${line}`)
          .join('\n');
        break;

      case 'quotes':
        result = inputText
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .map(line => `> ${line}`)
          .join('\n');
        break;

      case 'code':
        result = '```\n' + inputText + '\n```';
        break;

      case 'table':
        const lines = inputText.split('\n').filter(line => line.trim());
        if (lines.length > 0) {
          const maxCols = Math.max(...lines.map(line => line.split(/\s{2,}|\t/).length));
          const header = lines[0].split(/\s{2,}|\t/).slice(0, maxCols);
          const separator = header.map(() => '---').join(' | ');
          const rows = lines.slice(1).map(line => 
            line.split(/\s{2,}|\t/).slice(0, maxCols).join(' | ')
          );
          result = [
            header.join(' | '),
            separator,
            ...rows
          ].join('\n');
        }
        break;

      case 'removeLineBreaks':
        result = inputText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        break;

      case 'addLineBreaks':
        result = inputText.replace(/([.!?])\s+/g, '$1\n').trim();
        break;

      case 'removeExtraSpaces':
        result = inputText.replace(/\s+/g, ' ').trim();
        break;

      case 'trimLines':
        result = inputText
          .split('\n')
          .map(line => line.trim())
          .join('\n');
        break;

      default:
        result = inputText;
    }

    setOutputText(result);
    toast({
      title: "Formatage appliqué",
      description: `Le texte a été formaté avec "${formatOptions.find(f => f.value === selectedFormat)?.label}"`,
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      toast({
        title: "Copié !",
        description: "Le texte formaté a été copié dans le presse-papiers",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le texte",
        variant: "destructive",
      });
    }
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
  };

  const swapTexts = () => {
    setInputText(outputText);
    setOutputText(inputText);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Type className="w-4 h-4" />
            Options de formatage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Type de formatage</label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un format" />
                </SelectTrigger>
                <SelectContent>
                  {formatOptions.map((option) => (
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
            <div className="flex items-end gap-2">
              <Button onClick={applyFormat} className="flex-1">
                <Zap className="w-4 h-4 mr-2" />
                Appliquer
              </Button>
              <Button variant="outline" onClick={swapTexts}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={clearAll}>
                Effacer
              </Button>
            </div>
          </div>

          {selectedFormat && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Badge variant="outline" className="mb-2">
                {formatOptions.find(f => f.value === selectedFormat)?.label}
              </Badge>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatOptions.find(f => f.value === selectedFormat)?.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Input/Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Texte original</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Collez votre texte ici..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={12}
              className="w-full font-mono text-sm"
            />
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>{inputText.length} caractères</span>
              <span>{inputText.split('\n').length} lignes</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Texte formaté</CardTitle>
            {outputText && (
              <Button size="sm" variant="outline" onClick={copyToClipboard}>
                <Copy className="w-4 h-4 mr-2" />
                Copier
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <Textarea
              value={outputText}
              readOnly
              rows={12}
              className="w-full font-mono text-sm bg-gray-50 dark:bg-gray-900"
              placeholder="Le texte formaté apparaîtra ici..."
            />
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>{outputText.length} caractères</span>
              <span>{outputText.split('\n').length} lignes</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button variant="outline" size="sm" onClick={() => { setSelectedFormat('clean'); applyFormat(); }}>
              Nettoyer
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setSelectedFormat('normalize'); applyFormat(); }}>
              Normaliser
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setSelectedFormat('paragraph'); applyFormat(); }}>
              Paragraphes
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setSelectedFormat('list'); applyFormat(); }}>
              Liste
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
