
import { useEffect, useState } from 'react';
import { useDataMigration } from './useDataMigration';
import { useToast } from './use-toast';

export const useAutoMigration = () => {
  const { migrateFromOldSystems } = useDataMigration();
  const { toast } = useToast();
  const [migrationCompleted, setMigrationCompleted] = useState(false);

  useEffect(() => {
    const checkAndMigrate = async () => {
      // Vérifier si la migration a déjà été effectuée
      const migrationFlag = localStorage.getItem('unified-migration-completed');
      
      if (migrationFlag) {
        setMigrationCompleted(true);
        return;
      }

      // Vérifier s'il y a des données à migrer
      const hasOldData = Object.keys(localStorage).some(key => 
        key.startsWith('robust_') || 
        key.startsWith('dexie-fallback-')
      );

      if (hasOldData) {
        console.log('📦 Anciennes données détectées, migration automatique...');
        
        try {
          const migratedCount = await migrateFromOldSystems();
          
          if (migratedCount > 0) {
            localStorage.setItem('unified-migration-completed', 'true');
            setMigrationCompleted(true);
            
            toast({
              title: "Migration automatique terminée",
              description: `${migratedCount} éléments ont été migrés vers le nouveau système de stockage unifié`,
            });
          }
        } catch (error) {
          console.error('❌ Erreur migration automatique:', error);
        }
      } else {
        // Pas de données à migrer, marquer comme terminé
        localStorage.setItem('unified-migration-completed', 'true');
        setMigrationCompleted(true);
      }
    };

    // Attendre un peu avant de migrer pour laisser l'app se charger
    const migrationTimeout = setTimeout(checkAndMigrate, 2000);

    return () => clearTimeout(migrationTimeout);
  }, [migrateFromOldSystems, toast]);

  return { migrationCompleted };
};
