import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, Key, TestTube, Eye, EyeOff, Trash2, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface LLMProvider {
  id: string;
  name: string;
  models: string[];
  apiKeyLabel: string;
  testEndpoint?: string;
}

const LLM_PROVIDERS: LLMProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4-turbo', 'gpt-4o-mini'],
    apiKeyLabel: 'OpenAI API Key',
  },
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-5-haiku-20241022'],
    apiKeyLabel: 'Anthropic API Key',
  },
  {
    id: 'google',
    name: 'Google',
    models: ['gemini-2.0-flash-exp', 'gemini-1.5-pro-latest'],
    apiKeyLabel: 'Google API Key',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    models: ['deepseek-chat', 'deepseek-reasoner'],
    apiKeyLabel: 'DeepSeek API Key',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    models: ['deepseek/deepseek-r1', 'google/gemini-2.0-flash-exp:free', 'anthropic/claude-3.5-sonnet'],
    apiKeyLabel: 'OpenRouter API Key',
  },
  {
    id: 'xgrok',
    name: 'X / Grok',
    models: ['grok-beta', 'grok-vision-beta'],
    apiKeyLabel: 'X/Grok API Key',
  },
];

interface APIKey {
  id: string;
  provider: string;
  api_key: string;
  is_default: boolean;
  selected_model: string | null;
  created_at: string;
}

