
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';
import { AppSettings } from '@/components/tools/common/AppSettings';
import { LLMSettings } from '@/components/tools/productivity/components/LLMSettings';
import { useAuth } from "@/contexts/AuthContext";
import { UserMenu } from "@/components/UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

const Settings = () => {
  // Utilisation d'un état fixe pour les paramètres
  const [activeSection, setActiveSection] = useState("settings");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Rediriger vers la page principale quand on clique sur d'autres sections
  const handleSectionChange = (section: string) => {
    if (section !== "settings") {
      // Naviguer vers la page principale avec la section demandée
      navigate(`/?section=${section}`);
    }
  };

  const handleProfileClick = () => {
    navigate("/?section=profile");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar activeSection={activeSection} setActiveSection={handleSectionChange} />
          
          <SidebarInset>
            {/* Header */}
            <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
                <Heading level={1} size="lg" className="truncate">
                  Paramètres Utilisateur
                </Heading>
              </div>
              
              <div className="ml-auto flex items-center gap-2 px-4">
                <div className="hidden lg:flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <span>🛠️</span>
                  <span>Outils Pratiques</span>
                </div>
                
                <ThemeToggle />
                
                {user ? (
                  <UserMenu onProfileClick={handleProfileClick} />
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/auth')}
                    className="hidden sm:flex"
                    size="sm"
                  >
                    Connexion
                  </Button>
                )}
              </div>
            </header>
            
            {/* Main Content */}
            <main className="flex-1">
              <Container className="py-6 lg:py-8">
                <div className="space-y-6">
                  {/* En-tête simplifié */}
                  <Card className="border-2 border-blue-200 dark:border-blue-800">
                    <CardHeader className="text-center">
                      <CardTitle className="flex items-center justify-center gap-3 text-xl">
                        <SettingsIcon className="w-5 h-5 text-blue-600" />
                        Paramètres Utilisateur
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Gérez vos préférences personnelles
                      </p>
                    </CardHeader>
                  </Card>

                  {/* Paramètres de l'application */}
                  <AppSettings />

                  {/* Configuration des modèles LLM - maintenant intégrée directement */}
                  <LLMSettings />

                  {/* Note d'information */}
                  <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4">
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        <p className="font-medium mb-1">💡 Conseil</p>
                        <p>Pour gérer vos données et effectuer des exports/imports complets, utilisez le "Gestionnaire de Données" accessible depuis le menu principal.</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Container>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Settings;
