
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info, Brain, CheckSquare, Target, StickyNote, Timer } from 'lucide-react';

interface ToolInfoModalProps {
  toolType: 'tasks' | 'goals' | 'notes' | 'pomodoro';
}

export const ToolInfoModal = ({ toolType }: ToolInfoModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getToolInfo = () => {
    switch (toolType) {
      case 'tasks':
        return {
          icon: <CheckSquare className="w-6 h-6 text-emerald-600" />,
          title: 'Gestionnaire de Tâches Avancé',
          description: 'Gérez vos tâches efficacement avec des fonctionnalités avancées',
          features: [
            'Création et organisation de tâches avec priorités et catégories',
            'Décomposition automatique par IA (4-8 sous-tâches)',
            'Filtrage avancé par mots-clés, catégories et statuts',
            'Analyse des mots-clés et statistiques détaillées',
            'Export vers Google Tasks et iCalendar',
            'Sauvegarde automatique et synchronisation'
          ]
        };
      case 'goals':
        return {
          icon: <Target className="w-6 h-6 text-blue-600" />,
          title: 'Gestionnaire d\'Objectifs',
          description: 'Définissez et suivez vos objectifs à long terme',
          features: [
            'Création d\'objectifs avec échéances',
            'Suivi des progrès en temps réel',
            'Catégorisation par domaines de vie',
            'Rappels et notifications',
            'Visualisation des statistiques'
          ]
        };
      case 'notes':
        return {
          icon: <StickyNote className="w-6 h-6 text-orange-600" />,
          title: 'Gestionnaire de Notes',
          description: 'Organisez vos idées et notes importantes',
          features: [
            'Création de notes avec couleurs personnalisées',
            'Organisation par catégories',
            'Recherche avancée dans le contenu',
            'Épinglage des notes importantes',
            'Markdown et formatage riche'
          ]
        };
      case 'pomodoro':
        return {
          icon: <Timer className="w-6 h-6 text-red-600" />,
          title: 'Minuteur Pomodoro',
          description: 'Améliorez votre productivité avec la technique Pomodoro',
          features: [
            'Cycles de travail de 25 minutes',
            'Pauses courtes et longues',
            'Statistiques de productivité',
            'Personnalisation des durées',
            'Notifications sonores'
          ]
        };
      default:
        return {
          icon: <Info className="w-6 h-6" />,
          title: 'Outil de Productivité',
          description: 'Améliorez votre efficacité',
          features: []
        };
    }
  };

  const toolInfo = getToolInfo();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
        >
          <Info className="w-4 h-4 text-blue-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            {toolInfo.icon}
            {toolInfo.title}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 dark:text-gray-300">
            {toolInfo.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Fonctionnalités principales
            </h3>
            <ul className="space-y-2">
              {toolInfo.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {toolType === 'tasks' && (
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
                🤖 Décomposition IA
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Laissez l'IA analyser votre tâche et créer automatiquement 4 à 8 sous-tâches 
                détaillées et ordonnées logiquement. Plus votre description est précise, 
                meilleure sera la décomposition !
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
