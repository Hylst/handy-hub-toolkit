
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info, CheckSquare, Target, Clock, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ToolInfoModalProps {
  toolType: 'tasks' | 'goals' | 'pomodoro' | 'notes';
}

const toolInfo = {
  tasks: {
    title: 'Gestionnaire de Tâches Pro',
    icon: CheckSquare,
    description: 'Un système avancé de gestion des tâches avec priorités, catégories et fonctionnalités collaboratives.',
    features: [
      'Création de tâches avec priorités (Haute, Moyenne, Basse)',
      'Organisation par catégories personnalisées',
      'Système de tags pour un classement flexible',
      'Dates d\'échéance avec rappels visuels',
      'Filtres avancés par statut, priorité et catégorie',
      'Statistiques détaillées de productivité',
      'Export vers Google Tasks et calendriers',
      'Découpe en sous-tâches avec héritage',
      'Tri intelligent par mots-clés'
    ],
    usage: [
      '1. Cliquez sur "Nouvelle tâche" pour créer une tâche',
      '2. Remplissez le titre, description et métadonnées',
      '3. Définissez la priorité et la catégorie',
      '4. Ajoutez des tags pour faciliter la recherche',
      '5. Utilisez les filtres pour organiser votre vue',
      '6. Marquez comme terminé en cochant la case'
    ]
  },
  goals: {
    title: 'Gestionnaire d\'Objectifs',
    icon: Target,
    description: 'Définissez et suivez vos objectifs à court et long terme avec un système de progression avancé.',
    features: [
      'Création d\'objectifs SMART (Spécifique, Mesurable, Atteignable, Réaliste, Temporel)',
      'Suivi de progression avec indicateurs visuels',
      'Objectifs à court, moyen et long terme',
      'Catégorisation par domaines de vie',
      'Jalons et étapes intermédiaires',
      'Notifications de rappel',
      'Analyse de performance',
      'Export et partage de résultats'
    ],
    usage: [
      '1. Définissez votre objectif principal',
      '2. Décomposez en étapes mesurables',
      '3. Fixez une date limite réaliste',
      '4. Choisissez la catégorie appropriée',
      '5. Suivez votre progression régulièrement',
      '6. Ajustez si nécessaire'
    ]
  },
  pomodoro: {
    title: 'Timer Pomodoro Avancé',
    icon: Clock,
    description: 'Technique Pomodoro avec presets personnalisables, sons et suivi de sessions.',
    features: [
      'Presets personnalisables (25/5/15 min par défaut)',
      'Sons de début/fin configurables',
      'Suivi du nombre de sessions',
      'Statistiques de productivité',
      'Commentaires par session',
      'Mode focus sans distractions',
      'Notifications desktop',
      'Historique des sessions'
    ],
    usage: [
      '1. Choisissez un preset ou configurez manuellement',
      '2. Cliquez sur "Démarrer" pour lancer le timer',
      '3. Travaillez sans interruption',
      '4. Prenez la pause quand le timer sonne',
      '5. Répétez le cycle 4 fois puis pause longue',
      '6. Ajoutez des commentaires si souhaité'
    ]
  },
  notes: {
    title: 'Gestionnaire de Notes Avancé',
    icon: FileText,
    description: 'Prise de notes flexible avec organisation visuelle et options de présentation.',
    features: [
      'Création de notes avec formatage riche',
      'Couleurs de fond personnalisables',
      'Mode tableau avec colonnes ajustables',
      'Réorganisation par glisser-déposer',
      'Catégorisation et tags',
      'Recherche full-text',
      'Export en différents formats',
      'Synchronisation cloud'
    ],
    usage: [
      '1. Créez une nouvelle note',
      '2. Choisissez la couleur de fond',
      '3. Rédigez votre contenu',
      '4. Organisez en mode liste ou tableau',
      '5. Déplacez les notes par glisser-déposer',
      '6. Utilisez les filtres pour retrouver vos notes'
    ]
  }
};

export const ToolInfoModal: React.FC<ToolInfoModalProps> = ({ toolType }) => {
  const [open, setOpen] = useState(false);
  const info = toolInfo[toolType];
  const IconComponent = info.icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Info className="w-4 h-4" />
          Aide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <IconComponent className="w-6 h-6 text-blue-600" />
            {info.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-gray-600 dark:text-gray-400">{info.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-3">Fonctionnalités principales</h3>
              <ul className="space-y-2">
                {info.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-3">Guide d'utilisation</h3>
              <ol className="space-y-2">
                {info.usage.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{step}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 <strong>Astuce :</strong> Utilisez les raccourcis clavier et les filtres pour optimiser votre productivité. 
              Consultez régulièrement les statistiques pour analyser vos habitudes.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
