
import { useIndexedDBManager } from './useIndexedDBManager';

// Configuration complète de la base de données pour tous les outils
const APP_DATABASE_CONFIG = {
  dbName: 'ToolsAppDatabase',
  version: 1,
  stores: [
    // Productivité
    {
      name: 'productivity-tasks',
      keyPath: 'id',
      indexes: [
        { name: 'timestamp', keyPath: 'timestamp' },
        { name: 'tool', keyPath: 'tool' }
      ]
    },
    {
      name: 'productivity-goals',
      keyPath: 'id',
      indexes: [
        { name: 'timestamp', keyPath: 'timestamp' },
        { name: 'tool', keyPath: 'tool' }
      ]
    },
    {
      name: 'productivity-notes',
      keyPath: 'id',
      indexes: [
        { name: 'timestamp', keyPath: 'timestamp' },
        { name: 'tool', keyPath: 'tool' }
      ]
    },
    {
      name: 'productivity-pomodoro',
      keyPath: 'id',
      indexes: [
        { name: 'timestamp', keyPath: 'timestamp' },
        { name: 'tool', keyPath: 'tool' }
      ]
    },
    // Générateurs et Utilitaires
    {
      name: 'password-generator-advanced',
      keyPath: 'id',
      indexes: [
        { name: 'timestamp', keyPath: 'timestamp' },
        { name: 'tool', keyPath: 'tool' }
      ]
    },
    {
      name: 'calculator-history',
      keyPath: 'id',
      indexes: [
        { name: 'timestamp', keyPath: 'timestamp' },
        { name: 'tool', keyPath: 'tool' }
      ]
    },
    {
      name: 'qr-generator-history',
      keyPath: 'id',
      indexes: [
        { name: 'timestamp', keyPath: 'timestamp' },
        { name: 'tool', keyPath: 'tool' }
      ]
    },
    {
      name: 'unit-converter-history',
      keyPath: 'id',
      indexes: [
        { name: 'timestamp', keyPath: 'timestamp' },
        { name: 'tool', keyPath: 'tool' }
      ]
    },
    {
      name: 'date-calculator-history',
      keyPath: 'id',
      indexes: [
        { name: 'timestamp', keyPath: 'timestamp' },
        { name: 'tool', keyPath: 'tool' }
      ]
    },
    // Créativité
    {
      name: 'creativity-logos',
      keyPath: 'id',
      indexes: [
        { name: 'timestamp', keyPath: 'timestamp' },
        { name: 'tool', keyPath: 'tool' }
      ]
    },
    {
      name: 'creativity-colors',
      keyPath: 'id',
      indexes: [
        { name: 'timestamp', keyPath: 'timestamp' },
        { name: 'tool', keyPath: 'tool' }
      ]
    },
    {
      name: 'creativity-gradients',
      keyPath: 'id',
      indexes: [
        { name: 'timestamp', keyPath: 'timestamp' },
        { name: 'tool', keyPath: 'tool' }
      ]
    },
    {
      name: 'creativity-patterns',
      keyPath: 'id',
      indexes: [
        { name: 'timestamp', keyPath: 'timestamp' },
        { name: 'tool', keyPath: 'tool' }
      ]
    },
    // Préférences utilisateur
    {
      name: 'user-preferences',
      keyPath: 'id',
      indexes: [
        { name: 'timestamp', keyPath: 'timestamp' },
        { name: 'category', keyPath: 'category' }
      ]
    },
    // Export/Import
    {
      name: 'export-history',
      keyPath: 'id',
      indexes: [
        { name: 'timestamp', keyPath: 'timestamp' },
        { name: 'type', keyPath: 'type' }
      ]
    }
  ]
};

export const useAppDatabase = () => {
  return useIndexedDBManager(APP_DATABASE_CONFIG);
};
