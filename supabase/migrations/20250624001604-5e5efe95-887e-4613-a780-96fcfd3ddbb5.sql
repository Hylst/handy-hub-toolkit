
-- Créer la table user_app_settings avec RLS si elle n'existe pas déjà
CREATE TABLE IF NOT EXISTS public.user_app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  offline_mode BOOLEAN DEFAULT false,
  sync_enabled BOOLEAN DEFAULT true,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.user_app_settings ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent et les recréer
DROP POLICY IF EXISTS "Users can view their own app settings" ON public.user_app_settings;
DROP POLICY IF EXISTS "Users can insert their own app settings" ON public.user_app_settings;
DROP POLICY IF EXISTS "Users can update their own app settings" ON public.user_app_settings;
DROP POLICY IF EXISTS "Users can delete their own app settings" ON public.user_app_settings;

-- Créer les politiques RLS pour user_app_settings
CREATE POLICY "Users can view their own app settings" ON public.user_app_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own app settings" ON public.user_app_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own app settings" ON public.user_app_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own app settings" ON public.user_app_settings
  FOR DELETE USING (auth.uid() = user_id);

-- Créer un trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_app_settings_updated_at ON public.user_app_settings;
CREATE TRIGGER update_user_app_settings_updated_at 
    BEFORE UPDATE ON public.user_app_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
