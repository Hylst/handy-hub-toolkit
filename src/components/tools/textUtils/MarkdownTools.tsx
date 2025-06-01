
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileCode, Eye, Copy, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MarkdownToolsProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const MarkdownTools = ({ data, onDataChange }: MarkdownToolsProps) => {
  const [markdown, setMarkdown] = useState(data.markdown || '');
  const [html, setHtml] = useState('');

  useEffect(() => {
    onDataChange({ ...data, markdown, html });
  }, [markdown, html]);

  useEffect(() => {
    convertToHtml(markdown);
  }, [markdown]);

  const convertToHtml = (md: string) => {
    // Conversion Markdown vers HTML simplifiée
    let htmlContent = md
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/__(.*?)__/gim, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/_(.*?)_/gim, '<em>$1</em>')
      // Code inline
      .replace(/`(.*?)`/gim, '<code>$1</code>')
      // Links
      .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '<img alt="$1" src="$2" />')
      // Line breaks
      .replace(/\n$/gim, '<br />')
      // Paragraphs
      .replace(/\n\n/gim, '</p><p>')
      // Lists
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/^\+ (.*$)/gim, '<li>$1</li>')
      // Numbered lists
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      // Blockquotes
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      // Horizontal rules
      .replace(/^---$/gim, '<hr>')
      .replace(/^\*\*\*$/gim, '<hr>');

    // Wrap in paragraphs
    if (htmlContent.trim()) {
      htmlContent = '<p>' + htmlContent + '</p>';
    }

    // Clean up list formatting
    htmlContent = htmlContent
      .replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>')
      .replace(/<\/ul>\s*<ul>/gim, '');

    setHtml(htmlContent);
  };

  const insertMarkdown = (syntax: string, placeholder: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    let newText = '';
    switch (syntax) {
      case 'bold':
        newText = `**${textToInsert}**`;
        break;
      case 'italic':
        newText = `*${textToInsert}*`;
        break;
      case 'code':
        newText = `\`${textToInsert}\``;
        break;
      case 'link':
        newText = `[${textToInsert || 'lien'}](url)`;
        break;
      case 'image':
        newText = `![${textToInsert || 'alt text'}](url)`;
        break;
      case 'h1':
        newText = `# ${textToInsert || 'Titre 1'}`;
        break;
      case 'h2':
        newText = `## ${textToInsert || 'Titre 2'}`;
        break;
      case 'h3':
        newText = `### ${textToInsert || 'Titre 3'}`;
        break;
      case 'ul':
        newText = `- ${textToInsert || 'Élément de liste'}`;
        break;
      case 'ol':
        newText = `1. ${textToInsert || 'Élément numéroté'}`;
        break;
      case 'quote':
        newText = `> ${textToInsert || 'Citation'}`;
        break;
      case 'hr':
        newText = '---';
        break;
      default:
        newText = textToInsert;
    }

    const newMarkdown = markdown.substring(0, start) + newText + markdown.substring(end);
    setMarkdown(newMarkdown);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + newText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const copyToClipboard = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copié !",
        description: `${type} copié dans le presse-papiers`,
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

  const markdownExample = `# Titre principal

## Sous-titre

Voici un paragraphe avec du **texte en gras** et du *texte en italique*.

### Liste non ordonnée
- Élément 1
- Élément 2
- Élément 3

### Liste ordonnée
1. Premier élément
2. Deuxième élément
3. Troisième élément

### Code et liens
Voici du \`code inline\` et un [lien vers Google](https://google.com).

> Ceci est une citation importante.

---

![Image exemple](https://via.placeholder.com/300x200)`;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileCode className="w-4 h-4" />
            Outils Markdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            <Button size="sm" variant="outline" onClick={() => insertMarkdown('bold')}>
              <strong>B</strong>
            </Button>
            <Button size="sm" variant="outline" onClick={() => insertMarkdown('italic')}>
              <em>I</em>
            </Button>
            <Button size="sm" variant="outline" onClick={() => insertMarkdown('h1')}>
              H1
            </Button>
            <Button size="sm" variant="outline" onClick={() => insertMarkdown('h2')}>
              H2
            </Button>
            <Button size="sm" variant="outline" onClick={() => insertMarkdown('h3')}>
              H3
            </Button>
            <Button size="sm" variant="outline" onClick={() => insertMarkdown('ul')}>
              UL
            </Button>
            <Button size="sm" variant="outline" onClick={() => insertMarkdown('ol')}>
              OL
            </Button>
            <Button size="sm" variant="outline" onClick={() => insertMarkdown('code')}>
              {'<>'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => insertMarkdown('link')}>
              🔗
            </Button>
            <Button size="sm" variant="outline" onClick={() => insertMarkdown('image')}>
              📷
            </Button>
            <Button size="sm" variant="outline" onClick={() => insertMarkdown('quote')}>
              " "
            </Button>
            <Button size="sm" variant="outline" onClick={() => insertMarkdown('hr')}>
              ---
            </Button>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setMarkdown(markdownExample)}
            >
              Exemple
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setMarkdown('')}
            >
              Effacer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Editor and Preview */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="editor">Éditeur</TabsTrigger>
              <TabsTrigger value="preview">Aperçu</TabsTrigger>
              <TabsTrigger value="split">Divisé</TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="p-4">
              <Textarea
                placeholder="Écrivez votre Markdown ici..."
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                rows={16}
                className="w-full font-mono text-sm"
              />
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>{markdown.length} caractères</span>
                <div className="space-x-2">
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(markdown, 'Markdown')}>
                    <Copy className="w-4 h-4 mr-1" />
                    Copier MD
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => downloadFile(markdown, 'document.md')}>
                    <Download className="w-4 h-4 mr-1" />
                    Télécharger MD
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="p-4">
              <div 
                className="prose max-w-none min-h-[400px] p-4 border rounded-lg bg-white dark:bg-gray-900"
                dangerouslySetInnerHTML={{ __html: html }}
              />
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>{html.length} caractères HTML</span>
                <div className="space-x-2">
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(html, 'HTML')}>
                    <Copy className="w-4 h-4 mr-1" />
                    Copier HTML
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => downloadFile(html, 'document.html')}>
                    <Download className="w-4 h-4 mr-1" />
                    Télécharger HTML
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="split" className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Markdown</h3>
                  <Textarea
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    rows={14}
                    className="w-full font-mono text-sm"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Aperçu</h3>
                  <div 
                    className="prose max-w-none h-96 overflow-auto p-4 border rounded-lg bg-white dark:bg-gray-900"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Markdown Cheat Sheet */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Aide-mémoire Markdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div><code># Titre 1</code> → <strong>Titre 1</strong></div>
              <div><code>## Titre 2</code> → <strong>Titre 2</strong></div>
              <div><code>**gras**</code> → <strong>gras</strong></div>
              <div><code>*italique*</code> → <em>italique</em></div>
              <div><code>`code`</code> → <code>code</code></div>
            </div>
            <div className="space-y-2">
              <div><code>[lien](url)</code> → lien</div>
              <div><code>![image](url)</code> → image</div>
              <div><code>- liste</code> → • liste</div>
              <div><code>1. numérotée</code> → 1. numérotée</div>
              <div><code>&gt; citation</code> → citation</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
