
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Code, Heart, Zap, Shield, Palette, Calculator } from "lucide-react";

export const About = () => {
  const features = [
    {
      icon: Calculator,
      title: "Convertisseurs d'Unités",
      description: "8 types de conversions : longueurs, poids, températures, volumes, surfaces, énergie, vitesse et pression",
      count: "50+ unités"
    },
    {
      icon: Code,
      title: "Calculatrices Avancées",
      description: "Calculatrice scientifique avec fonctions trigonométriques, logarithmes, statistiques et saisie clavier",
      count: "30+ fonctions"
    },
    {
      icon: Shield,
      title: "Sécurité & Outils",
      description: "Générateurs de mots de passe, QR codes, utilitaires texte et outils de productivité",
      count: "10+ outils"
    },
    {
      icon: Palette,
      title: "Interface Moderne",
      description: "Design responsive avec thème sombre/clair et interface utilisateur intuitive",
      count: "100% responsive"
    }
  ];

  const technologies = [
    "React", "TypeScript", "Tailwind CSS", "Shadcn/ui", "Vite", "Lucide Icons"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* En-tête principal */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950 dark:to-teal-950">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center text-2xl">
              🛠️
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Boîte à Outils Pratiques
          </CardTitle>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Une collection complète d'outils utiles pour votre quotidien
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="secondary">Version 1.0.0</Badge>
            <Badge className="bg-gradient-to-r from-blue-600 to-teal-600">2024</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Fonctionnalités principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <Badge variant="outline" className="text-xs">{feature.count}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Technologies utilisées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Technologies Utilisées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Caractéristiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Caractéristiques
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">✓ Interface moderne et responsive</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Design adaptatif fonctionnant sur tous les appareils
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">✓ Saisie clavier intégrée</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Raccourcis clavier pour une utilisation rapide
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">✓ Calculs haute précision</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Algorithmes optimisés pour des résultats exacts
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">✓ Historique des calculs</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Sauvegarde automatique de vos opérations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* À propos de l'auteur */}
      <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            À propos de l'auteur
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Geoffroy Streit
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Développeur passionné par la création d'outils pratiques et intuitifs
            </p>
          </div>
          
          <Separator />
          
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cette application a été développée avec soin pour offrir une expérience utilisateur optimale.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Chaque outil a été pensé pour être à la fois puissant et simple d'utilisation.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Copyright */}
      <div className="text-center py-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © 2024 Geoffroy Streit - Tous droits réservés
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Développé avec React, TypeScript et Tailwind CSS
        </p>
      </div>
    </div>
  );
};
