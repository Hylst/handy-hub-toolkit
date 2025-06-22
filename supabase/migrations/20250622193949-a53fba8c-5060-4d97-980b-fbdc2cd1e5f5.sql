
-- Créer une table pour les événements dans Supabase
CREATE TABLE IF NOT EXISTS public.user_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME,
  type TEXT NOT NULL DEFAULT 'event',
  priority TEXT NOT NULL DEFAULT 'medium',
  description TEXT,
  location TEXT,
  tags TEXT[] DEFAULT '{}',
  is_recurring BOOLEAN DEFAULT false,
  recurring_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Activer RLS
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les événements
CREATE POLICY "Users can view their own events" ON public.user_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own events" ON public.user_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events" ON public.user_events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events" ON public.user_events
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_events_updated_at BEFORE UPDATE ON public.user_events
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Table pour les préférences utilisateur (mode offline/online)
CREATE TABLE IF NOT EXISTS public.user_app_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  offline_mode BOOLEAN DEFAULT false,
  sync_enabled BOOLEAN DEFAULT true,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS pour les paramètres
ALTER TABLE public.user_app_settings ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les paramètres
CREATE POLICY "Users can view their own settings" ON public.user_app_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON public.user_app_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON public.user_app_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_user_app_settings_updated_at BEFORE UPDATE ON public.user_app_settings
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
