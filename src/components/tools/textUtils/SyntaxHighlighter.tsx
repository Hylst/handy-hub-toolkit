
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Code, Copy, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SyntaxHighlighterProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const SyntaxHighlighter = ({ data, onDataChange }: SyntaxHighlighterProps) => {
  const [code, setCode] = useState(data.code || '');
  const [language, setLanguage] = useState(data.language || 'javascript');
  const [highlightedCode, setHighlightedCode] = useState('');

  useEffect(() => {
    onDataChange({ ...data, code, language, highlightedCode });
  }, [code, language, highlightedCode]);

  const languages = [
    { value: 'javascript', label: 'JavaScript', ext: 'js' },
    { value: 'typescript', label: 'TypeScript', ext: 'ts' },
    { value: 'python', label: 'Python', ext: 'py' },
    { value: 'java', label: 'Java', ext: 'java' },
    { value: 'css', label: 'CSS', ext: 'css' },
    { value: 'html', label: 'HTML', ext: 'html' },
    { value: 'json', label: 'JSON', ext: 'json' },
    { value: 'xml', label: 'XML', ext: 'xml' },
    { value: 'sql', label: 'SQL', ext: 'sql' },
    { value: 'bash', label: 'Bash', ext: 'sh' },
    { value: 'markdown', label: 'Markdown', ext: 'md' },
    { value: 'yaml', label: 'YAML', ext: 'yml' }
  ];

  const highlightSyntax = (text: string, lang: string) => {
    // Colorisation basique pour différents langages
    let highlighted = text;

    switch (lang) {
      case 'javascript':
      case 'typescript':
        highlighted = highlighted
          .replace(/\b(const|let|var|function|class|if|else|for|while|return|import|export|from|as|default)\b/g, '<span class="text-blue-600 font-semibold">$1</span>')
          .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-purple-600">$1</span>')
          .replace(/"([^"]*)"/g, '<span class="text-green-600">"$1"</span>')
          .replace(/'([^']*)'/g, '<span class="text-green-600">\'$1\'</span>')
          .replace(/\/\/.*$/gm, '<span class="text-gray-500 italic">$&</span>')
          .replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500 italic">$&</span>');
        break;

      case 'python':
        highlighted = highlighted
          .replace(/\b(def|class|if|else|elif|for|while|return|import|from|as|try|except|finally|with|pass|break|continue)\b/g, '<span class="text-blue-600 font-semibold">$1</span>')
          .replace(/\b(True|False|None)\b/g, '<span class="text-purple-600">$1</span>')
          .replace(/"([^"]*)"/g, '<span class="text-green-600">"$1"</span>')
          .replace(/'([^']*)'/g, '<span class="text-green-600">\'$1\'</span>')
          .replace(/#.*$/gm, '<span class="text-gray-500 italic">$&</span>');
        break;

      case 'html':
        highlighted = highlighted
          .replace(/&lt;(\/?[a-zA-Z][^&gt;]*)&gt;/g, '<span class="text-blue-600">&lt;$1&gt;</span>')
          .replace(/(\w+)=("[^"]*"|'[^']*')/g, '<span class="text-red-600">$1</span>=<span class="text-green-600">$2</span>');
        break;

      case 'css':
        highlighted = highlighted
          .replace(/([a-zA-Z-]+)(\s*:\s*)([^;]+);/g, '<span class="text-blue-600">$1</span>$2<span class="text-green-600">$3</span>;')
          .replace(/\{|\}/g, '<span class="text-purple-600">$&</span>');
        break;

      case 'json':
        highlighted = highlighted
          .replace(/"([^"]+)"(\s*:)/g, '<span class="text-blue-600">"$1"</span>$2')
          .replace(/:\s*"([^"]*)"/g, ': <span class="text-green-600">"$1"</span>')
          .replace(/:\s*(true|false|null|\d+)/g, ': <span class="text-purple-600">$1</span>');
        break;
    }

    return highlighted;
  };

  useEffect(() => {
    if (code) {
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      
      const highlighted = highlightSyntax(escapedCode, language);
      setHighlightedCode(highlighted);
    }
  }, [code, language]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Code copié",
        description: "Le code a été copié dans le presse-papiers",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le code",
        variant: "destructive",
      });
    }
  };

  const downloadCode = () => {
    const selectedLang = languages.find(l => l.value === language);
    const filename = `code.${selectedLang?.ext || 'txt'}`;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Téléchargement réussi",
      description: `Code téléchargé sous ${filename}`,
    });
  };

  const formatCode = () => {
    let formatted = code;
    
    try {
      if (language === 'json') {
        const parsed = JSON.parse(code);
        formatted = JSON.stringify(parsed, null, 2);
      } else {
        // Formatage basique pour autres langages
        formatted = code
          .replace(/;/g, ';\n')
          .replace(/\{/g, ' {\n')
          .replace(/\}/g, '\n}')
          .replace(/,/g, ',\n')
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .join('\n');
      }
      
      setCode(formatted);
      toast({
        title: "Code formaté",
        description: "Le code a été formaté automatiquement",
      });
    } catch (error) {
      toast({
        title: "Erreur de formatage",
        description: "Impossible de formater le code",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Code className="w-4 h-4" />
            Colorisation syntaxique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Langage</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>
                      <Badge variant="outline" className="mr-2">{lang.ext}</Badge>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 items-end">
              <Button onClick={formatCode} variant="outline" size="sm">
                Formater
              </Button>
              <Button onClick={copyCode} variant="outline" size="sm">
                <Copy className="w-4 h-4" />
              </Button>
              <Button onClick={downloadCode} variant="outline" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Input/Output */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Code source</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={`Collez votre code ${language} ici...`}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={16}
              className="font-mono text-sm"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Prévisualisation colorisée</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="h-80 overflow-auto p-3 bg-gray-50 dark:bg-gray-900 rounded border font-mono text-sm whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: highlightedCode || 'Le code colorisé apparaîtra ici...' }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
