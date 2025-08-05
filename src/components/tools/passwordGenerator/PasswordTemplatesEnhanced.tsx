import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Star, Heart, Info, Filter, SortAsc, Eye, Copy, Sparkles } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { 
  PasswordTemplate, 
  templateCategories, 
  passwordTemplates, 
  getTemplatesByCategory, 
  getQuickTemplates, 
  getPopularTemplates,
  getTemplateIcon 
} from "./data/templateCategories";

interface PasswordTemplatesEnhancedProps {
  templates: PasswordTemplate[];
  selectedTemplateId?: string;
  onApplyTemplate: (templateId: string) => void;
  onToggleFavorite?: (templateId: string) => void;
  favorites?: string[];
  className?: string;
}

export const PasswordTemplatesEnhanced = ({
  templates,
  selectedTemplateId,
  onApplyTemplate,
  onToggleFavorite,
  favorites = [],
  className = ""
}: PasswordTemplatesEnhancedProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "security" | "popularity">("popularity");
  const [previewTemplate, setPreviewTemplate] = useState<PasswordTemplate | null>(null);

  // Utiliser les templates fournis ou ceux par défaut
  const allTemplates = templates.length > 0 ? templates : passwordTemplates;

  const filteredAndSortedTemplates = useMemo(() => {
    let filtered = allTemplates;

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.useCase.some(use => use.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrage par catégorie
    if (selectedCategory !== "all") {
      if (selectedCategory === "favorites") {
        filtered = filtered.filter(template => favorites.includes(template.id));
      } else {
        filtered = filtered.filter(template => template.category === selectedCategory);
      }
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "security":
          const securityOrder = { low: 1, medium: 2, high: 3, maximum: 4 };
          return securityOrder[b.security] - securityOrder[a.security];
        case "popularity":
          return (b.popularity || 0) - (a.popularity || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allTemplates, searchTerm, selectedCategory, sortBy, favorites]);

  const getSecurityColor = (level: string) => {
    switch (level) {
      case "low": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      case "medium": return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
      case "high": return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "maximum": return "text-purple-600 bg-purple-100 dark:bg-purple-900/20";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getSecurityLabel = (level: string) => {
    switch (level) {
      case "low": return "Faible";
      case "medium": return "Moyenne";
      case "high": return "Élevée";
      case "maximum": return "Maximum";
      default: return "Inconnue";
    }
  };

  const handlePreview = (template: PasswordTemplate) => {
    setPreviewTemplate(template);
  };

  const handleCopySettings = (template: PasswordTemplate) => {
    const settingsText = `Template: ${template.name}\nLongueur: ${template.settings.length}\nMajuscules: ${template.settings.upper ? 'Oui' : 'Non'}\nMinuscules: ${template.settings.lower ? 'Oui' : 'Non'}\nChiffres: ${template.settings.numbers ? 'Oui' : 'Non'}\nSymboles: ${template.settings.symbols ? 'Oui' : 'Non'}`;
    navigator.clipboard.writeText(settingsText);
    toast.success("Configuration copiée !");
  };

  const categories = Object.entries(templateCategories);
  const quickTemplates = getQuickTemplates();
  const popularTemplates = getPopularTemplates();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête avec recherche et filtres */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Templates de Mots de Passe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un template..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="favorites">Mes favoris</SelectItem>
                  {categories.map(([key, category]) => (
                    <SelectItem key={key} value={key}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger>
                  <SortAsc className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularité</SelectItem>
                  <SelectItem value="security">Sécurité</SelectItem>
                  <SelectItem value="name">Nom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates par onglets */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="quick">Rapide</TabsTrigger>
          <TabsTrigger value="popular">Populaires</TabsTrigger>
          <TabsTrigger value="favorites">Favoris</TabsTrigger>
          <TabsTrigger value="categories" className="hidden lg:flex">Catégories</TabsTrigger>
          <TabsTrigger value="custom" className="hidden lg:flex">Personnalisé</TabsTrigger>
        </TabsList>

        {/* Tous les templates */}
        <TabsContent value="all" className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            {filteredAndSortedTemplates.length} template(s) trouvé(s)
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplateId === template.id}
                isFavorite={favorites.includes(template.id)}
                onApply={() => onApplyTemplate(template.id)}
                onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(template.id) : undefined}
                onPreview={() => handlePreview(template)}
                onCopySettings={() => handleCopySettings(template)}
                getSecurityColor={getSecurityColor}
                getSecurityLabel={getSecurityLabel}
              />
            ))}
          </div>
        </TabsContent>

        {/* Templates rapides */}
        <TabsContent value="quick" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quickTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplateId === template.id}
                isFavorite={favorites.includes(template.id)}
                onApply={() => onApplyTemplate(template.id)}
                onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(template.id) : undefined}
                onPreview={() => handlePreview(template)}
                onCopySettings={() => handleCopySettings(template)}
                getSecurityColor={getSecurityColor}
                getSecurityLabel={getSecurityLabel}
              />
            ))}
          </div>
        </TabsContent>

        {/* Templates populaires */}
        <TabsContent value="popular" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {popularTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplateId === template.id}
                isFavorite={favorites.includes(template.id)}
                onApply={() => onApplyTemplate(template.id)}
                onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(template.id) : undefined}
                onPreview={() => handlePreview(template)}
                onCopySettings={() => handleCopySettings(template)}
                getSecurityColor={getSecurityColor}
                getSecurityLabel={getSecurityLabel}
              />
            ))}
          </div>
        </TabsContent>

        {/* Templates favoris */}
        <TabsContent value="favorites" className="space-y-4">
          {favorites.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Heart className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Aucun favori
                </h3>
                <p className="text-muted-foreground text-center">
                  Ajoutez des templates à vos favoris en cliquant sur l'icône cœur
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {allTemplates
                .filter(template => favorites.includes(template.id))
                .map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={selectedTemplateId === template.id}
                    isFavorite={true}
                    onApply={() => onApplyTemplate(template.id)}
                    onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(template.id) : undefined}
                    onPreview={() => handlePreview(template)}
                    onCopySettings={() => handleCopySettings(template)}
                    getSecurityColor={getSecurityColor}
                    getSecurityLabel={getSecurityLabel}
                  />
                ))}
            </div>
          )}
        </TabsContent>

        {/* Templates par catégories */}
        <TabsContent value="categories" className="space-y-6">
          {categories.map(([key, category]) => {
            const categoryTemplates = getTemplatesByCategory(key);
            if (categoryTemplates.length === 0) return null;

            return (
              <div key={key}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    {/* Icon placeholder */}
                  </div>
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categoryTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      isSelected={selectedTemplateId === template.id}
                      isFavorite={favorites.includes(template.id)}
                      onApply={() => onApplyTemplate(template.id)}
                      onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(template.id) : undefined}
                      onPreview={() => handlePreview(template)}
                      onCopySettings={() => handleCopySettings(template)}
                      getSecurityColor={getSecurityColor}
                      getSecurityLabel={getSecurityLabel}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </TabsContent>

        {/* Templates personnalisés */}
        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Star className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Templates Personnalisés
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Créez vos propres templates pour des besoins spécifiques
              </p>
              <Button variant="outline">
                Créer un Template
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Prévisualisation */}
      {previewTemplate && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Aperçu: {previewTemplate.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Configuration</h4>
                <div className="space-y-2 text-sm">
                  <div>Longueur: {previewTemplate.settings.length} caractères</div>
                  <div>Majuscules: {previewTemplate.settings.upper ? "✓" : "✗"}</div>
                  <div>Minuscules: {previewTemplate.settings.lower ? "✓" : "✗"}</div>
                  <div>Chiffres: {previewTemplate.settings.numbers ? "✓" : "✗"}</div>
                  <div>Symboles: {previewTemplate.settings.symbols ? "✓" : "✗"}</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Cas d'usage</h4>
                <div className="flex flex-wrap gap-1">
                  {previewTemplate.useCase.map((use, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {use}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => onApplyTemplate(previewTemplate.id)}>
                Utiliser ce Template
              </Button>
              <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                Fermer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Composant de carte de template
interface TemplateCardProps {
  template: PasswordTemplate;
  isSelected: boolean;
  isFavorite: boolean;
  onApply: () => void;
  onToggleFavorite?: () => void;
  onPreview: () => void;
  onCopySettings: () => void;
  getSecurityColor: (level: string) => string;
  getSecurityLabel: (level: string) => string;
}

const TemplateCard = ({
  template,
  isSelected,
  isFavorite,
  onApply,
  onToggleFavorite,
  onPreview,
  onCopySettings,
  getSecurityColor,
  getSecurityLabel
}: TemplateCardProps) => {
  const IconComponent = getTemplateIcon(template.icon);

  return (
    <Card className={`transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <IconComponent className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{template.name}</h3>
              <p className="text-xs text-muted-foreground">{template.description}</p>
            </div>
          </div>
          {onToggleFavorite && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggleFavorite}
              className="h-8 w-8 p-0"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge className={getSecurityColor(template.security)}>
            {getSecurityLabel(template.security)}
          </Badge>
          {template.popularity && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="w-3 h-3" />
              {template.popularity}/10
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          {template.settings.length} chars • {[
            template.settings.upper && "A-Z",
            template.settings.lower && "a-z",
            template.settings.numbers && "0-9",
            template.settings.symbols && "!@#"
          ].filter(Boolean).join(" • ")}
        </div>

        <div className="flex flex-wrap gap-1">
          {template.useCase.slice(0, 2).map((use, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {use}
            </Badge>
          ))}
          {template.useCase.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{template.useCase.length - 2}
            </Badge>
          )}
        </div>

        <div className="flex gap-1">
          <Button
            size="sm"
            onClick={onApply}
            className="flex-1"
            variant={isSelected ? "default" : "outline"}
          >
            {isSelected ? "Sélectionné" : "Utiliser"}
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" onClick={onPreview} className="px-2">
                  <Eye className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Aperçu</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" onClick={onCopySettings} className="px-2">
                  <Copy className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copier les paramètres</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};