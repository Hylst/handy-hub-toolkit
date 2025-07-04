
-- Corriger la fonction handle_new_user pour la sécurité
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, last_login)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    now()
  );
  RETURN NEW;
END;
$function$;

-- Corriger la fonction update_updated_at_column pour la sécurité
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- Ajouter une colonne pour stocker le modèle sélectionné avec les clés API
ALTER TABLE public.user_llm_api_keys 
ADD COLUMN IF NOT EXISTS selected_model text;

-- Ajouter un commentaire pour documenter la nouvelle colonne
COMMENT ON COLUMN public.user_llm_api_keys.selected_model IS 'Le modèle spécifique sélectionné pour ce fournisseur';
