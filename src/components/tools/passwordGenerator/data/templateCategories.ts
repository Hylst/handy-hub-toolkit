import { LucideIcon, Zap, Shield, Users, Gamepad2, Briefcase, Star, Wifi, Database, Globe, Lock, Heart, Cake, Music, Camera, Palette, Car, Home, Plane, Coffee } from "lucide-react";

export interface PasswordTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  security: "low" | "medium" | "high" | "maximum";
  useCase: string[];
  settings: {
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
  };
  popularity?: number;
  isQuick?: boolean;
}

export const templateCategories = {
  quick: {
    name: "Accès Rapide",
    description: "Templates les plus utilisés",
    icon: "Zap",
    color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
  },
  security: {
    name: "Sécurité",
    description: "Protection maximale",
    icon: "Shield",
    color: "text-green-600 bg-green-100 dark:bg-green-900/20"
  },
  social: {
    name: "Réseaux Sociaux",
    description: "Facebook, Twitter, Instagram...",
    icon: "Users",
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/20"
  },
  gaming: {
    name: "Jeux Vidéo",
    description: "Steam, PlayStation, Xbox...",
    icon: "Gamepad2",
    color: "text-purple-600 bg-purple-100 dark:bg-purple-900/20"
  },
  professional: {
    name: "Professionnel",
    description: "Banque, travail, entreprise...",
    icon: "Briefcase",
    color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20"
  },
  special: {
    name: "Spécialisé",
    description: "Cas d'usage spécifiques",
    icon: "Star",
    color: "text-orange-600 bg-orange-100 dark:bg-orange-900/20"
  }
};

