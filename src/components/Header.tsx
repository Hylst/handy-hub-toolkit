
import { Menu, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onMenuClick: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Header = ({ onMenuClick, activeSection, setActiveSection }: HeaderProps) => {
  const { user } = useAuth();
  
  const getSectionTitle = () => {
    switch (activeSection) {
      case "unit-converter": return "Convertisseurs d'Unités";
      case "calculator": return "Calculatrices";
      case "date-calculator": return "Calculateurs de Dates";
      case "todo": return "Productivité";
      case "password-generator": return "Générateur de Mots de Passe";
      case "qr-code": return "Générateur QR Code";
      case "color-generator": return "Générateur de Couleurs";
      case "bmi-calculator": return "Calculateur IMC";
      case "text-utils": return "Utilitaires Texte";
      default: return "Boîte à Outils Pratiques";
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            {activeSection !== "home" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveSection("home")}
                className="hidden sm:flex"
              >
                <Home className="w-4 h-4 mr-2" />
                Accueil
              </Button>
            )}
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
              {getSectionTitle()}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <span>🛠️</span>
            <span>Outils Pratiques</span>
          </div>
          
          <ThemeToggle />
          
          {user ? (
            <UserMenu />
          ) : (
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/auth'}
              className="hidden sm:flex"
            >
              Connexion
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
