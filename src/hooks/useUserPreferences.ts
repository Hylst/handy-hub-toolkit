
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UserPreference {
  id: string;
  tool_name: string;
  preferences: Record<string, any>;
  last_used: string;
  usage_count: number;
}

export const useUserPreferences = (toolName: string) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  // Load preferences when component mounts or user changes
  useEffect(() => {
    if (user) {
      loadPreferences();
    } else {
      setPreferences({});
      setLoading(false);
    }
  }, [user, toolName]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .eq('tool_name', toolName)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading preferences:', error);
        return;
      }

      if (data && data.preferences) {
        // Type assertion to safely convert Json to Record<string, any>
        const prefs = data.preferences as Record<string, any>;
        setPreferences(prefs);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (newPreferences: Record<string, any>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          tool_name: toolName,
          preferences: newPreferences,
          last_used: new Date().toISOString(),
          usage_count: 1
        }, {
          onConflict: 'user_id,tool_name'
        });

      if (error) {
        console.error('Error saving preferences:', error);
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder les préférences.",
          variant: "destructive",
        });
        return;
      }

      setPreferences(newPreferences);
      toast({
        title: "Préférences sauvegardées",
        description: `Vos préférences pour ${toolName} ont été sauvegardées.`,
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const updateUsageCount = async () => {
    if (!user) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('user_preferences')
        .select('usage_count')
        .eq('user_id', user.id)
        .eq('tool_name', toolName)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching usage count:', fetchError);
        return;
      }

      const currentCount = data?.usage_count || 0;

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          tool_name: toolName,
          preferences: preferences,
          last_used: new Date().toISOString(),
          usage_count: currentCount + 1
        }, {
          onConflict: 'user_id,tool_name'
        });

      if (error) {
        console.error('Error updating usage count:', error);
      }
    } catch (error) {
      console.error('Error updating usage count:', error);
    }
  };

  return {
    preferences,
    loading,
    savePreferences,
    updateUsageCount,
  };
};
