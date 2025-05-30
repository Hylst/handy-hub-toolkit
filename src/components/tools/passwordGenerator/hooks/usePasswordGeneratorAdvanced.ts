import { useState, useCallback, useEffect } from 'react';
import { useOfflineDataManager } from '@/hooks/useOfflineDataManager';

export interface PasswordEntry {
  id: string;
  password: string;
  timestamp: number;
  settings: PasswordSettings;
  strength: PasswordStrength;
  copied: boolean;
  favorite: boolean;
  isFavorite: boolean;
  copyCount: number;
  lastCopied?: number;
  notes?: string;
}

export interface PasswordSettings {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
  requireEveryCharType: boolean;
  template: string;
  customCharset: string;
  pronounceable: boolean;
  minNumbers?: number;
  minSymbols?: number;
}

export interface PasswordStrength {
  score: number; // 0-100
  level: 'très faible' | 'faible' | 'moyen' | 'fort' | 'très fort';
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
}

export interface PasswordTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
  requireEveryCharType: boolean;
  icon: string;
  securityLevel: 'basic' | 'medium' | 'high' | 'ultra';
  useCases: string[];
  settings: {
    length: number;
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
    excludeSimilar: boolean;
    excludeAmbiguous: boolean;
    requireEveryCharType: boolean;
  };
}

interface PasswordData {
  history: PasswordEntry[];
  templates: PasswordTemplate[];
  favorites: string[];
  stats: {
    totalGenerated: number;
    averageStrength: number;
    mostUsedLength: number;
    strongPasswords: number;
  };
}

const defaultPasswordTemplates: PasswordTemplate[] = [
  {
    id: 'custom',
    name: "Personnalisé",
    description: "Configuration manuelle",
    category: 'quick',
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
    requireEveryCharType: false,
    icon: "key",
    securityLevel: 'medium',
    useCases: ['Configuration personnalisée'],
    settings: {
      length: 16,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeSimilar: false,
      excludeAmbiguous: false,
      requireEveryCharType: false
    }
  },
  {
    id: 'web',
    name: "Site Web",
    description: "Pour comptes en ligne",
    category: 'quick',
    length: 14,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: false,
    excludeSimilar: true,
    excludeAmbiguous: false,
    requireEveryCharType: true,
    icon: "globe",
    securityLevel: 'medium',
    useCases: ['Comptes en ligne', 'Réseaux sociaux'],
    settings: {
      length: 14,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: false,
      excludeSimilar: true,
      excludeAmbiguous: false,
      requireEveryCharType: true
    }
  },
  {
    id: 'banking',
    name: "Banque",
    description: "Sécurité maximale",
    category: 'security',
    length: 20,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: true,
    excludeAmbiguous: true,
    requireEveryCharType: true,
    icon: "creditcard",
    securityLevel: 'ultra',
    useCases: ['Services bancaires', 'Finances'],
    settings: {
      length: 20,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeSimilar: true,
      excludeAmbiguous: true,
      requireEveryCharType: true
    }
  }
];

const defaultPasswordData: PasswordData = {
  history: [],
  templates: defaultPasswordTemplates,
  favorites: [],
  stats: {
    totalGenerated: 0,
    averageStrength: 0,
    mostUsedLength: 16,
    strongPasswords: 0
  }
};

