
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Copy, Download, Eye, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MarkdownEditorProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const MarkdownEditor = ({ data, onDataChange }: MarkdownEditorProps) => {
  const [markdown, setMarkdown] = useState(data.markdown || '');
  const [html, setHtml] = useState('');

  useEffect(() => {
    onDataChange({ ...data, markdown, html });
  }, [markdown, html]);

  const convertToHtml = (text: string): string => {
    let result = text;

    // Headers
    result = result.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    result = result.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    result = result.replace(/^# (.*$)/gm, '<h1>$1</h1>');

    // Bold and Italic
    result = result.replace(/\*\*\*(.*)\*\*\*/g, '<strong><em>$1</em></strong>');
    result = result.replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>');
    result = result.replace(/\*(.*)\*/g, '<em>$1</em>');

    // Links
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');

    // Images
    result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded" />');

    // Code blocks
    result = result.replace(/```([^`]+)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto"><code>$1</code></pre>');
    
    // Inline code
    result = result.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">$1</code>');

    // Lists
    result = result.replace(/^\* (.+)$/gm, '<li>$1</li>');
    result = result.replace(/(<li>.*<\/li>)/s, '<ul class="list-disc pl-6">$1</ul>');
    
    result = result.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    result = result.replace(/(<li>.*<\/li>)/s, '<ol class="list-decimal pl-6">$1</ol>');

    // Blockquotes
    result = result.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>');

    // Line breaks
    result = result.replace(/\n\n/g, '</p><p>');
    result = result.replace(/\n/g, '<br>');
    
    // Wrap in paragraphs
    if (result && !result.startsWith('<')) {
      result = '<p>' + result + '</p>';
    }

    return result;
  };

  useEffect(() => {
    if (markdown) {
      const converted = convertToHtml(markdown);
      setHtml(converted);
    } else {
      setHtml('');
    }
  }, [markdown]);

  const insertTemplate = (template: string) => {
    setMarkdown(prev => prev + (prev ? '\n\n' : '') + template);
    toast({
      title: "Template ajouté",
      description: "Le template Markdown a été inséré",
    });
  };

  const templates = [
    {
      name: 'En-têtes',
      content: '# Titre principal\n## Sous-titre\n### Sous-sous-titre'
    },
    {
      name: 'Liste à puces',
      content: '* Premier élément\n* Deuxième élément\n* Troisième élément'
    },
    {
      name: 'Liste numérotée',
      content: '1. Premier élément\n2. Deuxième élément\n3. Troisième élément'
    },
    {
      name: 'Lien',
      content: '[Texte du lien](https://example.com)'
    },
    {
      name: 'Image',
      content: '![Texte alternatif](https://example.com/image.jpg)'
    },
    {
      name: 'Code',
      content: '```javascript\nfunction example() {\n  return "Hello World";\n}\n```'
    },
    {
      name: 'Citation',
      content: '> Ceci est une citation\n> sur plusieurs lignes'
    },
    {
      name: 'Tableau',
      content: '| Colonne 1 | Colonne 2 | Colonne 3 |\n|-----------|-----------|-----------||\n| Ligne 1   | Données   | Valeurs   |\n| Ligne 2   | Données   | Valeurs   |'
    }
  ];

  const copyHtml = async () => {
    try {
      await navigator.clipboard.writeText(html);
      toast({
        title: "HTML copié",
        description: "Le code HTML a été copié dans le presse-papiers",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le HTML",
        variant: "destructive",
      });
    }
  };

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      toast({
        title: "Markdown copié",
        description: "Le Markdown a été copié dans le presse-papiers",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le Markdown",
        variant: "destructive",
      });
    }
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Téléchargement réussi",
      description: "Le fichier Markdown a été téléchargé",
    });
  };

  const downloadHtml = () => {
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1, h2, h3 { color: #333; }
    code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
    pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
    blockquote { border-left: 4px solid #ddd; padding-left: 15px; margin: 0; font-style: italic; }
  </style>
</head>
<body>
${html}
</body>
</html>`;
    
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Téléchargement réussi",
      description: "Le fichier HTML a été téléchargé",
    });
  };

  return (
    <div className="space-y-4">
      {/* Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="w-4 h-4" />
            Templates Markdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {templates.map((template, index) => (
              <Button
                key={index}
                onClick={() => insertTemplate(template.content)}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                {template.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Editor */}
      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline">Édition</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Aperçu</span>
          </TabsTrigger>
          <TabsTrigger value="split" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Divisé</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Éditeur Markdown</CardTitle>
              <div className="flex gap-2">
                <Button onClick={copyMarkdown} variant="outline" size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button onClick={downloadMarkdown} variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Tapez votre Markdown ici..."
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                rows={20}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Aperçu HTML</CardTitle>
              <div className="flex gap-2">
                <Button onClick={copyHtml} variant="outline" size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button onClick={downloadHtml} variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                className="min-h-96 p-4 bg-white dark:bg-gray-900 rounded border prose max-w-none"
                dangerouslySetInnerHTML={{ __html: html || '<p class="text-gray-500">L\'aperçu apparaîtra ici...</p>' }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="split">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Markdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Tapez votre Markdown ici..."
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  rows={16}
                  className="font-mono text-sm"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Aperçu</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="h-80 overflow-auto p-3 bg-white dark:bg-gray-900 rounded border prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: html || '<p class="text-gray-500">L\'aperçu apparaîtra ici...</p>' }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{markdown.length}</div>
              <div className="text-xs text-gray-600">Caractères</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-lg font-bold text-green-600">{markdown.split('\n').length}</div>
              <div className="text-xs text-gray-600">Lignes</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{markdown.trim().split(/\s+/).length}</div>
              <div className="text-xs text-gray-600">Mots</div>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div className="text-lg font-bold text-orange-600">{(markdown.match(/#/g) || []).length}</div>
              <div className="text-xs text-gray-600">En-têtes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
