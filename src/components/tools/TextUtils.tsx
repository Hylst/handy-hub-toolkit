
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const TextUtils = () => {
  const [text, setText] = useState("");

  const getTextStats = () => {
    if (!text) return { characters: 0, charactersNoSpaces: 0, words: 0, lines: 0, paragraphs: 0 };
    
    return {
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, '').length,
      words: text.trim() ? text.trim().split(/\s+/).length : 0,
      lines: text.split('\n').length,
      paragraphs: text.split(/\n\s*\n/).filter(p => p.trim()).length
    };
  };

  const transformText = (transformation: string) => {
    let result = "";
    switch (transformation) {
      case "uppercase":
        result = text.toUpperCase();
        break;
      case "lowercase":
        result = text.toLowerCase();
        break;
      case "title":
        result = text.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
      case "reverse":
        result = text.split('').reverse().join('');
        break;
      case "clean":
        result = text.replace(/\s+/g, ' ').trim();
        break;
      default:
        result = text;
    }
    
    setText(result);
    toast({
      title: "Texte transformé !",
      description: "La transformation a été appliquée avec succès.",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Texte copié !",
      description: "Le texte a été copié dans le presse-papiers.",
    });
  };

  const stats = getTextStats();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analyseur et Transformateur de Texte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              placeholder="Tapez ou collez votre texte ici..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-sm">
              <div>
                <p className="font-semibold text-gray-800">{stats.characters}</p>
                <p className="text-gray-600">Caractères</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">{stats.charactersNoSpaces}</p>
                <p className="text-gray-600">Sans espaces</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">{stats.words}</p>
                <p className="text-gray-600">Mots</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">{stats.lines}</p>
                <p className="text-gray-600">Lignes</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">{stats.paragraphs}</p>
                <p className="text-gray-600">Paragraphes</p>
              </div>
            </div>
            
            <Button onClick={copyToClipboard} variant="outline" disabled={!text}>
              <Copy className="w-4 h-4 mr-2" />
              Copier
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Transformations de Texte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <Button 
              variant="outline" 
              onClick={() => transformText("uppercase")}
              disabled={!text}
            >
              MAJUSCULES
            </Button>
            <Button 
              variant="outline" 
              onClick={() => transformText("lowercase")}
              disabled={!text}
            >
              minuscules
            </Button>
            <Button 
              variant="outline" 
              onClick={() => transformText("title")}
              disabled={!text}
            >
              Titre
            </Button>
            <Button 
              variant="outline" 
              onClick={() => transformText("reverse")}
              disabled={!text}
            >
              Inverser
            </Button>
            <Button 
              variant="outline" 
              onClick={() => transformText("clean")}
              disabled={!text}
            >
              Nettoyer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
