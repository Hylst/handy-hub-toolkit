
import { Calendar, Home, Calculator, CheckSquare, Palette, Heart, FileText, Shield, Settings } from "lucide-react";
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
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const AppSidebar = ({ activeSection, setActiveSection }: AppSidebarProps) => {
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
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      onClick={() => setActiveSection(item.id)}
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
        <div className="p-2 text-center">
          <p className="text-xs text-gray-500">v1.0.0</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
