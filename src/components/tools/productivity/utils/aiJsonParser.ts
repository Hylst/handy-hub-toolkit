
interface SubtaskData {
  title: string;
  description: string;
  estimatedDuration?: number;
  priority?: 'low' | 'medium' | 'high';
  order?: number;
}

interface ParseResult {
  success: boolean;
  subtasks: SubtaskData[];
  error?: string;
  recoveryMethod?: string;
}

export class AIJsonParser {
  static parseWithRecovery(rawResponse: string): ParseResult {
    console.log('🧹 Début parsing JSON avec récupération:', rawResponse.substring(0, 200) + '...');
    
    // Méthode 1: Parse direct
    try {
      const directParse = this.directParse(rawResponse);
      if (directParse.success) {
        console.log('✅ Parse direct réussi');
        return directParse;
      }
    } catch (error) {
      console.log('⚠️ Parse direct échoué, tentative de nettoyage...');
    }

    // Méthode 2: Nettoyage agressif puis parse
    try {
      const cleanedParse = this.cleanAndParse(rawResponse);
      if (cleanedParse.success) {
        console.log('✅ Parse après nettoyage réussi');
        return cleanedParse;
      }
    } catch (error) {
      console.log('⚠️ Parse après nettoyage échoué, extraction de patterns...');
    }

    // Méthode 3: Extraction par patterns regex
    try {
      const patternParse = this.extractByPatterns(rawResponse);
      if (patternParse.success) {
        console.log('✅ Parse par patterns réussi');
        return patternParse;
      }
    } catch (error) {
      console.log('⚠️ Parse par patterns échoué, génération par défaut...');
    }

    // Méthode 4: Génération de sous-tâches par défaut
    return this.generateFallbackSubtasks(rawResponse);
  }

  private static directParse(rawResponse: string): ParseResult {
    const parsed = JSON.parse(rawResponse);
    return this.validateAndFormat(parsed, 'direct');
  }

  private static cleanAndParse(rawResponse: string): ParseResult {
    let cleaned = rawResponse.trim();
    
    // Supprimer les backticks markdown
    cleaned = cleaned.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
    
    // Supprimer le texte avant le premier {
    const jsonStart = cleaned.indexOf('{');
    if (jsonStart > 0) {
      cleaned = cleaned.substring(jsonStart);
    }
    
    // Supprimer le texte après le dernier }
    const jsonEnd = cleaned.lastIndexOf('}');
    if (jsonEnd > 0) {
      cleaned = cleaned.substring(0, jsonEnd + 1);
    }
    
    // Nettoyer les caractères de contrôle
    cleaned = cleaned.replace(/[\u0000-\u001f\u007f-\u009f]/g, '');
    
    // Réparer les guillemets manquants
    cleaned = this.repairQuotes(cleaned);
    
    const parsed = JSON.parse(cleaned);
    return this.validateAndFormat(parsed, 'cleaned');
  }