export const passwordTemplates: PasswordTemplate[] = [
  // Accès Rapide (Quick)
  {
    id: "quick-balanced",
    name: "Équilibré",
    description: "Bon compromis sécurité/facilité",
    category: "quick",
    icon: "Zap",
    security: "medium",
    useCase: ["Usage général", "Comptes secondaires"],
    settings: {
      length: 12,
      upper: true,
      lower: true,
      numbers: true,
      symbols: true,
      excludeSimilar: true,
      excludeAmbiguous: false,
      requireEvery: true
    },
    popularity: 10,
    isQuick: true
  },
  {
    id: "quick-simple",
    name: "Simple",
    description: "Facile à retenir",
    category: "quick",
    icon: "Zap",
    security: "low",
    useCase: ["Comptes temporaires", "Tests"],
    settings: {
      length: 8,
      upper: true,
      lower: true,
      numbers: true,
      symbols: false,
      excludeSimilar: true,
      excludeAmbiguous: true,
      requireEvery: false,
      pronounceable: true
    },
    popularity: 8,
    isQuick: true
  },
  {
    id: "quick-strong",
    name: "Fort",
    description: "Sécurité renforcée",
    category: "quick",
    icon: "Shield",
    security: "high",
    useCase: ["Comptes importants", "Usage quotidien"],
    settings: {
      length: 16,
      upper: true,
      lower: true,
      numbers: true,
      symbols: true,
      excludeSimilar: true,
      excludeAmbiguous: false,
      requireEvery: true,
      avoidSequences: true
    },
    popularity: 9,
    isQuick: true
  },

  // Sécurité
  {
    id: "security-ultra",
    name: "Ultra Sécurisé",
    description: "Protection maximale",
    category: "security",
    icon: "Lock",
    security: "maximum",
    useCase: ["Banque", "Crypto", "Documents sensibles"],
    settings: {
      length: 32,
      upper: true,
      lower: true,
      numbers: true,
      symbols: true,
      excludeSimilar: true,
      excludeAmbiguous: false,
      requireEvery: true,
      avoidSequences: true,
      customChars: "!@#$%^&*()_+-=[]{}|;:,.<>?"
    },
    popularity: 7
  },
  {
    id: "security-government",
    name: "Niveau Gouvernemental",
    description: "Standards militaires",
    category: "security",
    icon: "Shield",
    security: "maximum",
    useCase: ["Sécurité nationale", "Données classifiées"],
    settings: {
      length: 20,
      upper: true,
      lower: true,
      numbers: true,
      symbols: true,
      excludeSimilar: true,
      excludeAmbiguous: true,
      requireEvery: true,
      avoidSequences: true,
      customChars: "!@#$%&*+-="
    },
    popularity: 3
  },
  {
    id: "security-crypto",
    name: "Crypto & Blockchain",
    description: "Pour portefeuilles crypto",
    category: "security",
    icon: "Database",
    security: "maximum",
    useCase: ["Portefeuilles crypto", "Exchanges", "DeFi"],
    settings: {
      length: 24,
      upper: true,
      lower: true,
      numbers: true,
      symbols: true,
      excludeSimilar: false,
      excludeAmbiguous: false,
      requireEvery: true,
      avoidSequences: true
    },
    popularity: 5
  },

  // Réseaux Sociaux
  {
    id: "social-facebook",
    name: "Facebook/Meta",
    description: "Optimisé pour Facebook",
    category: "social",
    icon: "Users",
    security: "medium",
    useCase: ["Facebook", "Instagram", "WhatsApp", "Messenger"],
    settings: {
      length: 14,
      upper: true,
      lower: true,
      numbers: true,
      symbols: true,
      excludeSimilar: true,
      excludeAmbiguous: true,
      requireEvery: true,
      customChars: "!@#$%&*"
    },
    popularity: 6
  },
  {
    id: "social-twitter",
    name: "Twitter/X",
    description: "Pour Twitter et X",
    category: "social",
    icon: "Globe",
    security: "medium",
    useCase: ["Twitter", "X", "Réseaux publics"],
    settings: {
      length: 12,
      upper: true,
      lower: true,
      numbers: true,
      symbols: true,
      excludeSimilar: true,
      excludeAmbiguous: true,
      requireEvery: false
    },
    popularity: 4
  },
  {
    id: "social-professional",
    name: "LinkedIn",
    description: "Réseaux professionnels",
    category: "social",
    icon: "Briefcase",
    security: "high",
    useCase: ["LinkedIn", "Réseaux pros", "Carrière"],
    settings: {
      length: 16,
      upper: true,
      lower: true,
      numbers: true,
      symbols: true,
      excludeSimilar: true,
      excludeAmbiguous: true,
      requireEvery: true
    },
    popularity: 5
  },

  // Jeux Vidéo
  {
    id: "gaming-steam",
    name: "Steam",
    description: "Pour Steam et jeux PC",
    category: "gaming",
    icon: "Gamepad2",
    security: "medium",
    useCase: ["Steam", "Epic Games", "Jeux PC"],
    settings: {
      length: 14,
      upper: true,
      lower: true,
      numbers: true,
      symbols: true,
      excludeSimilar: true,
      excludeAmbiguous: true,
      requireEvery: true,
      customChars: "!@#$%*"
    },
    popularity: 6
  },
  {
    id: "gaming-console",
    name: "Console",
    description: "PlayStation, Xbox, Nintendo",
    category: "gaming",
    icon: "Gamepad2",
    security: "medium",
    useCase: ["PlayStation", "Xbox", "Nintendo Switch"],
    settings: {
      length: 12,
      upper: true,
      lower: true,
      numbers: true,
      symbols: false,
      excludeSimilar: true,
      excludeAmbiguous: true,
      requireEvery: false,
      pronounceable: true
    },
    popularity: 5
  },
  {
    id: "gaming-mobile",
    name: "Jeux Mobiles",
    description: "Pour smartphones et tablettes",
    category: "gaming",
    icon: "Gamepad2",
    security: "low",
    useCase: ["Jeux mobiles", "App stores"],
    settings: {
      length: 10,
      upper: true,
      lower: true,
      numbers: true,
      symbols: false,
      excludeSimilar: true,
      excludeAmbiguous: true,
      requireEvery: false
    },
    popularity: 4
  },

  // Professionnel
  {
    id: "professional-banking",
    name: "Banque",
    description: "Services bancaires",
    category: "professional",
    icon: "Briefcase",
    security: "maximum",
    useCase: ["Banque en ligne", "Assurance", "Finance"],
    settings: {
      length: 18,
      upper: true,
      lower: true,
      numbers: true,
      symbols: true,
      excludeSimilar: true,
      excludeAmbiguous: true,
      requireEvery: true,
      avoidSequences: true
    },
    popularity: 7
  },
  {
    id: "professional-email",
    name: "Email Professionnel",
    description: "Outlook, Gmail Pro",
    category: "professional",
    icon: "Globe",
    security: "high",
    useCase: ["Email entreprise", "Office 365", "G Suite"],
    settings: {
      length: 16,
      upper: true,
      lower: true,
      numbers: true,
      symbols: true,
      excludeSimilar: true,
      excludeAmbiguous: true,
      requireEvery: true
    },
    popularity: 8
  },
  {
    id: "professional-vpn",
    name: "VPN & Sécurité",
    description: "VPN, antivirus, firewalls",
    category: "professional",
    icon: "Wifi",
    security: "high",
    useCase: ["VPN", "Antivirus", "Sécurité IT"],
    settings: {
      length: 15,
      upper: true,
      lower: true,
      numbers: true,
      symbols: true,
      excludeSimilar: false,
      excludeAmbiguous: false,
      requireEvery: true
    },
    popularity: 4
  },

  // Spécialisé
  {
    id: "special-memorable",
    name: "Mémorisable",
    description: "Facile à retenir",
    category: "special",
    icon: "Heart",
    security: "medium",
    useCase: ["Comptes personnels", "Usage fréquent"],
    settings: {
      length: 12,
      upper: true,
      lower: true,
      numbers: true,
      symbols: false,
      excludeSimilar: true,
      excludeAmbiguous: true,
      requireEvery: false,
      pronounceable: true
    },
    popularity: 6
  },
  {
    id: "special-wifi",
    name: "WiFi",
    description: "Mots de passe WiFi",
    category: "special",
    icon: "Wifi",
    security: "medium",
    useCase: ["Routeur WiFi", "Hotspot", "Partage réseau"],
    settings: {
      length: 16,
      upper: true,
      lower: true,
      numbers: true,
      symbols: false,
      excludeSimilar: true,
      excludeAmbiguous: true,
      requireEvery: true,
      pronounceable: true
    },
    popularity: 5
  },
  {
    id: "special-temporary",
    name: "Temporaire",
    description: "Usage ponctuel",
    category: "special",
    icon: "Coffee",
    security: "low",
    useCase: ["Comptes test", "Accès temporaire"],
    settings: {
      length: 8,
      upper: true,
      lower: true,
      numbers: true,
      symbols: false,
      excludeSimilar: true,
      excludeAmbiguous: true,
      requireEvery: false
    },
    popularity: 3
  }
];

export const getTemplatesByCategory = (category: string) => {
  return passwordTemplates.filter(template => template.category === category);
};

export const getQuickTemplates = () => {
  return passwordTemplates.filter(template => template.isQuick);
};

export const getPopularTemplates = (limit: number = 5) => {
  return passwordTemplates
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, limit);
};

export const getTemplateIcon = (iconName: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    Zap,
    Shield,
    Users,
    Gamepad2,
    Briefcase,
    Star,
    Wifi,
    Database,
    Globe,
    Lock,
    Heart,
    Cake,
    Music,
    Camera,
    Palette,
    Car,
    Home,
    Plane,
    Coffee
  };
  
  return iconMap[iconName] || Shield;
};