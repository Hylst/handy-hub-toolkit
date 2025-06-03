import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Smile, Copy, Search, Heart, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EmojiManagerProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const EmojiManager = ({ data, onDataChange }: EmojiManagerProps) => {
  const [text, setText] = useState(data.text || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [processedText, setProcessedText] = useState('');

  useEffect(() => {
    onDataChange({ ...data, text, processedText });
  }, [text, processedText]);

  const emojiCategories = {
    'Visages': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
    'Émotions': ['😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤐', '🥴', '😵', '🤢', '🤮', '🤧', '😷', '🤒', '🤕'],
    'Nature': ['🌸', '🌺', '🌻', '🌷', '🌹', '🥀', '🌾', '🌿', '🍀', '🍃', '🌳', '🌲', '🌴', '🌵', '🌶️', '🍄', '🌰', '🦋', '🐝', '🐞', '🦗', '🕷️', '🦟', '🦠', '💐', '🌈', '☀️', '🌙', '⭐', '✨'],
    'Nourriture': ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🍞'],
    'Objets': ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️'],
    'Symboles': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐']
  };

  const allEmojis = Object.values(emojiCategories).flat();

  const filteredEmojis = searchTerm 
    ? allEmojis.filter(emoji => {
        // Recherche basique par nom d'emoji
        const emojiNames: {[key: string]: string} = {
          '😀': 'sourire content heureux',
          '😢': 'pleure triste larme',
          '❤️': 'coeur amour rouge',
          '🌸': 'fleur rose cerisier',
          '🍎': 'pomme rouge fruit',
          '⌚': 'montre temps heure'
        };
        return emojiNames[emoji]?.includes(searchTerm.toLowerCase()) || false;
      })
    : [];

  const addEmoji = (emoji: string) => {
    setText(prev => prev + emoji);
    toast({
      title: "Emoji ajouté",
      description: `${emoji} a été ajouté au texte`,
    });
  };

  const processText = () => {
    let processed = text;

    // Conversion des codes emoji
    const emojiCodes: {[key: string]: string} = {
      ':)': '😊',
      ':-)': '😊',
      ':(': '😢',
      ':-(': '😢',
      ':D': '😃',
      ':-D': '😃',
      ':P': '😛',
      ':-P': '😛',
      ';)': '😉',
      ';-)': '😉',
      ':/': '😕',
      ':-/': '😕',
      ':o': '😮',
      ':-o': '😮',
      '<3': '❤️',
      '</3': '💔'
    };

    Object.entries(emojiCodes).forEach(([code, emoji]) => {
      processed = processed.replace(new RegExp(escapeRegExp(code), 'g'), emoji);
    });

    // Conversion des noms d'emoji
    processed = processed.replace(/:([a-z_]+):/g, (match, name) => {
      const namedEmojis: {[key: string]: string} = {
        'heart': '❤️',
        'smile': '😊',
        'sad': '😢',
        'laugh': '😂',
        'love': '😍',
        'star': '⭐',
        'fire': '🔥',
        'thumbs_up': '👍',
        'thumbs_down': '👎',
        'ok': '👌'
      };
      return namedEmojis[name] || match;
    });

    setProcessedText(processed);
    toast({
      title: "Texte traité",
      description: "Les codes emoji ont été convertis",
    });
  };

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const copyProcessedText = async () => {
    try {
      await navigator.clipboard.writeText(processedText || text);
      toast({
        title: "Texte copié",
        description: "Le texte avec emojis a été copié",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le texte",
        variant: "destructive",
      });
    }
  };

  const removeAllEmojis = () => {
    // Using character class ranges for better TypeScript compatibility
    const emojiRegex = /[\uD83C-\uDBFF\uDC00-\uDFFF]|[\u2600-\u27BF]/g;
    const textWithoutEmojis = text.replace(emojiRegex, '');
    setText(textWithoutEmojis);
    toast({
      title: "Emojis supprimés",
      description: "Tous les emojis ont été supprimés du texte",
    });
  };

  return (
    <div className="space-y-4">
      {/* Palette d'emojis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Smile className="w-4 h-4" />
            Palette d'emojis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Rechercher un emoji..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button onClick={processText} variant="outline">
              Convertir codes
            </Button>
          </div>

          {searchTerm ? (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Résultats de recherche</h4>
              <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 gap-1">
                {filteredEmojis.map((emoji, index) => (
                  <Button
                    key={index}
                    onClick={() => addEmoji(emoji)}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 text-lg hover:scale-110 transition-transform"
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            Object.entries(emojiCategories).map(([category, emojis]) => (
              <div key={category} className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Badge variant="outline">{category}</Badge>
                </h4>
                <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 gap-1">
                  {emojis.map((emoji, index) => (
                    <Button
                      key={index}
                      onClick={() => addEmoji(emoji)}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 text-lg hover:scale-110 transition-transform"
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Zone de texte */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Texte avec emojis</CardTitle>
            <Button onClick={removeAllEmojis} variant="outline" size="sm">
              Supprimer emojis
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Tapez votre texte ici... Utilisez :) :( :D <3 ou :nom_emoji:"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              className="text-lg"
            />
            <div className="mt-2 text-xs text-gray-500">
              Codes supportés: :) :( :D :P ;) <3 ou :nom_emoji:
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Aperçu</CardTitle>
            <Button onClick={copyProcessedText} variant="outline" size="sm">
              <Copy className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-48 overflow-auto p-3 bg-gray-50 dark:bg-gray-900 rounded border text-lg whitespace-pre-wrap">
              {processedText || text || 'L\'aperçu apparaîtra ici...'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guide rapide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Guide rapide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium mb-2">Codes texte</h5>
              <div className="space-y-1">
                <div>:) → 😊</div>
                <div>:( → 😢</div>
                <div>:D → 😃</div>
                <div>&lt;3 → ❤️</div>
              </div>
            </div>
            <div>
              <h5 className="font-medium mb-2">Codes nommés</h5>
              <div className="space-y-1">
                <div>:heart: → ❤️</div>
                <div>:smile: → 😊</div>
                <div>:star: → ⭐</div>
                <div>:fire: → 🔥</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
