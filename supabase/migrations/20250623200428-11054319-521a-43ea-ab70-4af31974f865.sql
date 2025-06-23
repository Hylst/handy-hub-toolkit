
-- Ajouter les politiques RLS manquantes pour user_app_settings seulement
CREATE POLICY "Users can view their own app settings" ON public.user_app_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own app settings" ON public.user_app_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own app settings" ON public.user_app_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own app settings" ON public.user_app_settings
  FOR DELETE USING (auth.uid() = user_id);
