import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CategoryPresetsProps {
  onCategorySelect: (category: string) => void;
  selectedCategory?: string;
}

const categoryPresets = [
  { name: 'Travail', color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200', icon: '💼' },
  { name: 'Personnel', color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200', icon: '🏠' },
  { name: 'Projets', color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200', icon: '🚀' },
  { name: 'Urgent', color: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200', icon: '🚨' },
  { name: 'Formation', color: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200', icon: '📚' },
  { name: 'Santé & Bien-être', color: 'bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200', icon: '🌸' },
  { name: 'Finance', color: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200', icon: '💰' },
  { name: 'Maison & Famille', color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200', icon: '🏡' },
  { name: 'Créatif', color: 'bg-violet-100 text-violet-800 border-violet-200 hover:bg-violet-200', icon: '🎨' },
  { name: 'Voyage', color: 'bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-200', icon: '✈️' },
  { name: 'Technologie', color: 'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200', icon: '💻' },
  { name: 'Sport & Fitness', color: 'bg-lime-100 text-lime-800 border-lime-200 hover:bg-lime-200', icon: '💪' },
  { name: 'Administration', color: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200', icon: '📋' },
  { name: 'Achats', color: 'bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200', icon: '🛍️' },
  { name: 'Événements', color: 'bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200', icon: '🎉' },
  { name: 'Maintenance', color: 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200', icon: '🔧' },
  { name: 'Recherche', color: 'bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200', icon: '🔍' },
  { name: 'Communication', color: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 hover:bg-fuchsia-200', icon: '💬' },
];

export const CategoryPresets = ({ onCategorySelect, selectedCategory }: CategoryPresetsProps) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Catégories populaires
      </label>
      <div className="flex flex-wrap gap-2">
        {categoryPresets.map((preset) => (
          <Button
            key={preset.name}
            variant="ghost"
            size="sm"
            className="h-auto p-1"
            onClick={() => onCategorySelect(preset.name)}
          >
            <Badge 
              className={`${preset.color} cursor-pointer transition-colors ${
                selectedCategory === preset.name ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <span className="mr-1">{preset.icon}</span>
              {preset.name}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  );
};