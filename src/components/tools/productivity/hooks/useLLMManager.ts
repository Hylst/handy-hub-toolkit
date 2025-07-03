
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LLMProvider {
  id: string;
  provider: string;
  api_key: string;
  is_default: boolean;
}

interface DecompositionRequest {
  taskTitle: string;
  taskDescription?: string;
  context?: string;
}

interface DecompositionResult {
  success: boolean;
  subtasks: string[];
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
    } catch (error) {
      console.error('Erreur chargement fournisseurs LLM:', error);
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
      const prompt = `Décomposez la tâche suivante en sous-tâches spécifiques et actionnables :

Tâche : ${request.taskTitle}
${request.taskDescription ? `Description : ${request.taskDescription}` : ''}
${request.context ? `Contexte : ${request.context}` : ''}

Répondez uniquement avec une liste de sous-tâches, une par ligne, sans numérotation ni formatage spécial. Chaque sous-tâche doit être claire, spécifique et réalisable.`;

      let subtasks: string[] = [];

      if (defaultProvider.provider === 'openai') {
        subtasks = await callOpenAI(defaultProvider.api_key, prompt);
      } else if (defaultProvider.provider === 'anthropic') {
        subtasks = await callAnthropic(defaultProvider.api_key, prompt);
      } else {
        throw new Error(`Fournisseur ${defaultProvider.provider} non supporté`);
      }

      return {
        success: true,
        subtasks: subtasks.filter(task => task.trim().length > 0)
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

  const callOpenAI = async (apiKey: string, prompt: string): Promise<string[]> => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
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
      throw new Error(`Erreur OpenAI: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    return content
      .split('\n')
      .map((line: string) => line.replace(/^[-•*\d.\s]+/, '').trim())
      .filter((line: string) => line.length > 0);
  };

  const callAnthropic = async (apiKey: string, prompt: string): Promise<string[]> => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
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
      throw new Error(`Erreur Anthropic: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0]?.text || '';
    
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
