
-- Vérifier et corriger les politiques RLS pour user_app_settings
-- Supprimer les politiques en double s'il y en a
DROP POLICY IF EXISTS "Users can insert their own settings" ON public.user_app_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_app_settings;
DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_app_settings;

-- Créer des politiques RLS unifiées et optimisées
CREATE POLICY "Users can manage their own app settings" ON public.user_app_settings
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- S'assurer que la contrainte user_id NOT NULL existe pour éviter les erreurs 406
ALTER TABLE public.user_app_settings 
ALTER COLUMN user_id SET NOT NULL;

-- Ajouter un index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_user_app_settings_user_id 
ON public.user_app_settings(user_id);
