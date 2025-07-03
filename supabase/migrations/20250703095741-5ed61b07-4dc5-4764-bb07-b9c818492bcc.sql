
-- Créer une table pour stocker les clés API des modèles LLM
CREATE TABLE public.user_llm_api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  provider TEXT NOT NULL, -- openai, anthropic, google, deepseek, openrouter, xgrok
  api_key TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajouter RLS pour sécuriser les clés API
ALTER TABLE public.user_llm_api_keys ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs ne voient que leurs propres clés
CREATE POLICY "Users can view their own API keys" 
  ON public.user_llm_api_keys 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Politique pour créer leurs propres clés
CREATE POLICY "Users can create their own API keys" 
  ON public.user_llm_api_keys 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Politique pour mettre à jour leurs propres clés
CREATE POLICY "Users can update their own API keys" 
  ON public.user_llm_api_keys 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Politique pour supprimer leurs propres clés
CREATE POLICY "Users can delete their own API keys" 
  ON public.user_llm_api_keys 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger pour mise à jour automatique du timestamp
CREATE TRIGGER update_user_llm_api_keys_updated_at
  BEFORE UPDATE ON public.user_llm_api_keys
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Contrainte pour s'assurer qu'il n'y a qu'un seul modèle par défaut par utilisateur
CREATE UNIQUE INDEX unique_default_per_user 
ON public.user_llm_api_keys (user_id) 
WHERE is_default = true;
