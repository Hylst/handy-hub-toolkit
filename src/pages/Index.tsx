
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ToolSection } from "@/components/ToolSection";
import { UnitConverter } from "@/components/tools/UnitConverter";
import { Calculator } from "@/components/tools/Calculator";
import { TodoList } from "@/components/tools/TodoList";
import { ColorGenerator } from "@/components/tools/ColorGenerator";
import { BMICalculator } from "@/components/tools/BMICalculator";
import { TextUtils } from "@/components/tools/TextUtils";
import { DateCalculator } from "@/components/tools/DateCalculator";
import { PasswordGenerator } from "@/components/tools/PasswordGenerator";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case "unit-converter":
        return <UnitConverter />;
      case "calculator":
        return <Calculator />;
      case "date-calculator":
        return <DateCalculator />;
      case "todo":
        return <TodoList />;
      case "password-generator":
        return <PasswordGenerator />;
      case "color-generator":
        return <ColorGenerator />;
      case "bmi-calculator":
        return <BMICalculator />;
      case "text-utils":
        return <TextUtils />;
      default:
        return (
          <div className="space-y-8">
            <div className="text-center py-12">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-4">
                Boîte à Outils Pratiques
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Une collection d'outils utiles pour votre quotidien. Convertisseurs, calculatrices, 
                outils de productivité et bien plus encore !
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ToolSection
                title="Convertisseurs"
                description="Unités, devises, températures"
                icon="⚖️"
                tools={["Longueurs", "Poids", "Températures", "Devises"]}
                onClick={() => setActiveSection("unit-converter")}
              />
              
              <ToolSection
                title="Calculatrices"
                description="Scientifique, pourcentages, finances"
                icon="🧮"
                tools={["Scientifique", "Pourcentages", "Dates", "Âge"]}
                onClick={() => setActiveSection("calculator")}
              />
              
              <ToolSection
                title="Productivité"
                description="To-do, notes, minuteurs"
                icon="📋"
                tools={["To-Do List", "Notes", "Pomodoro", "Rappels"]}
                onClick={() => setActiveSection("todo")}
              />
              
              <ToolSection
                title="Créativité"
                description="Générateurs et outils créatifs"
                icon="🎨"
                tools={["Couleurs", "Texte", "QR Code", "Noms"]}
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
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        <Header 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        
        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
