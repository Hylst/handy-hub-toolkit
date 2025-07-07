
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
  priority?: 'low' | 'medium' | 'high';
  order?: number;
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
      // Prompt ultra-strict pour forcer la création de multiples sous-tâches
      const prompt = `RÈGLES STRICTES À RESPECTER ABSOLUMENT :
1. Tu DOIS créer EXACTEMENT entre 4 et 8 sous-tâches (jamais moins de 4, jamais plus de 8)
2. Réponds UNIQUEMENT en JSON valide, AUCUN autre texte
3. Chaque sous-tâche doit être spécifique et actionnable
4. Ordonne les sous-tâches logiquement

TÂCHE PRINCIPALE :
Titre: "${request.taskTitle}"
${request.taskDescription ? `Description: "${request.taskDescription}"` : ''}
${request.estimatedDuration ? `Durée totale: ${request.estimatedDuration} minutes` : ''}
${request.priority ? `Priorité: ${request.priority}` : ''}
${request.category ? `Catégorie: ${request.category}` : ''}

ANALYSE REQUISE :
- Divise cette tâche en étapes logiques et séquentielles
- Chaque étape doit prendre 15-60 minutes
- Assure-toi que toutes les étapes sont nécessaires

FORMAT JSON OBLIGATOIRE (AUCUN AUTRE TEXTE) :
{
  "subtasks": [
    {
      "title": "Étape 1 - Titre précis",
      "description": "Description détaillée des actions à effectuer",
      "estimatedDuration": 45,
      "priority": "high",
      "order": 1
    },
    {
      "title": "Étape 2 - Titre précis",
      "description": "Description détaillée des actions à effectuer",
      "estimatedDuration": 30,
      "priority": "medium",
      "order": 2
    },
    {
      "title": "Étape 3 - Titre précis",
      "description": "Description détaillée des actions à effectuer",
      "estimatedDuration": 35,
      "priority": "medium",
      "order": 3
    },
    {
      "title": "Étape 4 - Titre précis",
      "description": "Description détaillée des actions à effectuer",
      "estimatedDuration": 25,
      "priority": "low",
      "order": 4
    }
  ]
}

RÉPONDS UNIQUEMENT AVEC LE JSON, RIEN D'AUTRE !`;

      let result: string;

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

      console.log('🤖 Réponse brute de l\'IA:', result);

      // Nettoyage et parsing plus robuste
      let parsedResult;
      try {
        // Nettoyer agressivement la réponse
        let cleanedResult = result.trim();
        
        // Enlever les backticks markdown
        cleanedResult = cleanedResult.replace(/```json\s*/g, '').replace(/```\s*/g, '');
        
        // Enlever tout texte avant le premier {
        const jsonStart = cleanedResult.indexOf('{');
        if (jsonStart > 0) {
          cleanedResult = cleanedResult.substring(jsonStart);
        }
        
        // Enlever tout texte après le dernier }
        const jsonEnd = cleanedResult.lastIndexOf('}');
        if (jsonEnd > 0) {
          cleanedResult = cleanedResult.substring(0, jsonEnd + 1);
        }
        
        console.log('🧹 JSON nettoyé:', cleanedResult);
        
        parsedResult = JSON.parse(cleanedResult);
        
        // Validation stricte
        if (!parsedResult.subtasks || !Array.isArray(parsedResult.subtasks)) {
          throw new Error('Pas de propriété subtasks ou pas un tableau');
        }

        if (parsedResult.subtasks.length < 3) {
          throw new Error(`Pas assez de sous-tâches : ${parsedResult.subtasks.length}`);
        }

        // Limiter à 8 sous-tâches max
        if (parsedResult.subtasks.length > 8) {
          parsedResult.subtasks = parsedResult.subtasks.slice(0, 8);
        }

        // Valider et nettoyer chaque sous-tâche
        parsedResult.subtasks = parsedResult.subtasks.map((subtask: any, index: number) => {
          if (!subtask.title || typeof subtask.title !== 'string') {
            throw new Error(`Sous-tâche ${index + 1} : titre manquant`);
          }
          
          return {
            title: subtask.title.trim(),
            description: subtask.description || `Sous-tâche ${index + 1} pour: ${request.taskTitle}`,
            estimatedDuration: typeof subtask.estimatedDuration === 'number' ? 
              Math.max(5, Math.min(120, subtask.estimatedDuration)) : 
              (request.estimatedDuration ? Math.round(request.estimatedDuration / parsedResult.subtasks.length) : 30),
            priority: ['low', 'medium', 'high'].includes(subtask.priority) ? 
              subtask.priority : request.priority || 'medium',
            order: typeof subtask.order === 'number' ? subtask.order : index + 1
          };
        });

        // Trier par ordre
        parsedResult.subtasks.sort((a: SubtaskData, b: SubtaskData) => (a.order || 0) - (b.order || 0));

      } catch (parseError) {
        console.error('❌ Erreur parsing JSON:', parseError);
        console.log('🔄 Création de sous-tâches par défaut...');
        
        // Créer des sous-tâches par défaut basées sur le titre
        const baseTitle = request.taskTitle;
        const defaultSubtasks = [
          { title: `${baseTitle} - Analyse et planification`, description: 'Analyser les exigences et établir un plan détaillé' },
          { title: `${baseTitle} - Préparation des ressources`, description: 'Rassembler tous les outils et matériaux nécessaires' },
          { title: `${baseTitle} - Exécution principale`, description: 'Réaliser la partie principale du travail' },
          { title: `${baseTitle} - Contrôle qualité`, description: 'Vérifier la conformité et la qualité du résultat' },
          { title: `${baseTitle} - Finalisation`, description: 'Terminer et documenter le travail accompli' }
        ];
        
        parsedResult = { 
          subtasks: defaultSubtasks.map((subtask, index) => ({
            ...subtask,
            estimatedDuration: request.estimatedDuration ? 
              Math.round(request.estimatedDuration / defaultSubtasks.length) : 30,
            priority: request.priority || 'medium',
            order: index + 1
          }))
        };
      }

      console.log(`✅ ${parsedResult.subtasks.length} sous-tâches générées:`, parsedResult.subtasks);

      return {
        success: true,
        subtasks: parsedResult.subtasks
      };
    } catch (error) {
      console.error('❌ Erreur décomposition IA:', error);
      return {
        success: false,
        subtasks: [],
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    } finally {
      setIsLoading(false);
    }
  }, [defaultProvider]);

  const callOpenAI = async (apiKey: string, prompt: string, selectedModel?: string | null): Promise<string> => {
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
            content: 'Vous êtes un assistant spécialisé dans la décomposition de tâches. Répondez uniquement en JSON valide.'
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
    return data.choices[0]?.message?.content || '';
  };

  const callAnthropic = async (apiKey: string, prompt: string, selectedModel?: string | null): Promise<string> => {
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
    return data.content[0]?.text || '';
  };

  const callGoogle = async (apiKey: string, prompt: string, selectedModel?: string | null): Promise<string> => {
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
    return data.candidates[0]?.content?.parts[0]?.text || '';
  };

  const callDeepSeek = async (apiKey: string, prompt: string, selectedModel?: string | null): Promise<string> => {
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
            content: 'Vous êtes un assistant spécialisé dans la décomposition de tâches. Répondez uniquement en JSON valide.'
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
    return data.choices[0]?.message?.content || '';
  };

  const callOpenRouter = async (apiKey: string, prompt: string, selectedModel?: string | null): Promise<string> => {
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
            content: 'Vous êtes un assistant spécialisé dans la décomposition de tâches. Répondez uniquement en JSON valide.'
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
    return data.choices[0]?.message?.content || '';
  };

  const callXGrok = async (apiKey: string, prompt: string, selectedModel?: string | null): Promise<string> => {
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
            content: 'Vous êtes un assistant spécialisé dans la décomposition de tâches. Répondez uniquement en JSON valide.'
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
    return data.choices[0]?.message?.content || '';
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
