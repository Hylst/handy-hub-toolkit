import { useState, useCallback, useEffect, useMemo } from 'react';
import { useUniversalDataManager } from '@/hooks/useUniversalDataManager';
import { useDexieDB } from '@/hooks/useDexieDB';
import { passwordTemplates } from '../data/templateCategories';

// Enhanced interfaces
export interface PasswordSettings {
  length: number;
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
  requireEvery: boolean;
  customChars?: string;
  avoidSequences?: boolean;
  pronounceable?: boolean;
  minimumEntropy?: number;
  excludeWords?: string[];
  usePattern?: string;
  generatePassphrase?: boolean;
  passphraseWords?: number;
  passphraseSeparator?: string;
}

export interface PasswordStrength {
  score: number;
  level: string;
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
  details: {
    length: number;
    uniqueChars: number;
    characterVariety: number;
    commonWords: string[];
    keyboardPatterns: string[];
    datePatterns: string[];
  };
}

export interface PasswordEntry {
  id: string;
  password: string;
  strength: PasswordStrength;
  settings: PasswordSettings;
  timestamp: number;
  isFavorite: boolean;
  isCopied: boolean;
  templateId?: string;
  category?: string;
  notes?: string;
  usageCount?: number;
  lastUsed?: number;
}

export interface PasswordTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  security: "low" | "medium" | "high" | "maximum";
  useCase: string[];
  settings: PasswordSettings;
  popularity?: number;
  isQuick?: boolean;
  isFavorite?: boolean;
  isCustom?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export interface PasswordStats {
  totalGenerated: number;
  averageStrength: number;
  mostUsedLength: number;
  strongPasswords: number;
  templatesUsed: number;
  favoriteTemplates: string[];
  generationsByDay: Record<string, number>;
  strengthDistribution: Record<string, number>;
  categoryUsage: Record<string, number>;
}

export interface PasswordData {
  history: PasswordEntry[];
  templates: PasswordTemplate[];
  favorites: string[];
  stats: PasswordStats;
  settings: {
    autoSave: boolean;
    maxHistoryEntries: number;
    defaultTemplate?: string;
    showStrengthDetails: boolean;
    enableAnalytics: boolean;
  };
  customWordlists: {
    exclude: string[];
    include: string[];
  };
}

// Enhanced wordlists for better security
const commonPasswords = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'password1',
  'dragon', 'master', '12345', '123123', 'login', 'pass', 'secret'
];

const commonWords = [
  'love', 'money', 'life', 'work', 'time', 'home', 'family', 'friend',
  'world', 'water', 'earth', 'fire', 'music', 'happy', 'smile', 'heart'
];

const keyboardPatterns = [
  'qwerty', 'asdf', 'zxcv', '123456', 'qwertyuiop', 'asdfghjkl',
  'zxcvbnm', '1qaz2wsx', 'qwe123', 'abc123'
];

const datePatterns = /\b(19|20)\d{2}\b|\b(0[1-9]|1[0-2])[\/\-\.](0[1-9]|[12]\d|3[01])[\/\-\.](19|20)?\d{2}\b/g;

// Tool identifier for data storage
const TOOL_NAME = 'passwordGenerator';

// Default data structure
const defaultPasswordData: PasswordData = {
  history: [],
  templates: passwordTemplates,
  favorites: [],
  stats: {
    totalGenerated: 0,
    averageStrength: 0,
    mostUsedLength: 12,
    strongPasswords: 0,
    templatesUsed: 0,
    favoriteTemplates: [],
    generationsByDay: {},
    strengthDistribution: {},
    categoryUsage: {}
  },
  settings: {
    autoSave: true,
    maxHistoryEntries: 100,
    showStrengthDetails: true,
    enableAnalytics: true
  },
  customWordlists: {
    exclude: [],
    include: []
  }
};

