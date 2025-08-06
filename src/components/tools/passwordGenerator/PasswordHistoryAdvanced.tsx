
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Star, StarOff, Search, Trash2, History, Calendar, Shield } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PasswordHistoryEntry {
  id: string;
  password: string;
  timestamp: number;
  strength: {
    score: number;
    level: string;
    color: string;
    feedback: string[];
    entropy: number;
    crackTime: string;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSymbols: boolean;
    hasSequence: boolean;
    hasRepeatedChars: boolean;
    commonPatterns: string[];
    details: {
      length: number;
      uniqueChars: number;
      characterVariety: number;
      commonWords: string[];
      keyboardPatterns: string[];
      datePatterns: string[];
    };
  };
  settings: any;
  isFavorite: boolean;
  isCopied: boolean;
  templateId?: string;
  category?: string;
  notes?: string;
  usageCount?: number;
  lastUsed?: number;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface PasswordHistoryAdvancedProps {
  history: PasswordHistoryEntry[];
  templates: Template[];
  onCopy: (password: string, entryId?: string) => void;
  onToggleFavorite: (entryId: string) => void;
}

export const PasswordHistoryAdvanced = ({
  history,
  templates,
  onCopy,
  onToggleFavorite
}: PasswordHistoryAdvancedProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'favorites' | 'strong'>('all');

  const getTemplateName = (templateId?: string) => {
    if (!templateId) return 'Personnalisé';
    const template = templates.find(t => t.id === templateId);
    return template ? template.name : 'Personnalisé';
  };

  const filteredHistory = history.filter(entry => {
    const matchesSearch = searchTerm === '' || 
      entry.password.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getTemplateName(entry.templateId).toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (filterBy) {
      case 'favorites':
        return entry.isFavorite;
      case 'strong':
        return entry.strength.score >= 80;
      default:
        return true;
    }
  });

  const maskPassword = (password: string) => {
    if (password.length <= 8) {
      return '•'.repeat(password.length);
    }
    return password.slice(0, 3) + '•'.repeat(password.length - 6) + password.slice(-3);
  };

  if (history.length === 0) {
    return (
      <Card className="border-green-200 dark:border-green-800">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <History className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Aucun historique
          </h3>
          <p className="text-gray-500 text-center">
            Générez des mots de passe pour voir l'historique ici
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200 dark:border-green-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
          <History className="w-5 h-5" />
          Historique des Mots de Passe ({history.length})
        </CardTitle>
        
        {/* Filters and Search */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher dans l'historique..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterBy === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('all')}
            >
              Tous ({history.length})
            </Button>
            <Button
              variant={filterBy === 'favorites' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('favorites')}
            >
              <Star className="w-3 h-3 mr-1" />
              Favoris ({history.filter(h => h.isFavorite).length})
            </Button>
            <Button
              variant={filterBy === 'strong' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('strong')}
            >
              <Shield className="w-3 h-3 mr-1" />
              Forts ({history.filter(h => h.strength.score >= 80).length})
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {filteredHistory.map((entry) => (
              <div
                key={entry.id}
                className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {maskPassword(entry.password)}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${entry.strength.color.replace('text-', 'bg-').replace('500', '100')} ${entry.strength.color.replace('500', '700')}`}
                      >
                        {entry.strength.level}
                      </Badge>
                      {entry.isFavorite && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(entry.timestamp), 'dd MMM yyyy à HH:mm', { locale: fr })}
                      </span>
                      <span>• {entry.settings.length} caractères</span>
                      <span>• {getTemplateName(entry.templateId)}</span>
                      {entry.usageCount && entry.usageCount > 0 && (
                        <span>• Copié {entry.usageCount} fois</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onToggleFavorite(entry.id)}
                      className="text-gray-500 hover:text-yellow-500"
                    >
                      {entry.isFavorite ? (
                        <StarOff className="w-4 h-4" />
                      ) : (
                        <Star className="w-4 h-4" />
                      )}
                    </Button>
                    
                    <Button
                      size="sm"
                      onClick={() => onCopy(entry.password, entry.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copier
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredHistory.length === 0 && searchTerm && (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Aucun résultat pour "{searchTerm}"</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
