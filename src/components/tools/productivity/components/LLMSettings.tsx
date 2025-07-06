
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Key, Sparkles, Trash2, Check, X, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface LLMProvider {
  id: string;
  provider: string;
  api_key: string;
  is_default: boolean;
  selected_model: string | null;
}

const PROVIDER_MODELS = {
  openai: [
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-3.5-turbo'
  ],
  anthropic: [
    'claude-3-5-sonnet-20241022',
    'claude-3-5-haiku-20241022',
    'claude-3-opus-20240229'
  ],
  google: [
    'gemini-2.0-flash-exp',
    'gemini-1.5-pro',
    'gemini-1.5-flash'
  ],
  deepseek: [
    'deepseek-chat',
    'deepseek-coder'
  ],
  openrouter: [
    'deepseek/deepseek-r1',
    'anthropic/claude-3.5-sonnet',
    'openai/gpt-4o'
  ],
  xgrok: [
    'grok-beta',
    'grok-vision-beta'
  ]
};

export const LLMSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [providers, setProviders] = useState<LLMProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  
  // Formulaire pour nouveau fournisseur
  const [newProvider, setNewProvider] = useState({
    provider: '',
    api_key: '',
    selected_model: ''
  });

  useEffect(() => {
    if (user) {
      loadProviders();
    }
  }, [user]);

  const loadProviders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_llm_api_keys')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      setProviders(data || []);
    } catch (error) {
      console.error('Erreur chargement fournisseurs:', error);
      // Fallback sur localStorage
      const localKeys = JSON.parse(localStorage.getItem('llm_api_keys') || '{}');
      const localProviders = Object.entries(localKeys).map(([provider, api_key], index) => ({
        id: `local-${index}`,
        provider,
        api_key: api_key as string,
        is_default: index === 0,
        selected_model: null
      }));
      setProviders(localProviders);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProvider = async () => {
    if (!newProvider.provider || !newProvider.api_key) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Si c'est le premier fournisseur, le marquer comme défaut
      const isFirstProvider = providers.length === 0;

      const { data, error } = await supabase
        .from('user_llm_api_keys')
        .insert({
          user_id: user?.id,
          provider: newProvider.provider,
          api_key: newProvider.api_key,
          selected_model: newProvider.selected_model || null,
          is_default: isFirstProvider
        })
        .select()
        .single();

      if (error) throw error;

      setProviders([...providers, data]);
      setNewProvider({ provider: '', api_key: '', selected_model: '' });

      // Sauvegarder aussi en localStorage pour fallback
      const localKeys = JSON.parse(localStorage.getItem('llm_api_keys') || '{}');
      localKeys[newProvider.provider] = newProvider.api_key;
      localStorage.setItem('llm_api_keys', JSON.stringify(localKeys));

      toast({
        title: "Fournisseur ajouté",
        description: `${newProvider.provider} configuré avec succès`,
      });
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      // Fallback localStorage
      const localKeys = JSON.parse(localStorage.getItem('llm_api_keys') || '{}');
      localKeys[newProvider.provider] = newProvider.api_key;
      localStorage.setItem('llm_api_keys', JSON.stringify(localKeys));
      
      const newId = `local-${Date.now()}`;
      setProviders([...providers, {
        id: newId,
        provider: newProvider.provider,
        api_key: newProvider.api_key,
        selected_model: newProvider.selected_model || null,
        is_default: providers.length === 0
      }]);
      
      setNewProvider({ provider: '', api_key: '', selected_model: '' });
      
      toast({
        title: "Fournisseur ajouté (local)",
        description: `${newProvider.provider} configuré localement`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProvider = async (providerId: string) => {
    try {
      if (providerId.startsWith('local-')) {
        const provider = providers.find(p => p.id === providerId);
        if (provider) {
          const localKeys = JSON.parse(localStorage.getItem('llm_api_keys') || '{}');
          delete localKeys[provider.provider];
          localStorage.setItem('llm_api_keys', JSON.stringify(localKeys));
        }
      } else {
        const { error } = await supabase
          .from('user_llm_api_keys')
          .delete()
          .eq('id', providerId);

        if (error) throw error;
      }

      setProviders(providers.filter(p => p.id !== providerId));
      toast({
        title: "Fournisseur supprimé",
        description: "Configuration supprimée avec succès",
      });
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const setDefaultProvider = async (providerId: string) => {
    try {
      // Réinitialiser tous les fournisseurs
      for (const provider of providers) {
        if (!provider.id.startsWith('local-')) {
          await supabase
            .from('user_llm_api_keys')
            .update({ is_default: false })
            .eq('id', provider.id);
        }
      }

      // Marquer le nouveau comme défaut
      if (!providerId.startsWith('local-')) {
        const { error } = await supabase
          .from('user_llm_api_keys')
          .update({ is_default: true })
          .eq('id', providerId);

        if (error) throw error;
      }

      // Mettre à jour l'état local
      setProviders(providers.map(p => ({
        ...p,
        is_default: p.id === providerId
      })));

      toast({
        title: "Fournisseur par défaut modifié",
        description: "Configuration mise à jour",
      });
    } catch (error) {
      console.error('Erreur modification défaut:', error);
    }
  };

  const togglePasswordVisibility = (providerId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [providerId]: !prev[providerId]
    }));
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 4) + '*'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Configuration des Modèles LLM
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configurez vos clés API pour utiliser la décomposition IA des tâches
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="add" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">Ajouter</TabsTrigger>
            <TabsTrigger value="manage">Gérer ({providers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fournisseur *</label>
                <Select 
                  value={newProvider.provider} 
                  onValueChange={(value) => setNewProvider({ ...newProvider, provider: value, selected_model: '' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un fournisseur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI (GPT)</SelectItem>
                    <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                    <SelectItem value="google">Google (Gemini)</SelectItem>
                    <SelectItem value="deepseek">DeepSeek</SelectItem>
                    <SelectItem value="openrouter">OpenRouter</SelectItem>
                    <SelectItem value="xgrok">X/Grok</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Modèle (optionnel)</label>
                <Select 
                  value={newProvider.selected_model} 
                  onValueChange={(value) => setNewProvider({ ...newProvider, selected_model: value })}
                  disabled={!newProvider.provider}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Modèle par défaut" />
                  </SelectTrigger>
                  <SelectContent>
                    {newProvider.provider && PROVIDER_MODELS[newProvider.provider as keyof typeof PROVIDER_MODELS]?.map((model) => (
                      <SelectItem key={model} value={model}>{model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Clé API *</label>
              <form onSubmit={(e) => { e.preventDefault(); saveProvider(); }}>
                <Input
                  type="password"
                  placeholder="Clé API"
                  value={newProvider.api_key}
                  onChange={(e) => setNewProvider({ ...newProvider, api_key: e.target.value })}
                  autoComplete="new-password"
                />
              </form>
            </div>

            <Button 
              onClick={saveProvider} 
              disabled={isLoading || !newProvider.provider || !newProvider.api_key}
              className="w-full"
            >
              <Key className="w-4 h-4 mr-2" />
              {isLoading ? 'Ajout...' : 'Ajouter le fournisseur'}
            </Button>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            {providers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucun fournisseur configuré</p>
                <p className="text-sm">Ajoutez votre première clé API pour utiliser l'IA</p>
              </div>
            ) : (
              <div className="space-y-3">
                {providers.map((provider) => (
                  <div key={provider.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium capitalize">{provider.provider}</h3>
                        {provider.is_default && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                            Par défaut
                          </Badge>
                        )}
                        {provider.selected_model && (
                          <Badge variant="outline" className="text-xs">
                            {provider.selected_model}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!provider.is_default && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDefaultProvider(provider.id)}
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteProvider(provider.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex-1 font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        {showPasswords[provider.id] ? provider.api_key : maskApiKey(provider.api_key)}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => togglePasswordVisibility(provider.id)}
                      >
                        {showPasswords[provider.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 Conseil</h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Configurez au moins un fournisseur LLM pour utiliser la fonctionnalité "IA Décomposer" 
            qui permet de diviser automatiquement vos tâches en sous-tâches intelligentes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
