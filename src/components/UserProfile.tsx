
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User, Calendar, Mail, Edit2, Save, X, Database } from 'lucide-react';
import { format } from 'date-fns';
import { UniversalDataManager } from './tools/common/UniversalDataManager';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  username: string;
  date_of_birth: string;
  bio: string;
  notes: string;
  preferences: any;
  is_public: boolean;
  avatar_url: string;
  last_login: string;
  created_at: string;
  updated_at: string;
}

export const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDataManager, setShowDataManager] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    date_of_birth: '',
    bio: '',
    notes: '',
    is_public: true,
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le profil",
          variant: "destructive",
        });
        return;
      }

      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        username: data.username || '',
        date_of_birth: data.date_of_birth || '',
        bio: data.bio || '',
        notes: data.notes || '',
        is_public: data.is_public || true,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user?.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });

      await fetchProfile();
      setIsEditing(false);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        date_of_birth: profile.date_of_birth || '',
        bio: profile.bio || '',
        notes: profile.notes || '',
        is_public: profile.is_public || true,
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Profil non trouvé</p>
        </CardContent>
      </Card>
    );
  }

  if (showDataManager) {
    return (
      <div className="space-y-6">
        <Button 
          variant="outline" 
          onClick={() => setShowDataManager(false)}
          className="mb-4"
        >
          ← Retour au profil
        </Button>
        <UniversalDataManager />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Mon Profil
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDataManager(true)}
            >
              <Database className="w-4 h-4 mr-2" />
              Gérer mes données
            </Button>
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations de base */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{profile.email}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="full_name">Nom complet</Label>
                {isEditing ? (
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Votre nom complet"
                  />
                ) : (
                  <p className="mt-1 text-sm">{profile.full_name || 'Non renseigné'}</p>
                )}
              </div>

              <div>
                <Label htmlFor="username">Nom d'utilisateur</Label>
                {isEditing ? (
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Votre nom d'utilisateur (3-30 caractères)"
                    minLength={3}
                    maxLength={30}
                  />
                ) : (
                  <p className="mt-1 text-sm">{profile.username || 'Non renseigné'}</p>
                )}
              </div>

              <div>
                <Label htmlFor="date_of_birth">Date de naissance</Label>
                {isEditing ? (
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {profile.date_of_birth 
                        ? format(new Date(profile.date_of_birth), 'dd/MM/yyyy')
                        : 'Non renseigné'
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Informations étendues */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="bio">Biographie</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Décrivez-vous en quelques mots..."
                    maxLength={500}
                    rows={4}
                  />
                ) : (
                  <p className="mt-1 text-sm whitespace-pre-wrap">
                    {profile.bio || 'Aucune biographie'}
                  </p>
                )}
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.bio.length}/500 caractères
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_public">Profil public</Label>
                  {isEditing ? (
                    <Switch
                      id="is_public"
                      checked={formData.is_public}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, is_public: checked })
                      }
                    />
                  ) : (
                    <span className={`text-sm px-2 py-1 rounded ${
                      profile.is_public 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {profile.is_public ? 'Public' : 'Privé'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {profile.is_public 
                    ? 'Votre profil est visible par les autres utilisateurs'
                    : 'Votre profil est privé'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Notes personnelles */}
          <div>
            <Label htmlFor="notes">Notes personnelles</Label>
            {isEditing ? (
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Vos notes personnelles (visibles uniquement par vous)"
                rows={3}
              />
            ) : (
              <p className="mt-1 text-sm whitespace-pre-wrap">
                {profile.notes || 'Aucune note'}
              </p>
            )}
          </div>

          {/* Informations de compte */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Informations du compte</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Membre depuis :</span>{' '}
                {format(new Date(profile.created_at), 'dd/MM/yyyy')}
              </div>
              <div>
                <span className="font-medium">Dernière connexion :</span>{' '}
                {profile.last_login 
                  ? format(new Date(profile.last_login), 'dd/MM/yyyy à HH:mm')
                  : 'Jamais'
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
