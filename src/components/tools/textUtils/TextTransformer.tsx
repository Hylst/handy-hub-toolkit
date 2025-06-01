
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shuffle, Copy, ArrowUpDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TextTransformerProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const TextTransformer = ({ data, onDataChange }: TextTransformerProps) => {
  const [text, setText] = useState(data.text || '');
  const [transformedTexts, setTransformedTexts] = useState<{[key: string]: string}>({});

  useEffect(() => {
    onDataChange({ ...data, text, transformedTexts });
  }, [text, transformedTexts]);

  useEffect(() => {
    if (text) {
      performTransformations(text);
    }
  }, [text]);

  const performTransformations = (inputText: string) => {
    const transforms = {
      uppercase: inputText.toUpperCase(),
      lowercase: inputText.toLowerCase(),
      titleCase: inputText.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      ),
      sentenceCase: inputText.charAt(0).toUpperCase() + inputText.slice(1).toLowerCase(),
      camelCase: inputText
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        ).replace(/\s+/g, ''),
      pascalCase: inputText
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
        .replace(/\s+/g, ''),
      snakeCase: inputText.replace(/\W+/g, ' ')
        .split(/ |\B(?=[A-Z])/)
        .map(word => word.toLowerCase())
        .join('_'),
      kebabCase: inputText.replace(/\W+/g, ' ')
        .split(/ |\B(?=[A-Z])/)
        .map(word => word.toLowerCase())
        .join('-'),
      reverse: inputText.split('').reverse().join(''),
      reverseWords: inputText.split(' ').reverse().join(' '),
      alternatingCase: inputText
        .split('')
        .map((char, index) => 
          index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        ).join(''),
      removeVowels: inputText.replace(/[aeiouAEIOU]/g, ''),
      removeConsonants: inputText.replace(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g, ''),
      removeNumbers: inputText.replace(/[0-9]/g, ''),
      removeSpecialChars: inputText.replace(/[^a-zA-Z0-9\s]/g, ''),
      doubleSpace: inputText.replace(/ /g, '  '),
      singleSpace: inputText.replace(/\s+/g, ' '),
      rot13: inputText.replace(/[a-zA-Z]/g, (char) => {
        const start = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
      }),
      morse: textToMorse(inputText),
      binary: textToBinary(inputText),
      base64: btoa(inputText),
      slugify: inputText
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, ''),
      wordCount: `Mots: ${inputText.trim().split(/\s+/).length}, Caractères: ${inputText.length}`,
      firstLetters: inputText.split(' ').map(word => word.charAt(0)).join(''),
      lastLetters: inputText.split(' ').map(word => word.charAt(word.length - 1)).join('')
    };

    setTransformedTexts(transforms);
  };

  const textToMorse = (text: string): string => {
    const morseCode: {[key: string]: string} = {
      'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
      'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
      'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
      'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
      'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
      '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
      '8': '---..', '9': '----.', ' ': '/'
    };
    
    return text.toUpperCase().split('').map(char => morseCode[char] || char).join(' ');
  };

  const textToBinary = (text: string): string => {
    return text.split('').map(char => 
      char.charCodeAt(0).toString(2).padStart(8, '0')
    ).join(' ');
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copié !",
        description: `${label} copié dans le presse-papiers`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le texte",
        variant: "destructive",
      });
    }
  };

  const transformations = [
    { key: 'uppercase', label: 'MAJUSCULES', category: 'Casse' },
    { key: 'lowercase', label: 'minuscules', category: 'Casse' },
    { key: 'titleCase', label: 'Première Lettre Majuscule', category: 'Casse' },
    { key: 'sentenceCase', label: 'Phrase normale', category: 'Casse' },
    { key: 'alternatingCase', label: 'CaSe AlTeRnÉe', category: 'Casse' },
    { key: 'camelCase', label: 'camelCase', category: 'Programmation' },
    { key: 'pascalCase', label: 'PascalCase', category: 'Programmation' },
    { key: 'snakeCase', label: 'snake_case', category: 'Programmation' },
    { key: 'kebabCase', label: 'kebab-case', category: 'Programmation' },
    { key: 'slugify', label: 'url-slug', category: 'Programmation' },
    { key: 'reverse', label: 'Texte inversé', category: 'Manipulation' },
    { key: 'reverseWords', label: 'Mots inversés', category: 'Manipulation' },
    { key: 'firstLetters', label: 'Premières lettres', category: 'Manipulation' },
    { key: 'lastLetters', label: 'Dernières lettres', category: 'Manipulation' },
    { key: 'removeVowels', label: 'Sans voyelles', category: 'Filtres' },
    { key: 'removeConsonants', label: 'Sans consonnes', category: 'Filtres' },
    { key: 'removeNumbers', label: 'Sans chiffres', category: 'Filtres' },
    { key: 'removeSpecialChars', label: 'Sans caractères spéciaux', category: 'Filtres' },
    { key: 'rot13', label: 'ROT13', category: 'Encodage' },
    { key: 'morse', label: 'Code Morse', category: 'Encodage' },
    { key: 'binary', label: 'Binaire', category: 'Encodage' },
    { key: 'base64', label: 'Base64', category: 'Encodage' },
    { key: 'wordCount', label: 'Statistiques', category: 'Analyse' }
  ];

  const categories = [...new Set(transformations.map(t => t.category))];

  return (
    <div className="space-y-6">
      {/* Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shuffle className="w-4 h-4" />
            Texte à transformer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Saisissez votre texte ici..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Transformations by Category */}
      {text && categories.map(category => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Badge variant="outline">{category}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {transformations
                .filter(t => t.category === category)
                .map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">{label}</label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(transformedTexts[key] || '', label)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded border text-sm font-mono break-all">
                    {transformedTexts[key] || ''}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {!text && (
        <Card>
          <CardContent className="p-8 text-center">
            <Shuffle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prêt à transformer
            </h3>
            <p className="text-gray-500">
              Saisissez du texte ci-dessus pour voir toutes les transformations disponibles.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
