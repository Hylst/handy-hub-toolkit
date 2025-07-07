
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
      // Construire un prompt détaillé et structuré
      const prompt = `Tu es un expert en gestion de projets et en décomposition de tâches. Ton rôle est d'analyser une tâche principale et de la diviser en sous-tâches spécifiques, actionables et logiquement ordonnées.

RÈGLES STRICTES :
1. Tu DOIS créer entre 3 et 10 sous-tâches (jamais moins de 3, jamais plus de 10)
2. Chaque sous-tâche doit être spécifique, mesurable et actionnable
3. Les sous-tâches doivent suivre un ordre logique d'exécution
4. Répartis intelligemment la durée totale entre les sous-tâches si fournie
5. Adapte la priorité des sous-tâches selon leur importance dans le processus
6. Réponds UNIQUEMENT au format JSON demandé, sans autre texte

TÂCHE À ANALYSER :
Titre : "${request.taskTitle}"
${request.taskDescription ? `Description : "${request.taskDescription}"` : ''}
${request.tags && request.tags.length > 0 ? `Tags existants : [${request.tags.join(', ')}]` : ''}
${request.priority ? `Priorité globale : ${request.priority}` : ''}
${request.category ? `Catégorie : ${request.category}` : ''}
${request.estimatedDuration ? `Durée totale estimée : ${request.estimatedDuration} minutes` : ''}
${request.context ? `Contexte supplémentaire : ${request.context}` : ''}

ANALYSE REQUISE :
- Identifie les différentes phases/étapes nécessaires
- Détermine les prérequis et dépendances entre étapes  
- Estime le temps nécessaire pour chaque sous-tâche
- Assigne une priorité appropriée à chaque sous-tâche

FORMAT DE RÉPONSE OBLIGATOIRE (JSON uniquement) :
{
  "analysis": "Brève analyse de la tâche et de sa complexité",
  "subtasks": [
    {
      "title": "Titre précis de la sous-tâche 1",
      "description": "Description détaillée de ce qu'il faut accomplir exactement",
      "estimatedDuration": 25,
      "priority": "high",
      "order": 1
    },
    {
      "title": "Titre précis de la sous-tâche 2", 
      "description": "Description détaillée avec les actions concrètes à effectuer",
      "estimatedDuration": 35,
      "priority": "medium",
      "order": 2
    }
  ]
}

PRIORITÉS POSSIBLES : "low", "medium", "high"
NOMBRE DE SOUS-TÂCHES : Entre 3 et 10 (obligatoire)

Réponds maintenant en JSON uniquement :`;

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

      console.log('Réponse brute de l\'IA:', result);

      // Parser et valider la réponse JSON
      let parsedResult;
      try {
        // Nettoyer la chaîne pour enlever les backticks et autres caractères indésirables
        const cleanedResult = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsedResult = JSON.parse(cleanedResult);
        
        // Validation de la structure
        if (!parsedResult.subtasks || !Array.isArray(parsedResult.subtasks)) {
          throw new Error('Structure JSON invalide : subtasks manquant ou incorrect');
        }

        // Validation du nombre de sous-tâches
        if (parsedResult.subtasks.length < 3) {
          throw new Error(`Nombre insuffisant de sous-tâches : ${parsedResult.subtasks.length} (minimum 3)`);
        }

        if (parsedResult.subtasks.length > 10) {
          console.warn(`Trop de sous-tâches générées (${parsedResult.subtasks.length}), limitation à 10`);
          parsedResult.subtasks = parsedResult.subtasks.slice(0, 10);
        }

        // Validation et nettoyage de chaque sous-tâche
        parsedResult.subtasks = parsedResult.subtasks.map((subtask: any, index: number) => {
          if (!subtask.title || typeof subtask.title !== 'string') {
            throw new Error(`Sous-tâche ${index + 1} : titre manquant ou invalide`);
          }
          
          return {
            title: subtask.title.trim(),
            description: subtask.description || `Sous-tâche ${index + 1} pour: ${request.taskTitle}`,
            estimatedDuration: typeof subtask.estimatedDuration === 'number' ? 
              Math.max(5, Math.min(240, subtask.estimatedDuration)) : // Entre 5 et 240 minutes
              (request.estimatedDuration ? Math.round(request.estimatedDuration / parsedResult.subtasks.length) : 30),
            priority: ['low', 'medium', 'high'].includes(subtask.priority) ? 
              subtask.priority : request.priority || 'medium',
            order: typeof subtask.order === 'number' ? subtask.order : index + 1
          };
        });

        // Trier par ordre si spécifié
        parsedResult.subtasks.sort((a: SubtaskData, b: SubtaskData) => (a.order || 0) - (b.order || 0));

      } catch (parseError) {
        console.error('Erreur parsing JSON:', parseError);
        console.log('Tentative de parsing manuel...');
        
        // Fallback : parsing manuel si JSON invalide
        const lines = result.split('\n').filter((line: string) => line.trim().length > 0);
        const subtaskLines = lines.filter((line: string) => 
          /^[-•*\d.\s]/.test(line) || line.includes('tâche') || line.includes('étape')
        );
        
        if (subtaskLines.length < 3) {
          // Créer des sous-tâches génériques si parsing impossible
          const baseTitle = request.taskTitle;
          const subtasks = [
            { title: `${baseTitle} - Phase de préparation`, description: 'Analyser les exigences et préparer les ressources nécessaires' },
            { title: `${baseTitle} - Phase de planification`, description: 'Établir un plan détaillé et organiser les étapes' },
            { title: `${baseTitle} - Phase d'exécution principale`, description: 'Réaliser les actions principales de la tâche' },
            { title: `${baseTitle} - Phase de vérification`, description: 'Contrôler la qualité et valider les résultats' },
            { title: `${baseTitle} - Phase de finalisation`, description: 'Terminer, documenter et livrer le travail accompli' }
          ];
          
          parsedResult = { subtasks };
        } else {
          const subtasks = subtaskLines.slice(0, Math.min(10, Math.max(3, subtaskLines.length)))
            .map((line: string, index: number) => {
              const cleanLine = line.replace(/^[-•*\d.\s]+/, '').trim();
              return {
                title: cleanLine || `Sous-tâche ${index + 1} - ${request.taskTitle}`,
                description: `Étape ${index + 1} pour accomplir: ${request.taskTitle}`,
                estimatedDuration: request.estimatedDuration ? 
                  Math.round(request.estimatedDuration / subtaskLines.length) : 30,
                priority: request.priority || 'medium',
                order: index + 1
              };
            });
          
          parsedResult = { subtasks };
        }
      }

      console.log(`✅ ${parsedResult.subtasks.length} sous-tâches générées:`, parsedResult.subtasks);

      return {
        success: true,
        subtasks: parsedResult.subtasks
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
