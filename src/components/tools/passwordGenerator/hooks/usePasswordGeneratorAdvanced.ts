
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
  template: string;
  customChars?: string;
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
}

export interface PasswordTemplate {
  name: string;
  description: string;
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  icon: string;
}

interface PasswordData {
  history: PasswordEntry[];
  templates: Record<string, PasswordTemplate>;
  favorites: string[];
  stats: {
    totalGenerated: number;
    averageStrength: number;
    mostUsedLength: number;
    strongPasswords: number;
  };
}

const defaultPasswordTemplates: Record<string, PasswordTemplate> = {
  custom: { 
    name: "Personnalisé", 
    description: "Configuration manuelle",
    length: 16, 
    includeUppercase: true, 
    includeLowercase: true, 
    includeNumbers: true, 
    includeSymbols: true,
    excludeSimilar: false,
    icon: "⚙️"
  },
  web: { 
    name: "Site Web", 
    description: "Pour comptes en ligne",
    length: 14, 
    includeUppercase: true, 
    includeLowercase: true, 
    includeNumbers: true, 
    includeSymbols: false,
    excludeSimilar: true,
    icon: "🌐"
  },
  banking: { 
    name: "Banque", 
    description: "Sécurité maximale",
    length: 20, 
    includeUppercase: true, 
    includeLowercase: true, 
    includeNumbers: true, 
    includeSymbols: true,
    excludeSimilar: true,
    icon: "🏦"
  },
  gaming: { 
    name: "Gaming", 
    description: "Pour jeux vidéo",
    length: 12, 
    includeUppercase: true, 
    includeLowercase: true, 
    includeNumbers: true, 
    includeSymbols: false,
    excludeSimilar: true,
    icon: "🎮"
  },
  enterprise: { 
    name: "Entreprise", 
    description: "Conforme aux politiques",
    length: 18, 
    includeUppercase: true, 
    includeLowercase: true, 
    includeNumbers: true, 
    includeSymbols: true,
    excludeSimilar: true,
    icon: "🏢"
  },
  wifi: { 
    name: "WiFi", 
    description: "Pour réseaux sans fil",
    length: 24, 
    includeUppercase: true, 
    includeLowercase: true, 
    includeNumbers: true, 
    includeSymbols: true,
    excludeSimilar: true,
    icon: "📶"
  },
  simple: { 
    name: "Simple", 
    description: "Facile à retenir",
    length: 10, 
    includeUppercase: true, 
    includeLowercase: true, 
    includeNumbers: true, 
    includeSymbols: false,
    excludeSimilar: true,
    icon: "📝"
  }
};

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
    template: 'custom',
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
      entropy: 0
    };

    let score = 0;
    let entropy = 0;
    const feedback: string[] = [];

    // Longueur
    if (password.length >= 8) score += 25;
    else feedback.push('Utilisez au moins 8 caractères');
    
    if (password.length >= 12) score += 15;
    if (password.length >= 16) score += 10;

    // Types de caractères
    if (/[a-z]/.test(password)) score += 10;
    else feedback.push('Ajoutez des minuscules');
    
    if (/[A-Z]/.test(password)) score += 10;
    else feedback.push('Ajoutez des majuscules');
    
    if (/[0-9]/.test(password)) score += 10;
    else feedback.push('Ajoutez des chiffres');
    
    if (/[^A-Za-z0-9]/.test(password)) score += 20;
    else feedback.push('Ajoutez des symboles');

    // Complexité
    const charsetSize = (
      (/[a-z]/.test(password) ? 26 : 0) +
      (/[A-Z]/.test(password) ? 26 : 0) +
      (/[0-9]/.test(password) ? 10 : 0) +
      (/[^A-Za-z0-9]/.test(password) ? 32 : 0)
    );
    
    entropy = Math.log2(Math.pow(charsetSize, password.length));
    
    if (entropy >= 60) score += 10;

    // Vérification des motifs
    if (!/(.)\1{2,}/.test(password)) score += 5; // Pas de répétitions
    if (!/012|123|234|345|456|567|678|789|890|abc|bcd|cde/.test(password.toLowerCase())) score += 5; // Pas de séquences

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
      entropy: Math.round(entropy)
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
    
    // Garantir les caractères minimum requis
    if (passwordSettings.minNumbers && passwordSettings.includeNumbers) {
      const nums = '0123456789'.replace(passwordSettings.excludeSimilar ? /[01]/g : '', '');
      for (let i = 0; i < passwordSettings.minNumbers; i++) {
        password += nums[Math.floor(Math.random() * nums.length)];
      }
    }
    
    if (passwordSettings.minSymbols && passwordSettings.includeSymbols) {
      let syms = passwordSettings.customChars || '!@#$%^&*()_+-=[]{}|;:,.<>?';
      if (passwordSettings.excludeAmbiguous) {
        syms = syms.replace(/[{}[\]()/\\'"`,;.<>]/g, '');
      }
      for (let i = 0; i < passwordSettings.minSymbols; i++) {
        password += syms[Math.floor(Math.random() * syms.length)];
      }
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
    let newPassword: string;
    
    if (settings.pronounceable) {
      newPassword = generatePronounceablePassword(settings.length);
    } else {
      newPassword = generateStandardPassword(settings);
    }

    if (!newPassword) return;

    const strength = analyzeStrength(newPassword);
    
    const entry: PasswordEntry = {
      id: Date.now().toString(),
      password: newPassword,
      timestamp: Date.now(),
      settings: { ...settings },
      strength,
      copied: false,
      favorite: false
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
  }, [settings, passwordData, setPasswordData, generateStandardPassword, generatePronounceablePassword, analyzeStrength]);

  // Appliquer un template
  const applyTemplate = useCallback((templateKey: string) => {
    const template = passwordData?.templates[templateKey] || defaultPasswordTemplates[templateKey];
    if (template && templateKey !== 'custom') {
      setSettings({
        ...settings,
        length: template.length,
        includeUppercase: template.includeUppercase,
        includeLowercase: template.includeLowercase,
        includeNumbers: template.includeNumbers,
        includeSymbols: template.includeSymbols,
        excludeSimilar: template.excludeSimilar,
        template: templateKey
      });
    } else {
      setSettings({ ...settings, template: templateKey });
    }
  }, [settings, passwordData?.templates]);

  // Basculer favori
  const toggleFavorite = useCallback(async (entryId: string) => {
    const updatedHistory = (passwordData?.history || []).map(entry =>
      entry.id === entryId
        ? { ...entry, favorite: !entry.favorite }
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
        ? { ...entry, copied: true }
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
