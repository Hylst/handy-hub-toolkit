
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ToolSection } from "@/components/ToolSection";
import { UserProfile } from "@/components/UserProfile";
import UnitConverter from "@/components/tools/UnitConverter";
import { CalculatorImproved } from "@/components/tools/CalculatorImproved";
import { TodoList } from "@/components/tools/TodoList";
import { ColorGenerator } from "@/components/tools/ColorGenerator";
import { BMICalculator } from "@/components/tools/BMICalculator";
import { TextUtils } from "@/components/tools/TextUtils";
import { DateCalculatorAdvanced } from "@/components/tools/DateCalculatorAdvanced";
import { ProductivitySuiteModular } from "@/components/tools/ProductivitySuiteModular";
import { PasswordGeneratorAdvanced } from "@/components/tools/PasswordGeneratorAdvanced";
import { QRCodeGenerator } from "@/components/tools/QRCodeGenerator";
import { About } from "@/components/About";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const getSectionTitle = () => {
    switch (activeSection) {
      case "unit-converter": return "Convertisseurs d'Unités";
      case "calculator": return "Calculatrices";
      case "date-calculator-advanced": return "Dates & Temps Avancés";
      case "todo": return "Productivité Simple";
      case "productivity-suite": return "Suite Productivité";
      case "password-generator": return "Générateur de Mots de Passe";
      case "qr-code": return "Générateur QR Code";
      case "color-generator": return "Générateur de Couleurs";
      case "bmi-calculator": return "Calculateur IMC";
      case "text-utils": return "Utilitaires Texte";
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
      case "todo":
        return <TodoList />;
      case "productivity-suite":
        return <ProductivitySuiteModular />;
      case "password-generator":
        return <PasswordGeneratorAdvanced />;
      case "qr-code":
        return <QRCodeGenerator />;
      case "color-generator":
        return <ColorGenerator />;
      case "bmi-calculator":
        return <BMICalculator />;
      case "text-utils":
        return <TextUtils />;
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
                title="Suite Productivité"
                description="Tâches, notes, Pomodoro intégrés"
                icon="🚀"
                tools={["Tâches avancées", "Notes avec tags", "Pomodoro", "Statistiques", "Synchronisation"]}
                onClick={() => setActiveSection("productivity-suite")}
              />
              
              <ToolSection
                title="Productivité Simple"
                description="To-do list rapide et efficace"
                icon="📋"
                tools={["To-Do List", "Simple", "Rapide", "Intuitive"]}
                onClick={() => setActiveSection("todo")}
              />
              
              <ToolSection
                title="Sécurité"
                description="Générateur de mots de passe sécurisés"
                icon="🔐"
                tools={["Mots de passe", "Hash", "Chiffrement", "2FA", "Sécurité renforcée"]}
                onClick={() => setActiveSection("password-generator")}
              />
              
              <ToolSection
                title="QR Code"
                description="Générateur de codes QR personnalisables"
                icon="📱"
                tools={["Texte", "URL", "WiFi", "Contact", "Personnalisable"]}
                onClick={() => setActiveSection("qr-code")}
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
                description="IMC, calories, hydratation"
                icon="💪"
                tools={["IMC", "Calories", "Hydratation", "Sommeil"]}
                onClick={() => setActiveSection("bmi-calculator")}
              />
              
              <ToolSection
                title="Utilitaires Texte"
                description="Compteurs, formatage, analyse"
                icon="📝"
                tools={["Compteur", "Formatage", "Analyse", "Nettoyage"]}
                onClick={() => setActiveSection("text-utils")}
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
