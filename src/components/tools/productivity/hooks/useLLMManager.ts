
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LLMProvider {
  id: string;
  provider: string;
  api_key: string;
  is_default: boolean;
  selected_model: string | null;
}

interface DecompositionRequest {
  taskTitle: string;
  taskDescription?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  estimatedDuration?: number;
  context?: string;
}

interface SubtaskData {
  title: string;
  description: string;
  estimatedDuration?: number;
}

interface DecompositionResult {
  success: boolean;
  subtasks: SubtaskData[];
  error?: string;
}

export const useLLMManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [providers, setProviders] = useState<LLMProvider[]>([]);
  const [defaultProvider, setDefaultProvider] = useState<LLMProvider | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadProviders();
    }
  }, [user]);

  const loadProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('user_llm_api_keys')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      setProviders(data || []);
      const defaultProv = data?.find(p => p.is_default) || null;
      setDefaultProvider(defaultProv);

      // Fallback sur localStorage si pas de données Supabase
      if (!data || data.length === 0) {
        const localKeys = JSON.parse(localStorage.getItem('llm_api_keys') || '{}');
        if (Object.keys(localKeys).length > 0) {
          const firstProvider = Object.keys(localKeys)[0];
          setDefaultProvider({
            id: 'local',
            provider: firstProvider,
            api_key: localKeys[firstProvider],
            is_default: true,
            selected_model: null
          });
        }
      }
    } catch (error) {
      console.error('Erreur chargement fournisseurs LLM:', error);
      
      // Fallback sur localStorage
      const localKeys = JSON.parse(localStorage.getItem('llm_api_keys') || '{}');
      if (Object.keys(localKeys).length > 0) {
        const firstProvider = Object.keys(localKeys)[0];
        setDefaultProvider({
          id: 'local',
          provider: firstProvider,
          api_key: localKeys[firstProvider],
          is_default: true,
          selected_model: null
        });
      }
    }
  };

  const decomposeTaskWithAI = useCallback(async (
    request: DecompositionRequest
  ): Promise<DecompositionResult> => {
    if (!defaultProvider) {
      return {
        success: false,
        subtasks: [],
        error: 'Aucun fournisseur LLM configuré par défaut'
      };
    }

    setIsLoading(true);
    try {
      const prompt = `Vous êtes un assistant spécialisé dans la décomposition de tâches en sous-tâches actionables.

TÂCHE À DÉCOMPOSER:
Titre: ${request.taskTitle}
${request.taskDescription ? `Description: ${request.taskDescription}` : ''}
${request.tags && request.tags.length > 0 ? `Tags: ${request.tags.join(', ')}` : ''}
${request.priority ? `Priorité: ${request.priority}` : ''}
${request.category ? `Catégorie: ${request.category}` : ''}
${request.estimatedDuration ? `Durée estimée totale: ${request.estimatedDuration} minutes` : ''}
${request.context ? `Contexte: ${request.context}` : ''}

INSTRUCTIONS:
1. Analysez la tâche et décomposez-la en 2-5 sous-tâches spécifiques et actionnables
2. Chaque sous-tâche doit être claire, réalisable et contribuer au résultat final
3. Si une durée totale est donnée, répartissez-la intelligemment entre les sous-tâches
4. Répondez UNIQUEMENT au format JSON suivant:

{
  "subtasks": [
    {
      "title": "Titre de la sous-tâche 1",
      "description": "Description détaillée de ce qu'il faut faire",
      "estimatedDuration": 30
    },
    {
      "title": "Titre de la sous-tâche 2", 
      "description": "Description détaillée de ce qu'il faut faire",
      "estimatedDuration": 45
    }
  ]
}

Répondez UNIQUEMENT avec le JSON, sans autre texte.`;

      let result: any;

      if (defaultProvider.provider === 'openai') {
        result = await callOpenAI(defaultProvider.api_key, prompt, defaultProvider.selected_model);
      } else if (defaultProvider.provider === 'anthropic') {
        result = await callAnthropic(defaultProvider.api_key, prompt, defaultProvider.selected_model);
      } else if (defaultProvider.provider === 'google') {
        result = await callGoogle(defaultProvider.api_key, prompt, defaultProvider.selected_model);
      } else if (defaultProvider.provider === 'deepseek') {
        result = await callDeepSeek(defaultProvider.api_key, prompt, defaultProvider.selected_model);
      } else if (defaultProvider.provider === 'openrouter') {
        result = await callOpenRouter(defaultProvider.api_key, prompt, defaultProvider.selected_model);
      } else if (defaultProvider.provider === 'xgrok') {
        result = await callXGrok(defaultProvider.api_key, prompt, defaultProvider.selected_model);
      } else {
        throw new Error(`Fournisseur ${defaultProvider.provider} non supporté`);
      }

      // Parser la réponse JSON
      let parsedResult;
      try {
        parsedResult = JSON.parse(result);
      } catch (parseError) {
        console.error('Erreur parsing JSON:', parseError);
        // Si pas JSON, essayer d'extraire manuellement
        const lines = result.split('\n').filter((line: string) => line.trim().length > 0);
        const subtasks = lines.map((line: string, index: number) => ({
          title: line.replace(/^[-•*\d.\s]+/, '').trim(),
          description: `Sous-tâche ${index + 1} de: ${request.taskTitle}`,
          estimatedDuration: request.estimatedDuration ? Math.round(request.estimatedDuration / lines.length) : undefined
        }));
        parsedResult = { subtasks };
      }

      return {
        success: true,
        subtasks: parsedResult.subtasks || []
      };
    } catch (error) {
      console.error('Erreur décomposition IA:', error);
      return {
        success: false,
        subtasks: [],
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    } finally {
      setIsLoading(false);
    }
  }, [defaultProvider]);

  const callOpenAI = async (apiKey: string, prompt: string, selectedModel?: string | null): Promise<string[]> => {
    const model = selectedModel || 'gpt-4o';
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'Vous êtes un assistant spécialisé dans la décomposition de tâches. Répondez uniquement avec une liste de sous-tâches, une par ligne.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erreur OpenAI: ${errorData.error?.message || response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    return content
      .split('\n')
      .map((line: string) => line.replace(/^[-•*\d.\s]+/, '').trim())
      .filter((line: string) => line.length > 0);
  };

  const callAnthropic = async (apiKey: string, prompt: string, selectedModel?: string | null): Promise<string[]> => {
    const model = selectedModel || 'claude-3-5-sonnet-20241022';
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erreur Anthropic: ${errorData.error?.message || response.status}`);
    }

    const data = await response.json();
    const content = data.content[0]?.text || '';
    
    return content
      .split('\n')
      .map((line: string) => line.replace(/^[-•*\d.\s]+/, '').trim())
      .filter((line: string) => line.length > 0);
  };

  const callGoogle = async (apiKey: string, prompt: string, selectedModel?: string | null): Promise<string[]> => {
    const model = selectedModel || 'gemini-2.0-flash-exp';
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erreur Google: ${errorData.error?.message || response.status}`);
    }

    const data = await response.json();
    const content = data.candidates[0]?.content?.parts[0]?.text || '';
    
    return content
      .split('\n')
      .map((line: string) => line.replace(/^[-•*\d.\s]+/, '').trim())
      .filter((line: string) => line.length > 0);
  };

  const callDeepSeek = async (apiKey: string, prompt: string, selectedModel?: string | null): Promise<string[]> => {
    const model = selectedModel || 'deepseek-chat';
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'Vous êtes un assistant spécialisé dans la décomposition de tâches. Répondez uniquement avec une liste de sous-tâches, une par ligne.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erreur DeepSeek: ${errorData.error?.message || response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    return content
      .split('\n')
      .map((line: string) => line.replace(/^[-•*\d.\s]+/, '').trim())
      .filter((line: string) => line.length > 0);
  };

  const callOpenRouter = async (apiKey: string, prompt: string, selectedModel?: string | null): Promise<string[]> => {
    const model = selectedModel || 'deepseek/deepseek-r1';
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'Vous êtes un assistant spécialisé dans la décomposition de tâches. Répondez uniquement avec une liste de sous-tâches, une par ligne.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erreur OpenRouter: ${errorData.error?.message || response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    return content
      .split('\n')
      .map((line: string) => line.replace(/^[-•*\d.\s]+/, '').trim())
      .filter((line: string) => line.length > 0);
  };

  const callXGrok = async (apiKey: string, prompt: string, selectedModel?: string | null): Promise<string[]> => {
    const model = selectedModel || 'grok-beta';
    
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'Vous êtes un assistant spécialisé dans la décomposition de tâches. Répondez uniquement avec une liste de sous-tâches, une par ligne.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erreur X/Grok: ${errorData.error?.message || response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    return content
      .split('\n')
      .map((line: string) => line.replace(/^[-•*\d.\s]+/, '').trim())
      .filter((line: string) => line.length > 0);
  };

  return {
    providers,
    defaultProvider,
    decomposeTaskWithAI,
    isLoading,
    hasConfiguredProvider: !!defaultProvider,
    reloadProviders: loadProviders,
  };
};
