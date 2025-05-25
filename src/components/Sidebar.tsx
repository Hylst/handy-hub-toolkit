
import { X, Home, Calculator, Calendar, CheckSquare, Palette, Heart, FileText, Shield, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Sidebar = ({ isOpen, onClose, activeSection, setActiveSection }: SidebarProps) => {
  const menuItems = [
    { id: "home", label: "Accueil", icon: Home },
    { id: "unit-converter", label: "Convertisseurs", icon: Calculator },
    { id: "calculator", label: "Calculatrices", icon: Calculator },
    { id: "date-calculator", label: "Dates & Temps", icon: Calendar },
    { id: "todo", label: "Productivité", icon: CheckSquare },
    { id: "password-generator", label: "Mots de passe", icon: Shield },
    { id: "color-generator", label: "Créativité", icon: Palette },
    { id: "bmi-calculator", label: "Santé", icon: Heart },
    { id: "text-utils", label: "Utilitaires Texte", icon: FileText },
  ];

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-xl z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Outils Pratiques</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors
                  ${activeSection === item.id 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4 p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            🛠️ Plateforme d'outils pratiques
          </p>
        </div>
      </div>
    </>
  );
};
