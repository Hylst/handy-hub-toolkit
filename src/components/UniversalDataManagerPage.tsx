
import { UniversalDataManager } from './tools/common/UniversalDataManager';

export const UniversalDataManagerPage = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Gestion des Données
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez, exportez et importez toutes les données de vos outils en un seul endroit.
          </p>
        </div>
        
        <UniversalDataManager />
      </div>
    </div>
  );
};