  private static extractByPatterns(rawResponse: string): ParseResult {
    const subtasks: SubtaskData[] = [];
    
    // Pattern 1: Recherche de structures JSON partielles
    const titlePattern = /"title"\s*:\s*"([^"]+)"/gi;
    const descriptionPattern = /"description"\s*:\s*"([^"]+)"/gi;
    const durationPattern = /"estimatedDuration"\s*:\s*(\d+)/gi;
    const priorityPattern = /"priority"\s*:\s*"(low|medium|high)"/gi;
    
    let match;
    const titles: string[] = [];
    const descriptions: string[] = [];
    const durations: number[] = [];
    const priorities: string[] = [];
    
    // Extraire tous les titres
    while ((match = titlePattern.exec(rawResponse)) !== null) {
      titles.push(match[1]);
    }
    
    // Extraire toutes les descriptions
    while ((match = descriptionPattern.exec(rawResponse)) !== null) {
      descriptions.push(match[1]);
    }
    
    // Extraire toutes les durées
    while ((match = durationPattern.exec(rawResponse)) !== null) {
      durations.push(parseInt(match[1]));
    }
    
    // Extraire toutes les priorités
    while ((match = priorityPattern.exec(rawResponse)) !== null) {
      priorities.push(match[1]);
    }
    
    // Reconstituer les sous-tâches
    for (let i = 0; i < titles.length; i++) {
      subtasks.push({
        title: titles[i],
        description: descriptions[i] || `Sous-tâche ${i + 1}`,
        estimatedDuration: durations[i] || 30,
        priority: (priorities[i] as 'low' | 'medium' | 'high') || 'medium',
        order: i + 1
      });
    }
    
    if (subtasks.length >= 3) {
      return {
        success: true,
        subtasks: subtasks.slice(0, 8), // Limiter à 8 max
        recoveryMethod: 'pattern-extraction'
      };
    }
    
    // Pattern 2: Extraction de listes textuelles
    return this.extractFromTextLists(rawResponse);
  }

  private static extractFromTextLists(rawResponse: string): ParseResult {
    const subtasks: SubtaskData[] = [];
    const lines = rawResponse.split('\n').map(line => line.trim()).filter(line => line);
    
    // Chercher des patterns de listes
    const listPatterns = [
      /^[-*•]\s*(.+)$/,           // - item, * item, • item
      /^\d+[\.)]\s*(.+)$/,       // 1. item, 1) item
      /^[a-zA-Z][\.)]\s*(.+)$/,  // a. item, a) item
      /^(.+):\s*(.+)$/           // Titre: Description
    ];
    
    for (const line of lines) {
      for (const pattern of listPatterns) {
        const match = line.match(pattern);
        if (match) {
          const title = match[1].trim();
          const description = match[2]?.trim() || `Sous-tâche: ${title}`;
          
          if (title.length > 5 && title.length < 100) { // Filtrer les titres valides
            subtasks.push({
              title,
              description,
              estimatedDuration: 25 + Math.floor(Math.random() * 35), // 25-60 min
              priority: 'medium' as const,
              order: subtasks.length + 1
            });
          }
          break;
        }
      }
    }
    
    if (subtasks.length >= 3) {
      return {
        success: true,
        subtasks: subtasks.slice(0, 8),
        recoveryMethod: 'text-list-extraction'
      };
    }
    
    throw new Error('Impossible d\'extraire des sous-tâches des listes textuelles');
  }

  private static generateFallbackSubtasks(rawResponse: string): ParseResult {
    console.log('🔄 Génération de sous-tâches par défaut');
    
    // Extraire des mots-clés de la réponse pour personnaliser
    const keywords = this.extractKeywords(rawResponse);
    const baseTitle = keywords.length > 0 ? keywords[0] : 'Tâche';
    
    const fallbackSubtasks: SubtaskData[] = [
      {
        title: `${baseTitle} - Analyse et planification`,
        description: 'Analyser les exigences et établir un plan détaillé',
        estimatedDuration: 30,
        priority: 'high' as const,
        order: 1
      },
      {
        title: `${baseTitle} - Préparation des ressources`,
        description: 'Rassembler tous les outils et matériaux nécessaires',
        estimatedDuration: 20,
        priority: 'medium' as const,
        order: 2
      },
      {
        title: `${baseTitle} - Exécution principale`,
        description: 'Réaliser la partie principale du travail',
        estimatedDuration: 45,
        priority: 'high' as const,
        order: 3
      },
      {
        title: `${baseTitle} - Contrôle qualité`,
        description: 'Vérifier la conformité et la qualité du résultat',
        estimatedDuration: 25,
        priority: 'medium' as const,
        order: 4
      },
      {
        title: `${baseTitle} - Finalisation`,
        description: 'Terminer et documenter le travail accompli',
        estimatedDuration: 20,
        priority: 'low' as const,
        order: 5
      }
    ];
    
    return {
      success: true,
      subtasks: fallbackSubtasks,
      recoveryMethod: 'fallback-generation'
    };
  }

  private static validateAndFormat(parsed: any, method: string): ParseResult {
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Parsed data is not an object');
    }
    
    let subtasks = parsed.subtasks || parsed.tasks || parsed;
    
    if (!Array.isArray(subtasks)) {
      throw new Error('No valid subtasks array found');
    }
    
    // Valider et nettoyer chaque sous-tâche
    const validSubtasks: SubtaskData[] = [];
    
    for (let i = 0; i < subtasks.length; i++) {
      const subtask = subtasks[i];
      
      if (!subtask.title || typeof subtask.title !== 'string') {
        console.warn(`Sous-tâche ${i + 1} ignorée: titre manquant`);
        continue;
      }
      
      const cleanSubtask: SubtaskData = {
        title: subtask.title.trim(),
        description: subtask.description || `Sous-tâche ${i + 1}`,
        estimatedDuration: this.validateDuration(subtask.estimatedDuration),
        priority: this.validatePriority(subtask.priority),
        order: subtask.order || i + 1
      };
      
      validSubtasks.push(cleanSubtask);
    }
    
    if (validSubtasks.length < 3) {
      throw new Error(`Pas assez de sous-tâches valides: ${validSubtasks.length}`);
    }
    
    // Limiter à 8 sous-tâches maximum
    const finalSubtasks = validSubtasks.slice(0, 8);
    
    return {
      success: true,
      subtasks: finalSubtasks,
      recoveryMethod: method
    };
  }

  private static validateDuration(duration: any): number {
    if (typeof duration === 'number' && duration > 0 && duration <= 480) {
      return Math.round(duration);
    }
    return 30; // Valeur par défaut: 30 minutes
  }

  private static validatePriority(priority: any): 'low' | 'medium' | 'high' {
    if (['low', 'medium', 'high'].includes(priority)) {
      return priority;
    }
    return 'medium';
  }

  private static repairQuotes(text: string): string {
    // Réparer les guillemets dans les valeurs JSON
    return text
      .replace(/:\s*([^",}\]]+)([,}\]])/g, ': "$1"$2') // Ajouter des guillemets aux valeurs non-quotées
      .replace(/,(\s*[}\]])/g, '$1'); // Supprimer les virgules en trop
  }

  private static extractKeywords(text: string): string[] {
    // Extraire des mots-clés pertinents du texte
    const words = text.toLowerCase()
      .replace(/[^a-zA-ZÀ-ÿ\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'dans', 'les', 'des', 'une', 'pour', 'avec', 'sur', 'par', 'que', 'qui', 'est', 'son', 'ses', 'aux', 'ces', 'ont', 'pas', 'tout', 'tous'].includes(word));
    
    // Retourner les 3 premiers mots-clés uniques
    return [...new Set(words)].slice(0, 3);
  }
}