export const usePasswordGeneratorEnhanced = () => {
  // State management
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [settings, setSettings] = useState<PasswordSettings>({
    length: 12,
    upper: true,
    lower: true,
    numbers: true,
    symbols: true,
    excludeSimilar: true,
    excludeAmbiguous: false,
    requireEvery: true,
    minimumEntropy: 50,
    excludeWords: [],
    generatePassphrase: false,
    passphraseWords: 4,
    passphraseSeparator: '-'
  });

  const [batchSettings, setBatchSettings] = useState({
    count: 10,
    format: 'text' as 'text' | 'csv' | 'json'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [templateFavorites, setTemplateFavorites] = useState<string[]>([]);

  // Data management
  const {
    exportUniversalData,
    importUniversalData,
    resetUniversalData,
    getUniversalStats
  } = useUniversalDataManager();

  const { saveData, loadData } = useDexieDB();
  const [passwordData, setPasswordData] = useState<PasswordData>(defaultPasswordData);
  const [loading, setLoading] = useState(true);

  // Save settings whenever they change
  const saveSettings = useCallback(async (newSettings: PasswordSettings) => {
    try {
      await saveData(`${TOOL_NAME}_settings`, newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [saveData]);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await loadData(`${TOOL_NAME}_settings`);
        if (savedSettings) {
          setSettings(savedSettings);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, [loadData]);

  // Load data on mount
  useEffect(() => {
    const loadPasswordData = async () => {
      try {
        const data = await loadData('passwordGenerator');
        if (data) {
          setPasswordData({ ...defaultPasswordData, ...data });
        }
      } catch (error) {
        console.error('Error loading password data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPasswordData();
  }, [loadData]);

  // Save data function
  const updateData = useCallback(async (newData: PasswordData) => {
    setPasswordData(newData);
    await saveData('passwordGenerator', newData);
  }, [saveData]);

  // Load template favorites and settings from last entry
  useEffect(() => {
    if (passwordData && Object.keys(passwordData).length > 0) {
      if (passwordData.favorites) {
        setTemplateFavorites(passwordData.favorites);
      }
      
      if (passwordData.history && passwordData.history.length > 0) {
        const lastEntry = passwordData.history[0];
        if (lastEntry && lastEntry.settings) {
          setSettings(lastEntry.settings);
        }
      }

      if (passwordData.settings?.defaultTemplate) {
        const defaultTemplate = passwordData.templates?.find(
          t => t.id === passwordData.settings.defaultTemplate
        );
        if (defaultTemplate) {
          setSettings(defaultTemplate.settings);
        }
      }
    }
  }, [passwordData]);

  // Enhanced strength analysis
  const analyzeStrength = useCallback((password: string): PasswordStrength => {
    if (!password) {
      return {
        score: 0,
        level: 'Très faible',
        color: 'text-red-500',
        feedback: ['Aucun mot de passe détecté'],
        entropy: 0,
        crackTime: 'Instantané',
        hasUppercase: false,
        hasLowercase: false,
        hasNumbers: false,
        hasSymbols: false,
        hasSequence: false,
        hasRepeatedChars: false,
        commonPatterns: [],
        details: {
          length: 0,
          uniqueChars: 0,
          characterVariety: 0,
          commonWords: [],
          keyboardPatterns: [],
          datePatterns: []
        }
      };
    }

    const length = password.length;
    const uniqueChars = new Set(password).size;
    
    // Character type detection
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^A-Za-z0-9]/.test(password);
    
    const characterVariety = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;
    
    // Pattern detection
    const hasSequence = /(.)\1{2,}|123|abc|qwe|asd|zxc/i.test(password);
    const hasRepeatedChars = /(.)\1{3,}/.test(password);
    
    // Advanced pattern detection
    const detectedCommonWords = commonWords.filter(word => 
      password.toLowerCase().includes(word)
    );
    
    const detectedKeyboardPatterns = keyboardPatterns.filter(pattern =>
      password.toLowerCase().includes(pattern)
    );
    
    const detectedDatePatterns = [...password.matchAll(datePatterns)].map(match => match[0]);
    
    const commonPatterns: string[] = [];
    
    // Check for common passwords
    if (commonPasswords.includes(password.toLowerCase())) {
      commonPatterns.push('Mot de passe très commun');
    }
    
    // Check for simple patterns
    if (/^[a-z]+\d+$/i.test(password)) {
      commonPatterns.push('Motif simple: lettres suivies de chiffres');
    }
    
    if (/^\d+[a-z]+$/i.test(password)) {
      commonPatterns.push('Motif simple: chiffres suivis de lettres');
    }

    // Entropy calculation
    let charsetSize = 0;
    if (hasLowercase) charsetSize += 26;
    if (hasUppercase) charsetSize += 26;
    if (hasNumbers) charsetSize += 10;
    if (hasSymbols) charsetSize += 32;
    
    const entropy = Math.log2(Math.pow(charsetSize, length));
    
    // Score calculation with enhanced factors
    let score = 0;
    
    // Length factor (0-40 points)
    score += Math.min(length * 3, 40);
    
    // Character variety factor (0-20 points)
    score += characterVariety * 5;
    
    // Unique characters factor (0-15 points)
    score += Math.min((uniqueChars / length) * 15, 15);
    
    // Entropy factor (0-25 points)
    score += Math.min(entropy / 4, 25);
    
    // Penalties
    if (hasSequence) score -= 15;
    if (hasRepeatedChars) score -= 10;
    if (detectedCommonWords.length > 0) score -= detectedCommonWords.length * 5;
    if (detectedKeyboardPatterns.length > 0) score -= detectedKeyboardPatterns.length * 10;
    if (detectedDatePatterns.length > 0) score -= detectedDatePatterns.length * 8;
    if (commonPatterns.length > 0) score -= commonPatterns.length * 10;
    
    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, score));
    
    // Determine level and color
    let level: string;
    let color: string;
    
    if (score >= 90) {
      level = 'Excellent';
      color = 'text-green-600';
    } else if (score >= 75) {
      level = 'Très forte';
      color = 'text-green-500';
    } else if (score >= 60) {
      level = 'Forte';
      color = 'text-blue-500';
    } else if (score >= 40) {
      level = 'Moyenne';
      color = 'text-yellow-500';
    } else if (score >= 20) {
      level = 'Faible';
      color = 'text-orange-500';
    } else {
      level = 'Très faible';
      color = 'text-red-500';
    }
    
    // Crack time estimation
    const combinations = Math.pow(charsetSize, length);
    const secondsToBreak = combinations / (2 * 1000000); // Assuming 1M guesses per second
    
    let crackTime: string;
    if (secondsToBreak < 1) {
      crackTime = 'Instantané';
    } else if (secondsToBreak < 60) {
      crackTime = `${Math.round(secondsToBreak)} secondes`;
    } else if (secondsToBreak < 3600) {
      crackTime = `${Math.round(secondsToBreak / 60)} minutes`;
    } else if (secondsToBreak < 86400) {
      crackTime = `${Math.round(secondsToBreak / 3600)} heures`;
    } else if (secondsToBreak < 31536000) {
      crackTime = `${Math.round(secondsToBreak / 86400)} jours`;
    } else if (secondsToBreak < 31536000000) {
      crackTime = `${Math.round(secondsToBreak / 31536000)} années`;
    } else {
      crackTime = 'Plusieurs siècles';
    }
    
    // Generate feedback
    const feedback: string[] = [];
    
    if (length < 8) {
      feedback.push('Augmentez la longueur à au moins 8 caractères');
    } else if (length < 12) {
      feedback.push('Considérez une longueur de 12+ caractères pour plus de sécurité');
    }
    
    if (characterVariety < 3) {
      feedback.push('Utilisez au moins 3 types de caractères différents');
    }
    
    if (!hasUppercase) feedback.push('Ajoutez des lettres majuscules');
    if (!hasLowercase) feedback.push('Ajoutez des lettres minuscules');
    if (!hasNumbers) feedback.push('Ajoutez des chiffres');
    if (!hasSymbols) feedback.push('Ajoutez des symboles pour renforcer la sécurité');
    
    if (hasSequence) {
      feedback.push('Évitez les séquences communes (123, abc, qwerty)');
    }
    
    if (hasRepeatedChars) {
      feedback.push('Évitez les caractères répétés consécutivement');
    }
    
    if (detectedCommonWords.length > 0) {
      feedback.push('Évitez les mots communs dans votre mot de passe');
    }
    
    if (uniqueChars / length < 0.7) {
      feedback.push('Augmentez la variété des caractères utilisés');
    }
    
    if (score >= 75) {
      feedback.push('Excellent ! Ce mot de passe est très sécurisé');
    } else if (score >= 60) {
      feedback.push('Bon mot de passe avec une sécurité acceptable');
    }

    return {
      score: Math.round(score),
      level,
      color,
      feedback,
      entropy: Math.round(entropy),
      crackTime,
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSymbols,
      hasSequence,
      hasRepeatedChars,
      commonPatterns,
      details: {
        length,
        uniqueChars,
        characterVariety,
        commonWords: detectedCommonWords,
        keyboardPatterns: detectedKeyboardPatterns,
        datePatterns: detectedDatePatterns
      }
    };
  }, []);

  // Enhanced password generation
  const generatePassword = useCallback(async (customSettings?: Partial<PasswordSettings>): Promise<string> => {
    setIsGenerating(true);
    
    try {
      const activeSettings = { ...settings, ...customSettings };
      let password = '';

      if (activeSettings.generatePassphrase) {
        password = await generatePassphrase(activeSettings);
      } else if (activeSettings.usePattern) {
        password = await generatePatternPassword(activeSettings);
      } else if (activeSettings.pronounceable) {
        password = await generatePronounceablePassword(activeSettings);
      } else {
        password = await generateStandardPassword(activeSettings);
      }

      // Apply exclusions and validations
      password = await applySecurityFilters(password, activeSettings);

      // Analyze strength
      const strength = analyzeStrength(password);

      // Check minimum entropy requirement
      if (activeSettings.minimumEntropy && strength.entropy < activeSettings.minimumEntropy) {
        // Retry with longer length
        const newSettings = { ...activeSettings, length: activeSettings.length + 2 };
        return generatePassword(newSettings);
      }

      // Save to history if auto-save is enabled
      if (passwordData?.settings?.autoSave !== false) {
        await savePasswordToHistory(password, strength, activeSettings);
      }

      setCurrentPassword(password);
      return password;
    } finally {
      setIsGenerating(false);
    }
  }, [settings, passwordData, analyzeStrength]);

  // Helper functions for different generation types
  const generatePassphrase = useCallback(async (settings: PasswordSettings): Promise<string> => {
    const words = [
      'correct', 'horse', 'battery', 'staple', 'mountain', 'river', 'ocean', 'forest',
      'sunshine', 'rainbow', 'butterfly', 'elephant', 'keyboard', 'computer', 'journey',
      'adventure', 'mystery', 'treasure', 'wisdom', 'courage', 'freedom', 'harmony'
    ];
    
    const selectedWords = [];
    for (let i = 0; i < (settings.passphraseWords || 4); i++) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      selectedWords.push(randomWord);
    }
    
    return selectedWords.join(settings.passphraseSeparator || '-');
  }, []);

  const generatePatternPassword = useCallback(async (settings: PasswordSettings): Promise<string> => {
    // Pattern-based generation (e.g., "Llll9999" = Letter+lowercase+lowercase+lowercase+digit+digit+digit+digit)
    const pattern = settings.usePattern || 'Llll9999';
    let password = '';
    
    for (const char of pattern) {
      switch (char) {
        case 'L': // Uppercase letter
          password += String.fromCharCode(65 + Math.floor(Math.random() * 26));
          break;
        case 'l': // Lowercase letter
          password += String.fromCharCode(97 + Math.floor(Math.random() * 26));
          break;
        case '9': // Digit
          password += Math.floor(Math.random() * 10).toString();
          break;
        case 'S': // Symbol
          const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
          password += symbols[Math.floor(Math.random() * symbols.length)];
          break;
        default:
          password += char; // Keep literal characters
      }
    }
    
    return password;
  }, []);

  const generatePronounceablePassword = useCallback(async (settings: PasswordSettings): Promise<string> => {
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    const vowels = 'aeiou';
    let password = '';
    
    for (let i = 0; i < settings.length; i++) {
      if (i % 2 === 0) {
        // Add consonant
        let char = consonants[Math.floor(Math.random() * consonants.length)];
        if (settings.upper && Math.random() < 0.3) {
          char = char.toUpperCase();
        }
        password += char;
      } else {
        // Add vowel
        password += vowels[Math.floor(Math.random() * vowels.length)];
      }
      
      // Occasionally add numbers or symbols
      if (settings.numbers && Math.random() < 0.15) {
        password += Math.floor(Math.random() * 10).toString();
      }
      if (settings.symbols && Math.random() < 0.1) {
        const symbols = '!@#$%&*';
        password += symbols[Math.floor(Math.random() * symbols.length)];
      }
    }
    
    return password.slice(0, settings.length);
  }, []);

  const generateStandardPassword = useCallback(async (settings: PasswordSettings): Promise<string> => {
    let charset = '';
    
    if (settings.lower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (settings.upper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (settings.numbers) charset += '0123456789';
    if (settings.symbols) {
      if (settings.customChars) {
        charset += settings.customChars;
      } else {
        charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
      }
    }
    
    if (settings.excludeSimilar) {
      charset = charset.replace(/[0O1lI]/g, '');
    }
    
    if (settings.excludeAmbiguous) {
      charset = charset.replace(/[{}[\]()\/\\'"~,;.<>]/g, '');
    }
    
    if (!charset) {
      throw new Error('Aucun jeu de caractères disponible avec ces paramètres');
    }
    
    let password = '';
    const array = new Uint32Array(settings.length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < settings.length; i++) {
      password += charset[array[i] % charset.length];
    }
    
    // Ensure required character types if specified
    if (settings.requireEvery) {
      password = await ensureRequiredCharacters(password, settings);
    }
    
    return password;
  }, []);

  const ensureRequiredCharacters = useCallback(async (password: string, settings: PasswordSettings): Promise<string> => {
    const required = [];
    if (settings.upper) required.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    if (settings.lower) required.push('abcdefghijklmnopqrstuvwxyz');
    if (settings.numbers) required.push('0123456789');
    if (settings.symbols) required.push(settings.customChars || '!@#$%^&*()_+-=[]{}|;:,.<>?');
    
    const passwordArray = password.split('');
    
    for (const charset of required) {
      if (!new RegExp(`[${charset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(password)) {
        // Replace a random character with one from the missing charset
        const randomIndex = Math.floor(Math.random() * passwordArray.length);
        const randomChar = charset[Math.floor(Math.random() * charset.length)];
        passwordArray[randomIndex] = randomChar;
      }
    }
    
    return passwordArray.join('');
  }, []);

  const applySecurityFilters = useCallback(async (password: string, settings: PasswordSettings): Promise<string> => {
    let filteredPassword = password;
    
    // Check for excluded words
    if (settings.excludeWords && settings.excludeWords.length > 0) {
      for (const word of settings.excludeWords) {
        if (filteredPassword.toLowerCase().includes(word.toLowerCase())) {
          // Regenerate if contains excluded word
          return generateStandardPassword(settings);
        }
      }
    }
    
    // Check for sequences if avoid sequences is enabled
    if (settings.avoidSequences) {
      if (/(.)\1{2,}|123|abc|qwe|asd|zxc/i.test(filteredPassword)) {
        // Regenerate if contains sequences
        return generateStandardPassword(settings);
      }
    }
    
    return filteredPassword;
  }, [generateStandardPassword]);

  // Batch generation
  const generateBatch = useCallback(async (count: number): Promise<PasswordEntry[]> => {
    const passwords: PasswordEntry[] = [];
    
    for (let i = 0; i < count; i++) {
      const password = await generatePassword();
      const strength = analyzeStrength(password);
      const entry: PasswordEntry = {
        id: `batch_${Date.now()}_${i}`,
        password,
        strength,
        settings: { ...settings },
        timestamp: Date.now(),
        isFavorite: false,
        isCopied: false
      };
      passwords.push(entry);
    }
    
    return passwords;
  }, [generatePassword, analyzeStrength, settings]);

  const savePasswordToHistory = useCallback(async (
    password: string,
    strength: PasswordStrength,
    usedSettings: PasswordSettings,
    templateId?: string
  ) => {
    if (!passwordData) return;

    const entry: PasswordEntry = {
      id: `pwd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      password,
      strength,
      settings: usedSettings,
      timestamp: Date.now(),
      isFavorite: false,
      isCopied: false,
      templateId,
      usageCount: 0
    };

    const updatedHistory = [entry, ...passwordData.history];
    const maxEntries = passwordData.settings.maxHistoryEntries || 100;
    
    if (updatedHistory.length > maxEntries) {
      updatedHistory.splice(maxEntries);
    }

    // Update stats
    const today = new Date().toISOString().split('T')[0];
    const updatedStats = {
      ...passwordData.stats,
      totalGenerated: passwordData.stats.totalGenerated + 1,
      averageStrength: calculateAverageStrength([...updatedHistory]),
      strongPasswords: updatedHistory.filter(p => p.strength.score >= 75).length,
      generationsByDay: {
        ...passwordData.stats.generationsByDay,
        [today]: (passwordData.stats.generationsByDay[today] || 0) + 1
      },
      strengthDistribution: {
        ...passwordData.stats.strengthDistribution,
        [strength.level]: (passwordData.stats.strengthDistribution[strength.level] || 0) + 1
      }
    };

    if (templateId) {
      updatedStats.templatesUsed = passwordData.stats.templatesUsed + 1;
    }

    await updateData({
      ...passwordData,
      history: updatedHistory,
      stats: updatedStats
    });
  }, [passwordData, updateData]);

  const calculateAverageStrength = useCallback((history: PasswordEntry[]): number => {
    if (history.length === 0) return 0;
    const sum = history.reduce((acc, entry) => acc + entry.strength.score, 0);
    return Math.round(sum / history.length);
  }, []);

  // Template management
  const applyTemplate = useCallback(async (templateId: string) => {
    const template = passwordData?.templates?.find(t => t.id === templateId) ||
                    passwordTemplates.find(t => t.id === templateId);
    
    if (template) {
      // Force update local settings state immediately
      const newSettings = { ...template.settings };
      setSettings(newSettings);
      
      // Save to storage
      await saveSettings(newSettings);
      
      // Update template usage stats
      if (passwordData) {
        const updatedStats = {
          ...passwordData.stats,
          categoryUsage: {
            ...passwordData.stats.categoryUsage,
            [template.category]: (passwordData.stats.categoryUsage[template.category] || 0) + 1
          }
        };
        
        await updateData({
          ...passwordData,
          stats: updatedStats
        });
      }
      
      // Force re-render trigger
      generatePassword();
    }
  }, [passwordData, updateData, saveSettings, generatePassword]);

  const toggleTemplateFavorite = useCallback(async (templateId: string) => {
    if (!passwordData) return;
    
    const newFavorites = templateFavorites.includes(templateId)
      ? templateFavorites.filter(id => id !== templateId)
      : [...templateFavorites, templateId];
    
    setTemplateFavorites(newFavorites);
    
    await updateData({
      ...passwordData,
      favorites: newFavorites,
      stats: {
        ...passwordData.stats,
        favoriteTemplates: newFavorites
      }
    });
  }, [passwordData, templateFavorites, updateData]);

  const toggleFavorite = useCallback(async (entryId: string) => {
    if (!passwordData) return;

    const updatedHistory = passwordData.history.map(entry =>
      entry.id === entryId ? { ...entry, isFavorite: !entry.isFavorite } : entry
    );

    await updateData({
      ...passwordData,
      history: updatedHistory
    });
  }, [passwordData, updateData]);

  const markAsCopied = useCallback(async (entryId: string) => {
    if (!passwordData) return;

    const updatedHistory = passwordData.history.map(entry =>
      entry.id === entryId ? { 
        ...entry, 
        isCopied: true, 
        lastUsed: Date.now(),
        usageCount: (entry.usageCount || 0) + 1
      } : entry
    );

    await updateData({
      ...passwordData,
      history: updatedHistory
    });
  }, [passwordData, updateData]);

  // Computed values
  const currentStrength = useMemo(() => {
    return currentPassword ? analyzeStrength(currentPassword) : null;
  }, [currentPassword, analyzeStrength]);

  const history = passwordData?.history || [];
  const templates = passwordData?.templates || passwordTemplates;
  const stats = passwordData?.stats || defaultPasswordData.stats;

  return {
    // Core state
    currentPassword,
    settings,
    currentStrength,
    isGenerating,
    loading,

    // Data
    history,
    templates,
    stats,
    templateFavorites,
    batchSettings,

    // Actions
    generatePassword,
    generateBatch,
    analyzeStrength,
    updateSettings: useCallback(async (newSettings: PasswordSettings) => {
      setSettings(newSettings);
      await saveSettings(newSettings);
    }, [saveSettings]),
    setBatchSettings,

    // Template management
    applyTemplate,
    toggleTemplateFavorite,

    // History management
    toggleFavorite,
    markAsCopied,

    // Data management
    exportUniversalData,
    importUniversalData,
    resetUniversalData
  };
};