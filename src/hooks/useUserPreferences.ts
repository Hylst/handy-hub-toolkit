
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserPreference {
  tool_name: string;
  preferences: any;
  last_used: string;
  usage_count: number;
}

export const useUserPreferences = (toolName: string) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && toolName) {
      loadPreferences();
    }
  }, [user, toolName]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('preferences')
        .eq('user_id', user.id)
        .eq('tool_name', toolName)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading preferences:', error);
      } else if (data) {
        setPreferences(data.preferences || {});
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (newPreferences: any) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          tool_name: toolName,
          preferences: newPreferences,
          last_used: new Date().toISOString(),
          usage_count: 1,
        }, {
          onConflict: 'user_id,tool_name',
        });

      if (error) {
        console.error('Error saving preferences:', error);
      } else {
        setPreferences(newPreferences);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const updateUsage = async () => {
    if (!user) return;

    try {
      await supabase.rpc('increment_usage_count', {
        p_user_id: user.id,
        p_tool_name: toolName,
      });
    } catch (error) {
      console.error('Error updating usage:', error);
    }
  };

  return {
    preferences,
    loading,
    savePreferences,
    updateUsage,
  };
};