export const LLMSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [newApiKey, setNewApiKey] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [testingKey, setTestingKey] = useState<string | null>(null);

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
      console.error('Erreur chargement clés API:', error);
    }
  };

  const saveApiKey = async () => {
    if (!selectedProvider || !newApiKey.trim()) {
      toast({
        title: "Champs requis",
        description: "Veuillez sélectionner un fournisseur et saisir une clé API",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Sauvegarder dans Supabase
      const { error } = await supabase
        .from('user_llm_api_keys')
        .insert({
          user_id: user?.id,
          provider: selectedProvider,
          api_key: newApiKey,
          selected_model: selectedModel || null,
          is_default: apiKeys.length === 0, // Premier ajout = défaut
        });

      if (error) throw error;

      // Sauvegarder en localStorage pour persistance locale
      const localKeys = JSON.parse(localStorage.getItem('llm_api_keys') || '{}');
      localKeys[selectedProvider] = newApiKey;
      localStorage.setItem('llm_api_keys', JSON.stringify(localKeys));

      toast({
        title: "Clé API sauvegardée",
        description: "La clé API a été sauvegardée dans Supabase et en local",
      });

      setNewApiKey('');
      setSelectedProvider('');
      setSelectedModel('');
      await loadApiKeys();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder la clé API",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSelectedModel = async (keyId: string, model: string) => {
    try {
      const { error } = await supabase
        .from('user_llm_api_keys')
        .update({ selected_model: model })
        .eq('id', keyId);

      if (error) throw error;

      toast({
        title: "Modèle mis à jour",
        description: "Le modèle sélectionné a été sauvegardé",
      });

      await loadApiKeys();
    } catch (error) {
      console.error('Erreur mise à jour modèle:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le modèle",
        variant: "destructive",
      });
    }
  };

  const testApiKey = async (keyId: string, provider: string, apiKey: string) => {
    setTestingKey(keyId);
    const testPrompt = "Bonjour, pouvez-vous me répondre brièvement pour tester la connexion ?";
    
    try {
      let testResult = false;
      let response = '';
      let error = '';
      
      if (provider === 'openai') {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: testPrompt }],
            max_tokens: 50
          })
        });
        
        if (res.ok) {
          const data = await res.json();
          response = data.choices[0]?.message?.content || 'Réponse vide';
          testResult = true;
        } else {
          const errorData = await res.json();
          error = errorData.error?.message || `Erreur HTTP ${res.status}`;
        }
      } else if (provider === 'anthropic') {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 50,
            messages: [{ role: 'user', content: testPrompt }]
          })
        });
        
        if (res.ok) {
          const data = await res.json();
          response = data.content[0]?.text || 'Réponse vide';
          testResult = true;
        } else {
          const errorData = await res.json();
          error = errorData.error?.message || `Erreur HTTP ${res.status}`;
        }
      } else if (provider === 'deepseek') {
        const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: testPrompt }],
            max_tokens: 50
          })
        });
        
        if (res.ok) {
          const data = await res.json();
          response = data.choices[0]?.message?.content || 'Réponse vide';
          testResult = true;
        } else {
          const errorData = await res.json();
          error = errorData.error?.message || `Erreur HTTP ${res.status}`;
        }
      } else if (provider === 'openrouter') {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
          },
          body: JSON.stringify({
            model: 'deepseek/deepseek-r1',
            messages: [{ role: 'user', content: testPrompt }],
            max_tokens: 50
          })
        });
        
        if (res.ok) {
          const data = await res.json();
          response = data.choices[0]?.message?.content || 'Réponse vide';
          testResult = true;
        } else {
          const errorData = await res.json();
          error = errorData.error?.message || `Erreur HTTP ${res.status}`;
        }
      } else if (provider === 'google') {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: testPrompt }] }]
          })
        });
        
        if (res.ok) {
          const data = await res.json();
          response = data.candidates[0]?.content?.parts[0]?.text || 'Réponse vide';
          testResult = true;
        } else {
          const errorData = await res.json();
          error = errorData.error?.message || `Erreur HTTP ${res.status}`;
        }
      } else if (provider === 'xgrok') {
        const res = await fetch('https://api.x.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'grok-beta',
            messages: [{ role: 'user', content: testPrompt }],
            max_tokens: 50
          })
        });
        
        if (res.ok) {
          const data = await res.json();
          response = data.choices[0]?.message?.content || 'Réponse vide';
          testResult = true;
        } else {
          const errorData = await res.json();
          error = errorData.error?.message || `Erreur HTTP ${res.status}`;
        }
      }
      
      toast({
        title: testResult ? "✅ Test réussi" : "❌ Test échoué",
        description: (
          <div className="space-y-2 text-xs">
            <div><strong>Prompt:</strong> {testPrompt}</div>
            {testResult ? (
              <div><strong>Réponse:</strong> {response}</div>
            ) : (
              <div><strong>Erreur:</strong> {error}</div>
            )}
          </div>
        ),
        variant: testResult ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "❌ Erreur de test",
        description: (
          <div className="space-y-2 text-xs">
            <div><strong>Prompt:</strong> {testPrompt}</div>
            <div><strong>Erreur:</strong> {error instanceof Error ? error.message : 'Erreur inconnue'}</div>
          </div>
        ),
        variant: "destructive",
      });
    } finally {
      setTestingKey(null);
    }
  };

  const deleteApiKey = async (keyId: string, provider: string) => {
    try {
      const { error } = await supabase
        .from('user_llm_api_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;

      // Supprimer du localStorage aussi
      const localKeys = JSON.parse(localStorage.getItem('llm_api_keys') || '{}');
      delete localKeys[provider];
      localStorage.setItem('llm_api_keys', JSON.stringify(localKeys));

      toast({
        title: "Clé supprimée",
        description: "La clé API a été supprimée de Supabase et du stockage local",
      });

      await loadApiKeys();
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast({
        title: "Erreur de suppression",
        description: "Impossible de supprimer la clé API",
        variant: "destructive",
      });
    }
  };

  const setDefaultKey = async (keyId: string) => {
    try {
      // Désactiver toutes les clés par défaut
      await supabase
        .from('user_llm_api_keys')
        .update({ is_default: false })
        .eq('user_id', user?.id);

      // Activer la nouvelle clé par défaut
      const { error } = await supabase
        .from('user_llm_api_keys')
        .update({ is_default: true })
        .eq('id', keyId);

      if (error) throw error;

      toast({
        title: "Modèle par défaut mis à jour",
        description: "Le modèle par défaut a été changé",
      });

      await loadApiKeys();
    } catch (error) {
      console.error('Erreur mise à jour défaut:', error);
      toast({
        title: "Erreur",
        description: "Impossible de définir le modèle par défaut",
        variant: "destructive",
      });
    }
  };

  const toggleShowApiKey = (keyId: string) => {
    setShowApiKey(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const getProviderName = (providerId: string) => {
    return LLM_PROVIDERS.find(p => p.id === providerId)?.name || providerId;
  };

  const getAvailableModels = () => {
    if (!selectedProvider) return [];
    return LLM_PROVIDERS.find(p => p.id === selectedProvider)?.models || [];
  };

  const getProviderModels = (providerId: string) => {
    return LLM_PROVIDERS.find(p => p.id === providerId)?.models || [];
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Veuillez vous connecter pour gérer vos clés API LLM</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuration des Modèles LLM
        </CardTitle>
        <p className="text-sm text-gray-600">
          Configurez vos clés API pour utiliser l'IA dans la décomposition de tâches
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulaire d'ajout */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium">Ajouter une nouvelle clé API</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un fournisseur" />
              </SelectTrigger>
              <SelectContent>
                {LLM_PROVIDERS.map(provider => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue placeholder="Modèle (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableModels().map(model => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder={selectedProvider ? 
                LLM_PROVIDERS.find(p => p.id === selectedProvider)?.apiKeyLabel || "Clé API" : 
                "Clé API"
              }
              type="password"
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
            />
          </div>

          <Button onClick={saveApiKey} disabled={isLoading}>
            <Key className="w-4 h-4 mr-2" />
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>

        {/* Liste des clés existantes */}
        <div className="space-y-3">
          <h4 className="font-medium">Clés API configurées</h4>
          
          {apiKeys.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">
              Aucune clé API configurée. Ajoutez-en une pour utiliser l'IA.
            </p>
          ) : (
            apiKeys.map(key => (
              <div key={key.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{getProviderName(key.provider)}</span>
                      {key.is_default && (
                        <Badge variant="default" className="text-xs">Par défaut</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {showApiKey[key.id] ? key.api_key : `${'*'.repeat(20)}...${key.api_key.slice(-4)}`}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleShowApiKey(key.id)}
                      >
                        {showApiKey[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <div className="mt-2">
                      <Select 
                        value={key.selected_model || ''} 
                        onValueChange={(model) => updateSelectedModel(key.id, model)}
                      >
                        <SelectTrigger className="w-full max-w-xs">
                          <SelectValue placeholder="Sélectionner un modèle" />
                        </SelectTrigger>
                        <SelectContent>
                          {getProviderModels(key.provider).map(model => (
                            <SelectItem key={model} value={model}>
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testApiKey(key.id, key.provider, key.api_key)}
                    disabled={testingKey === key.id}
                  >
                    <TestTube className="w-4 h-4 mr-1" />
                    {testingKey === key.id ? 'Test...' : 'Tester'}
                  </Button>

                  {!key.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDefaultKey(key.id)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Défaut
                    </Button>
                  )}

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteApiKey(key.id, key.provider)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Informations */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-blue-800 mb-2">💡 Conseils & Stockage</h5>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Les clés API sont stockées de manière sécurisée dans <strong>Supabase + localStorage</strong></li>
            <li>• Utilisez le bouton "Tester" pour vérifier que vos clés fonctionnent</li>
            <li>• Le modèle par défaut sera utilisé pour la décomposition automatique de tâches</li>
            <li>• Vous pouvez configurer plusieurs fournisseurs et choisir celui par défaut</li>
            <li>• Les données sont persistantes même hors ligne (localStorage)</li>
            <li>• Sélectionnez un modèle spécifique pour each fournisseur</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
