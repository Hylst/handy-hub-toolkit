
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Copy, Shuffle, Wand2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TextGeneratorProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const TextGenerator = ({ data, onDataChange }: TextGeneratorProps) => {
  const [generatorType, setGeneratorType] = useState(data.generatorType || 'lorem');
  const [length, setLength] = useState(data.length || [5]);
  const [customSeed, setCustomSeed] = useState(data.customSeed || '');
  const [generatedText, setGeneratedText] = useState(data.generatedText || '');

  useEffect(() => {
    onDataChange({ generatorType, length, customSeed, generatedText });
  }, [generatorType, length, customSeed, generatedText]);

  const generateText = () => {
    let result = '';
    const count = length[0];

    switch (generatorType) {
      case 'lorem':
        result = generateLorem(count);
        break;
      case 'words':
        result = generateRandomWords(count);
        break;
      case 'sentences':
        result = generateRandomSentences(count);
        break;
      case 'paragraphs':
        result = generateRandomParagraphs(count);
        break;
      case 'password':
        result = generatePasswords(count);
        break;
      case 'usernames':
        result = generateUsernames(count);
        break;
      case 'emails':
        result = generateEmails(count);
        break;
      case 'dates':
        result = generateDates(count);
        break;
      case 'numbers':
        result = generateNumbers(count);
        break;
      case 'addresses':
        result = generateAddresses(count);
        break;
      case 'custom':
        result = generateFromSeed(customSeed, count);
        break;
      default:
        result = generateLorem(count);
    }

    setGeneratedText(result);
    toast({
      title: "Texte généré",
      description: `${count} éléments générés avec succès`,
    });
  };

  const generateLorem = (paragraphs: number): string => {
    const loremText = [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
      "Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt.",
      "Explicabo nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
      "Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam."
    ];
    
    return Array.from({ length: paragraphs }, (_, i) => 
      loremText[i % loremText.length]
    ).join('\n\n');
  };

  const generateRandomWords = (count: number): string => {
    const words = [
      'ordinateur', 'téléphone', 'voiture', 'maison', 'jardin', 'livre', 'musique', 'voyage',
      'travail', 'famille', 'ami', 'restaurant', 'café', 'école', 'université', 'médecin',
      'sport', 'cinema', 'théâtre', 'montagne', 'mer', 'ville', 'campagne', 'couleur',
      'animal', 'chat', 'chien', 'oiseau', 'fleur', 'arbre', 'soleil', 'lune', 'étoile'
    ];
    
    return Array.from({ length: count }, () => 
      words[Math.floor(Math.random() * words.length)]
    ).join(' ');
  };

  const generateRandomSentences = (count: number): string => {
    const subjects = ['Le chat', 'La voiture', 'Mon ami', 'La maison', 'L\'ordinateur'];
    const verbs = ['mange', 'court', 'travaille', 'brille', 'fonctionne'];
    const objects = ['rapidement', 'lentement', 'bien', 'parfaitement', 'efficacement'];
    
    return Array.from({ length: count }, () => {
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const verb = verbs[Math.floor(Math.random() * verbs.length)];
      const object = objects[Math.floor(Math.random() * objects.length)];
      return `${subject} ${verb} ${object}.`;
    }).join(' ');
  };

  const generateRandomParagraphs = (count: number): string => {
    return Array.from({ length: count }, () => 
      generateRandomSentences(Math.floor(Math.random() * 5) + 3)
    ).join('\n\n');
  };

  const generatePasswords = (count: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    return Array.from({ length: count }, () => 
      Array.from({ length: 12 }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      ).join('')
    ).join('\n');
  };

  const generateUsernames = (count: number): string => {
    const prefixes = ['user', 'admin', 'test', 'demo', 'guest', 'client'];
    const suffixes = ['123', '456', '789', 'pro', 'dev', 'web'];
    
    return Array.from({ length: count }, () => {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      return `${prefix}_${suffix}`;
    }).join('\n');
  };

  const generateEmails = (count: number): string => {
    const names = ['jean', 'marie', 'paul', 'claire', 'luc', 'anne'];
    const domains = ['example.com', 'test.fr', 'demo.org', 'sample.net'];
    
    return Array.from({ length: count }, () => {
      const name = names[Math.floor(Math.random() * names.length)];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const number = Math.floor(Math.random() * 100);
      return `${name}${number}@${domain}`;
    }).join('\n');
  };

  const generateDates = (count: number): string => {
    return Array.from({ length: count }, () => {
      const start = new Date(2020, 0, 1);
      const end = new Date(2024, 11, 31);
      const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      return date.toLocaleDateString('fr-FR');
    }).join('\n');
  };

  const generateNumbers = (count: number): string => {
    return Array.from({ length: count }, () => 
      Math.floor(Math.random() * 10000).toString()
    ).join('\n');
  };

  const generateAddresses = (count: number): string => {
    const streets = ['Rue de la Paix', 'Avenue des Champs', 'Boulevard Saint-Germain', 'Place Vendôme'];
    const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Bordeaux'];
    
    return Array.from({ length: count }, () => {
      const number = Math.floor(Math.random() * 200) + 1;
      const street = streets[Math.floor(Math.random() * streets.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const zip = Math.floor(Math.random() * 90000) + 10000;
      return `${number} ${street}, ${zip} ${city}`;
    }).join('\n');
  };

  const generateFromSeed = (seed: string, count: number): string => {
    if (!seed.trim()) return '';
    
    const words = seed.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return '';
    
    return Array.from({ length: count }, () => 
      words[Math.floor(Math.random() * words.length)]
    ).join(' ');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      toast({
        title: "Copié !",
        description: "Le texte généré a été copié dans le presse-papiers",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le texte",
        variant: "destructive",
      });
    }
  };

  const generatorOptions = [
    { value: 'lorem', label: 'Lorem Ipsum', description: 'Texte de remplissage classique' },
    { value: 'words', label: 'Mots aléatoires', description: 'Mots français aléatoires' },
    { value: 'sentences', label: 'Phrases', description: 'Phrases complètes' },
    { value: 'paragraphs', label: 'Paragraphes', description: 'Paragraphes complets' },
    { value: 'password', label: 'Mots de passe', description: 'Mots de passe sécurisés' },
    { value: 'usernames', label: 'Noms d\'utilisateur', description: 'Noms d\'utilisateur fictifs' },
    { value: 'emails', label: 'Emails', description: 'Adresses email fictives' },
    { value: 'dates', label: 'Dates', description: 'Dates aléatoires' },
    { value: 'numbers', label: 'Nombres', description: 'Nombres aléatoires' },
    { value: 'addresses', label: 'Adresses', description: 'Adresses françaises fictives' },
    { value: 'custom', label: 'Personnalisé', description: 'Basé sur vos mots' }
  ];

  const getUnitLabel = () => {
    switch (generatorType) {
      case 'lorem':
      case 'paragraphs':
        return 'paragraphes';
      case 'words':
        return 'mots';
      case 'sentences':
        return 'phrases';
      default:
        return 'éléments';
    }
  };

  return (
    <div className="space-y-6">
      {/* Generator Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wand2 className="w-4 h-4" />
            Paramètres du générateur
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label>Type de génération</Label>
              <Select value={generatorType} onValueChange={setGeneratorType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {generatorOptions.map((option) => (
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

            <div>
              <Label>Quantité ({getUnitLabel()})</Label>
              <div className="space-y-2">
                <Slider
                  value={length}
                  onValueChange={setLength}
                  max={generatorType === 'words' ? 100 : 20}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-500">
                  {length[0]} {getUnitLabel()}
                </div>
              </div>
            </div>
          </div>

          {generatorType === 'custom' && (
            <div>
              <Label>Mots source (séparés par des espaces)</Label>
              <Input
                placeholder="chat chien oiseau maison voiture..."
                value={customSeed}
                onChange={(e) => setCustomSeed(e.target.value)}
              />
            </div>
          )}

          <Button onClick={generateText} className="w-full">
            <Shuffle className="w-4 h-4 mr-2" />
            Générer le texte
          </Button>
        </CardContent>
      </Card>

      {/* Generated Text */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Texte généré</CardTitle>
          {generatedText && (
            <Button size="sm" variant="outline" onClick={copyToClipboard}>
              <Copy className="w-4 h-4 mr-2" />
              Copier
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Textarea
            value={generatedText}
            readOnly
            rows={12}
            className="w-full font-mono text-sm bg-gray-50 dark:bg-gray-900"
            placeholder="Le texte généré apparaîtra ici..."
          />
          {generatedText && (
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>{generatedText.length} caractères</span>
              <span>{generatedText.split(/\s+/).length} mots</span>
            </div>
          )}
        </CardContent>
      </Card>

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
              onClick={() => { setGeneratorType('lorem'); setLength([3]); generateText(); }}
            >
              Lorem court
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setGeneratorType('words'); setLength([20]); generateText(); }}
            >
              20 mots
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setGeneratorType('password'); setLength([5]); generateText(); }}
            >
              5 mots de passe
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setGeneratorType('emails'); setLength([10]); generateText(); }}
            >
              10 emails
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
