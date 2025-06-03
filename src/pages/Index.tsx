import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ToolSection } from "@/components/ToolSection";
import { UserProfile } from "@/components/UserProfile";
import UnitConverter from "@/components/tools/UnitConverter";
import { CalculatorImproved } from "@/components/tools/CalculatorImproved";
import { TodoListEnhanced } from "@/components/tools/TodoListEnhanced";
import { ColorGenerator } from "@/components/tools/ColorGenerator";
import { BMICalculator } from "@/components/tools/BMICalculator";
import { TextUtilsAdvanced } from "@/components/tools/TextUtilsAdvanced";
import { DateCalculatorAdvanced } from "@/components/tools/DateCalculatorAdvanced";
import { ProductivitySuiteModular } from "@/components/tools/ProductivitySuiteModular";
import { PasswordGeneratorAdvanced } from "@/components/tools/PasswordGeneratorAdvanced";
import { QRCodeGenerator } from "@/components/tools/QRCodeGenerator";
import { HealthWellnessSuite } from "@/components/tools/HealthWellnessSuite";
import { About } from "@/components/About";
import { UniversalDataManager } from "@/components/tools/common/UniversalDataManager";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const getSectionTitle = () => {
    switch (activeSection) {
      case "unit-converter": return "Convertisseurs d'Unités";
      case "calculator": return "Calculatrices";
      case "date-calculator-advanced": return "Dates & Temps Avancés";
      case "productivity-suite": return "Suite Productivité";
      case "password-generator-advanced": return "Générateur de Mots de Passe";
      case "color-generator": return "Générateur de Couleurs";
      case "bmi-calculator": return "Calculateur IMC";
      case "health-wellness-suite": return "Suite Santé & Bien-être";
      case "text-utils-advanced": return "Utilitaires Texte Avancés";
      case "data-manager": return "Gestionnaire de Données";
      case "profile": return "Mon Profil";
      case "about": return "À propos";
      default: return "Boîte à Outils Pratiques";
    }
  };

  const handleProfileClick = () => {
    setActiveSection("profile");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "unit-converter":
        return <UnitConverter />;
      case "calculator":
        return <CalculatorImproved />;
      case "date-calculator-advanced":
        return <DateCalculatorAdvanced />;
      case "productivity-suite":
        return <ProductivitySuiteModular />;
      case "password-generator-advanced":
        return <PasswordGeneratorAdvanced />;
      case "color-generator":
        return <ColorGenerator />;
      case "bmi-calculator":
        return <BMICalculator />;
      case "health-wellness-suite":
        return <HealthWellnessSuite />;
      case "text-utils-advanced":
        return <TextUtilsAdvanced />;
      case "data-manager":
        return <UniversalDataManager />;
      case "profile":
        return <UserProfile />;
      case "about":
        return <About />;
      default:
        return (
          <div className="space-y-8">
            <div className="text-center py-8 md:py-12">
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-4">
                Boîte à Outils Pratiques
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6 px-4">
                Une collection d'outils utiles pour votre quotidien. Convertisseurs, calculatrices, 
                outils de productivité et bien plus encore !
              </p>
              
              {!loading && !user && (
                <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
                  <Button 
                    onClick={() => navigate('/auth')}
                    className="bg-gradient-to-r from-blue-600 to-teal-600 w-full sm:w-auto"
                  >
                    Se connecter
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/auth')}
                    className="w-full sm:w-auto"
                  >
                    Créer un compte
                  </Button>
                </div>
              )}
            </div>

            {/* Gestionnaire de données universel */}
            <div className="px-4 md:px-0">
              <Card className="border-2 border-blue-200 dark:border-blue-800 mb-8">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Database className="w-5 h-5 text-blue-600" />
                    Gestion des Données
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Gérez, exportez et importez toutes vos données en un seul endroit.
                  </p>
                  <Button 
                    onClick={() => setActiveSection("data-manager")}
                    className="w-full sm:w-auto"
                    variant="outline"
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Accéder au Gestionnaire
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-4 md:px-0">
              <ToolSection
                title="Convertisseurs Universels"
                description="12 types d'unités : longueurs, poids, températures, devises..."
                icon="⚖️"
                tools={["12 Types d'unités", "Temps réel", "Notes explicatives", "Standards SI", "Débounce optimisé"]}
                onClick={() => setActiveSection("unit-converter")}
              />
              
              <ToolSection
                title="Calculatrices"
                description="Scientifique avec saisie clavier"
                icon="🧮"
                tools={["Scientifique", "Clavier", "Mémoire", "Historique"]}
                onClick={() => setActiveSection("calculator")}
              />
              
              <ToolSection
                title="Dates & Temps Avancés"
                description="Calculateurs complets de dates"
                icon="📅"
                tools={["Différences", "Ajout/Soustraction", "Âge", "Planning", "Fuseaux horaires"]}
                onClick={() => setActiveSection("date-calculator-advanced")}
              />
              
              <ToolSection
                title="Suite Productivité Complète"
                description="Tâches avancées, notes, Pomodoro et to-do list intégrés"
                icon="🚀"
                tools={["Tâches intelligentes", "To-do list améliorée", "Notes avec tags", "Pomodoro", "Statistiques", "Synchronisation"]}
                onClick={() => setActiveSection("productivity-suite")}
              />
              
              <ToolSection
                title="Sécurité Avancée"
                description="Générateur de mots de passe sécurisés avec analyse"
                icon="🔐"
                tools={["Templates sécurisés", "Analyse de force", "Historique", "Export/Import", "Chiffrement"]}
                onClick={() => setActiveSection("password-generator-advanced")}
              />
              
              <ToolSection
                title="Créativité"
                description="Générateurs et outils créatifs"
                icon="🎨"
                tools={["Couleurs", "Palettes", "Design", "Inspiration"]}
                onClick={() => setActiveSection("color-generator")}
              />
              
              <ToolSection
                title="Santé & Bien-être"
                description="Suite complète : IMC, nutrition, sommeil, exercices..."
                icon="💪"
                tools={["IMC Avancé", "Nutrition", "Hydratation", "Sommeil", "Exercices", "Mental", "Médicaments", "Métriques", "Poids", "Objectifs"]}
                onClick={() => setActiveSection("health-wellness-suite")}
              />
              
              <ToolSection
                title="Utilitaires Texte Avancés"
                description="Analyse, formatage, transformation et outils avancés"
                icon="📝"
                tools={["Compteur avancé", "Formatage", "Analyse sentiment", "Transformation", "SEO", "Markdown", "Colorisation", "Emojis"]}
                onClick={() => setActiveSection("text-utils-advanced")}
              />
              
              <ToolSection
                title="À propos"
                description="Informations sur l'application"
                icon="ℹ️"
                tools={["Auteur", "Technologies", "Version", "Licence"]}
                onClick={() => setActiveSection("about")}
              />
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
          
          <SidebarInset>
            {/* Header */}
            <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
                <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
                  {getSectionTitle()}
                </h1>
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
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                {renderContent()}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;
