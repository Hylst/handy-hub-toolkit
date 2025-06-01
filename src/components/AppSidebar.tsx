
import { Calendar, Home, Calculator, CheckSquare, Palette, Heart, FileText, Shield, Settings, Info, User, Database } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const AppSidebar = ({ activeSection, setActiveSection }: AppSidebarProps) => {
  const { user } = useAuth();
  const { setOpenMobile, isMobile } = useSidebar();

  const handleMenuClick = (sectionId: string) => {
    setActiveSection(sectionId);
    // Fermer le menu sur mobile après sélection
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const menuItems = [
    { id: "home", label: "Accueil", icon: Home },
    { id: "data-manager", label: "Gestion Données", icon: Database },
    { id: "unit-converter", label: "Convertisseurs", icon: Calculator },
    { id: "calculator", label: "Calculatrices", icon: Calculator },
    { id: "date-calculator-advanced", label: "Dates & Temps", icon: Calendar },
    { id: "productivity-suite", label: "Suite Productivité", icon: CheckSquare },
    { id: "password-generator-advanced", label: "Sécurité Avancée", icon: Shield },
    { id: "color-generator", label: "Créativité", icon: Palette },
    { id: "bmi-calculator", label: "Santé", icon: Heart },
    { id: "text-utils", label: "Utilitaires Texte", icon: FileText },
    { id: "about", label: "À propos", icon: Info },
  ];

  // Ajouter l'option profil pour les utilisateurs connectés
  const userMenuItems = user ? [
    { id: "profile", label: "Mon Profil", icon: User },
    ...menuItems
  ] : menuItems;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-teal-600 text-white">
            🛠️
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Outils Pratiques</span>
            <span className="truncate text-xs text-gray-500">Plateforme complète</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userMenuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      onClick={() => handleMenuClick(item.id)}
                      isActive={activeSection === item.id}
                      tooltip={item.label}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-2 text-center space-y-1">
          <p className="text-xs text-gray-500">v1.0.0</p>
          <p className="text-xs text-gray-400">Tous droits réservés - Geoffroy Streit</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
