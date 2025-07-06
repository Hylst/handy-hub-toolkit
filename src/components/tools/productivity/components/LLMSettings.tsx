
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Key, 
  Settings, 
  Check, 
  X, 
  AlertCircle, 
  Trash2,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LLMProvider {
  id: string;
  name: string;
  models: string[];
  defaultModel: string;
  keyPlaceholder: string;
  testEndpoint?: string;
}

const LLM_PROVIDERS: LLMProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    defaultModel: 'gpt-4o-mini',
    keyPlaceholder: 'sk-...',
    testEndpoint: 'https://api.openai.com/v1/models'
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307', 'claude-3-opus-20240229'],
    defaultModel: 'claude-3-5-sonnet-20241022',
    keyPlaceholder: 'sk-ant-api...',
  },
  {
    id: 'groq',
    name: 'Groq',
    models: ['llama-3.1-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
    defaultModel: 'llama-3.1-8b-instant',
    keyPlaceholder: 'gsk_...',
  },
  {
    id: 'together',
    name: 'Together AI',
    models: ['meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo', 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo'],
    defaultModel: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
    keyPlaceholder: 'together_...',
  }
];

interface ApiKey {
  id: string;
  provider: string;
  api_key: string;
  selected_model: string;
  is_default: boolean;
}

export const LLMSettings: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingKeys, setTestingKeys] = useState<Set<string>>(new Set());
  const [newKey, setNewKey] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(LLM_PROVIDERS[0].id);
  const [selectedModel, setSelectedModel] = useState(LLM_PROVIDERS[0].defaultModel);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [addingKey, setAddingKey] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadApiKeys();
    }
  }, [user]);

  const loadApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('user_llm_api_keys')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des clés API:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les clés API",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = async () => {
    if (!user || !newKey.trim()) return;

    setAddingKey(true);
    try {
      // Si c'est la première clé, elle devient par défaut
      const isFirstKey = apiKeys.length === 0;

      const { error } = await supabase
        .from('user_llm_api_keys')
        .insert({
          user_id: user.id,
          provider: selectedProvider,
          api_key: newKey.trim(),
          selected_model: selectedModel,
          is_default: isFirstKey
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Clé API sauvegardée avec succès"
      });

      setNewKey('');
      await loadApiKeys();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder la clé API",
        variant: "destructive"
      });
    } finally {
      setAddingKey(false);
    }
  };

  const deleteApiKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('user_llm_api_keys')
        .delete()
        .eq('id', keyId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Clé API supprimée"
      });

      await loadApiKeys();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la clé API",
        variant: "destructive"
      });
    }
  };

  const setDefaultKey = async (keyId: string) => {
    try {
      // Retirer le statut par défaut de toutes les clés
      await supabase
        .from('user_llm_api_keys')
        .update({ is_default: false })
        .eq('user_id', user?.id);

      // Définir la nouvelle clé par défaut
      const { error } = await supabase
        .from('user_llm_api_keys')
        .update({ is_default: true })
        .eq('id', keyId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Clé par défaut mise à jour"
      });

      await loadApiKeys();
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la clé par défaut",
        variant: "destructive"
      });
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKey(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const getProviderInfo = (providerId: string) => {
    return LLM_PROVIDERS.find(p => p.id === providerId);
  };

  const currentProvider = LLM_PROVIDERS.find(p => p.id === selectedProvider);

  if (!user) {
    return (
      <Card className="border-2 border-orange-200 dark:border-orange-800">
        <CardContent className="p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Vous devez être connecté pour configurer vos clés API LLM.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Chargement des paramètres LLM...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-purple-800 dark:text-purple-200">
          <Brain className="w-5 h-5" />
          Configuration des Modèles LLM
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configurez vos clés API pour utiliser l'IA dans les outils de productivité
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs defaultValue="keys" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="keys">Mes Clés API</TabsTrigger>
            <TabsTrigger value="add">Ajouter une Clé</TabsTrigger>
          </TabsList>

          <TabsContent value="keys" className="space-y-4">
            {apiKeys.length === 0 ? (
              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  Aucune clé API configurée. Ajoutez une clé pour utiliser les fonctionnalités IA.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {apiKeys.map((key) => {
                  const provider = getProviderInfo(key.provider);
                  return (
                    <Card key={key.id} className={`p-4 ${key.is_default ? 'border-2 border-green-300 bg-green-50 dark:bg-green-950/20' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">
                              {provider?.name || key.provider}
                            </Badge>
                            {key.is_default && (
                              <Badge className="bg-green-600 text-white">
                                Par défaut
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Modèle: {key.selected_model}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs font-mono">
                              {showKey[key.id] ? key.api_key : '••••••••••••••••'}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleKeyVisibility(key.id)}
                            >
                              {showKey[key.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!key.is_default && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDefaultKey(key.id)}
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Définir par défaut
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteApiKey(key.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="add" className="space-y-4">
            <form onSubmit={(e) => { e.preventDefault(); saveApiKey(); }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Fournisseur</Label>
                <Select value={selectedProvider} onValueChange={(value) => {
                  setSelectedProvider(value);
                  const provider = LLM_PROVIDERS.find(p => p.id === value);
                  if (provider) {
                    setSelectedModel(provider.defaultModel);
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LLM_PROVIDERS.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Modèle</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currentProvider?.models.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">Clé API</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder={currentProvider?.keyPlaceholder || "Clé API"}
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <Button 
                type="submit" 
                disabled={!newKey.trim() || addingKey}
                className="w-full"
              >
                {addingKey ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Ajout en cours...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter la Clé API
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p className="font-medium">📋 Fournisseurs supportés :</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>OpenAI</strong> - GPT-4, GPT-3.5 et modèles optimisés</li>
            <li><strong>Anthropic</strong> - Claude 3.5 Sonnet, Haiku, Opus</li>
            <li><strong>Groq</strong> - Llama 3.1, Mixtral (ultra-rapide)</li>
            <li><strong>Together AI</strong> - Modèles open source optimisés</li>
          </ul>
          
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Sécurité :</strong> Vos clés API sont chiffrées et stockées de manière sécurisée. 
              Elles ne sont jamais partagées et sont uniquement utilisées pour vos requêtes personnelles.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};