export const usePasswordGeneratorAdvanced = () => {
  const {
    data: passwordData,
    setData: setPasswordData,
    isLoading,
    isOnline,
    isSyncing,
    lastSyncTime,
    exportData,
    importData,
    resetData
  } = useOfflineDataManager<PasswordData>({
    toolName: 'password-generator-advanced',
    defaultData: defaultPasswordData
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [settings, setSettings] = useState<PasswordSettings>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
    requireEveryCharType: false,
    template: 'custom',
    customCharset: '',
    pronounceable: false,
    minNumbers: 1,
    minSymbols: 1
  });

  // Chargement des préférences
  useEffect(() => {
    if (passwordData && Object.keys(passwordData).length > 0) {
      const lastEntry = passwordData.history[0];
      if (lastEntry) {
        setSettings(lastEntry.settings);
      }
    }
  }, [passwordData]);

  // Analyse de la force du mot de passe
  const analyzeStrength = useCallback((password: string): PasswordStrength => {
    if (!password) return {
      score: 0,
      level: 'très faible',
      color: 'text-gray-500',
      feedback: ['Aucun mot de passe'],
      entropy: 0,
      crackTime: 'Immédiat',
      hasUppercase: false,
      hasLowercase: false,
      hasNumbers: false,
      hasSymbols: false,
      hasSequence: false,
      hasRepeatedChars: false,
      commonPatterns: []
    };

    let score = 0;
    let entropy = 0;
    const feedback: string[] = [];
    const commonPatterns: string[] = [];

    // Analyse des types de caractères
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^A-Za-z0-9]/.test(password);

    // Analyse des motifs
    const hasSequence = /012|123|234|345|456|567|678|789|890|abc|bcd|cde/.test(password.toLowerCase());
    const hasRepeatedChars = /(.)\1{2,}/.test(password);

    // Longueur
    if (password.length >= 8) score += 25;
    else feedback.push('Utilisez au moins 8 caractères');
    
    if (password.length >= 12) score += 15;
    if (password.length >= 16) score += 10;

    // Types de caractères
    if (hasLowercase) score += 10;
    else feedback.push('Ajoutez des minuscules');
    
    if (hasUppercase) score += 10;
    else feedback.push('Ajoutez des majuscules');
    
    if (hasNumbers) score += 10;
    else feedback.push('Ajoutez des chiffres');
    
    if (hasSymbols) score += 20;
    else feedback.push('Ajoutez des symboles');

    // Calcul de l'entropie
    const charsetSize = (
      (hasLowercase ? 26 : 0) +
      (hasUppercase ? 26 : 0) +
      (hasNumbers ? 10 : 0) +
      (hasSymbols ? 32 : 0)
    );
    
    entropy = Math.log2(Math.pow(charsetSize, password.length));
    
    if (entropy >= 60) score += 10;

    // Vérification des motifs
    if (!hasRepeatedChars) score += 5;
    else commonPatterns.push('Caractères répétés');
    
    if (!hasSequence) score += 5;
    else commonPatterns.push('Séquences communes');

    // Calcul du temps de cassage
    let crackTime = 'Immédiat';
    if (entropy > 30) crackTime = 'Quelques minutes';
    if (entropy > 50) crackTime = 'Quelques heures';
    if (entropy > 70) crackTime = 'Quelques années';
    if (entropy > 90) crackTime = 'Des siècles';

    let level: PasswordStrength['level'] = 'très faible';
    let color = 'text-red-500';

    if (score >= 90) {
      level = 'très fort';
      color = 'text-green-600';
    } else if (score >= 70) {
      level = 'fort';
      color = 'text-green-500';
    } else if (score >= 50) {
      level = 'moyen';
      color = 'text-yellow-500';
    } else if (score >= 30) {
      level = 'faible';
      color = 'text-orange-500';
    }

    return {
      score: Math.min(score, 100),
      level,
      color,
      feedback: feedback.slice(0, 3),
      entropy: Math.round(entropy),
      crackTime,
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSymbols,
      hasSequence,
      hasRepeatedChars,
      commonPatterns
    };
  }, []);

  // Génération de mot de passe prononçable
  const generatePronounceablePassword = useCallback((length: number): string => {
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    const vowels = 'aeiou';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';
    
    let password = '';
    let useConsonant = Math.random() > 0.5;
    
    for (let i = 0; i < length; i++) {
      if (i > 0 && i % 4 === 0 && settings.includeNumbers && Math.random() > 0.7) {
        password += numbers[Math.floor(Math.random() * numbers.length)];
      } else if (i > 0 && i % 6 === 0 && settings.includeSymbols && Math.random() > 0.8) {
        password += symbols[Math.floor(Math.random() * symbols.length)];
      } else {
        const chars = useConsonant ? consonants : vowels;
        let char = chars[Math.floor(Math.random() * chars.length)];
        
        if (settings.includeUppercase && Math.random() > 0.7) {
          char = char.toUpperCase();
        }
        
        password += char;
        useConsonant = !useConsonant;
      }
    }
    
    return password;
  }, [settings]);

  // Génération de mot de passe standard
  const generateStandardPassword = useCallback((passwordSettings: PasswordSettings): string => {
    let charset = '';
    const similarChars = 'il1Lo0O';
    const ambiguousChars = '{}[]()/\\\'"`~,;.<>';
    
    if (passwordSettings.includeUppercase) {
      let upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (passwordSettings.excludeSimilar) {
        upperChars = upperChars.replace(/[IL0O]/g, '');
      }
      charset += upperChars;
    }
    
    if (passwordSettings.includeLowercase) {
      let lowerChars = 'abcdefghijklmnopqrstuvwxyz';
      if (passwordSettings.excludeSimilar) {
        lowerChars = lowerChars.replace(/[il0o]/g, '');
      }
      charset += lowerChars;
    }
    
    if (passwordSettings.includeNumbers) {
      let numberChars = '0123456789';
      if (passwordSettings.excludeSimilar) {
        numberChars = numberChars.replace(/[01]/g, '');
      }
      charset += numberChars;
    }
    
    if (passwordSettings.includeSymbols) {
      let symbolChars = passwordSettings.customChars || '!@#$%^&*()_+-=[]{}|;:,.<>?';
      if (passwordSettings.excludeAmbiguous) {
        symbolChars = symbolChars.replace(/[{}[\]()/\\'"`,;.<>]/g, '');
      }
      charset += symbolChars;
    }

    if (charset === '') return '';

    let password = '';
    
    // Garantir les caractères minimum requis si requireEveryCharType est activé
    if (passwordSettings.requireEveryCharType) {
      if (passwordSettings.includeUppercase) password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
      if (passwordSettings.includeLowercase) password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
      if (passwordSettings.includeNumbers) password += '0123456789'[Math.floor(Math.random() * 10)];
      if (passwordSettings.includeSymbols) password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
    }

    // Compléter avec des caractères aléatoires
    while (password.length < passwordSettings.length) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Mélanger le mot de passe
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }, []);

  // Génération principale
  const generatePassword = useCallback(() => {
    let charset = '';
    const similarChars = 'il1Lo0O';
    const ambiguousChars = '{}[]()/\\\'"`~,;.<>';
    
    if (settings.includeUppercase) {
      let upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (settings.excludeSimilar) {
        upperChars = upperChars.replace(/[IL0O]/g, '');
      }
      charset += upperChars;
    }
    
    if (settings.includeLowercase) {
      let lowerChars = 'abcdefghijklmnopqrstuvwxyz';
      if (settings.excludeSimilar) {
        lowerChars = lowerChars.replace(/[il0o]/g, '');
      }
      charset += lowerChars;
    }
    
    if (settings.includeNumbers) {
      let numberChars = '0123456789';
      if (settings.excludeSimilar) {
        numberChars = numberChars.replace(/[01]/g, '');
      }
      charset += numberChars;
    }
    
    if (settings.includeSymbols) {
      let symbolChars = settings.customChars || '!@#$%^&*()_+-=[]{}|;:,.<>?';
      if (settings.excludeAmbiguous) {
        symbolChars = symbolChars.replace(/[{}[\]()/\\'"`,;.<>]/g, '');
      }
      charset += symbolChars;
    }

    if (charset === '') return;

    let password = '';
    
    // Garantir les caractères minimum requis si requireEveryCharType est activé
    if (settings.requireEveryCharType) {
      if (settings.includeUppercase) password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
      if (settings.includeLowercase) password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
      if (settings.includeNumbers) password += '0123456789'[Math.floor(Math.random() * 10)];
      if (settings.includeSymbols) password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
    }

    // Compléter avec des caractères aléatoires
    while (password.length < settings.length) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Mélanger le mot de passe
    const newPassword = password.split('').sort(() => Math.random() - 0.5).join('');

    if (!newPassword) return;

    const strength = analyzeStrength(newPassword);
    
    const entry: PasswordEntry = {
      id: Date.now().toString(),
      password: newPassword,
      timestamp: Date.now(),
      settings: { ...settings },
      strength,
      copied: false,
      favorite: false,
      isFavorite: false,
      copyCount: 0
    };

    const newHistory = [entry, ...(passwordData?.history || [])].slice(0, 50);
    const newStats = {
      totalGenerated: (passwordData?.stats.totalGenerated || 0) + 1,
      averageStrength: Math.round(
        (((passwordData?.stats.averageStrength || 0) * (passwordData?.stats.totalGenerated || 0)) + strength.score) /
        ((passwordData?.stats.totalGenerated || 0) + 1)
      ),
      mostUsedLength: settings.length,
      strongPasswords: (passwordData?.stats.strongPasswords || 0) + (strength.score >= 70 ? 1 : 0)
    };

    setPasswordData({
      ...passwordData,
      history: newHistory,
      stats: newStats
    });

    setCurrentPassword(newPassword);
  }, [settings, passwordData, setPasswordData, analyzeStrength]);

  // Appliquer un template
  const applyTemplate = useCallback((templateId: string) => {
    const template = passwordData?.templates.find(t => t.id === templateId) || defaultPasswordTemplates.find(t => t.id === templateId);
    if (template && templateId !== 'custom') {
      setSettings({
        ...settings,
        length: template.length,
        includeUppercase: template.includeUppercase,
        includeLowercase: template.includeLowercase,
        includeNumbers: template.includeNumbers,
        includeSymbols: template.includeSymbols,
        excludeSimilar: template.excludeSimilar,
        excludeAmbiguous: template.excludeAmbiguous,
        requireEveryCharType: template.requireEveryCharType,
        template: templateId
      });
    } else {
      setSettings({ ...settings, template: templateId });
    }
  }, [settings, passwordData?.templates]);

  // Basculer favori
  const toggleFavorite = useCallback(async (entryId: string) => {
    const updatedHistory = (passwordData?.history || []).map(entry =>
      entry.id === entryId
        ? { ...entry, favorite: !entry.favorite, isFavorite: !entry.isFavorite }
        : entry
    );

    await setPasswordData({
      ...passwordData,
      history: updatedHistory
    });
  }, [passwordData, setPasswordData]);

  // Marquer comme copié
  const markAsCopied = useCallback(async (entryId: string) => {
    const updatedHistory = (passwordData?.history || []).map(entry =>
      entry.id === entryId
        ? { ...entry, copied: true, copyCount: (entry.copyCount || 0) + 1, lastCopied: Date.now() }
        : entry
    );

    await setPasswordData({
      ...passwordData,
      history: updatedHistory
    });
  }, [passwordData, setPasswordData]);

  return {
    currentPassword,
    settings,
    setSettings,
    history: passwordData?.history || [],
    templates: passwordData?.templates || defaultPasswordTemplates,
    stats: passwordData?.stats || defaultPasswordData.stats,
    generatePassword,
    applyTemplate,
    toggleFavorite,
    markAsCopied,
    analyzeStrength: (password: string) => analyzeStrength(password),
    currentStrength: analyzeStrength(currentPassword),
    isLoading,
    isOnline,
    isSyncing,
    lastSyncTime,
    exportData,
    importData,
    resetData
  };
};
