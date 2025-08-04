import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CategoryPresetsProps {
  onCategorySelect: (category: string) => void;
  selectedCategory?: string;
}

const categoryPresets = [
  { name: 'Travail', color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800', icon: '💼' },
  { name: 'Personnel', color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800', icon: '🏠' },
  { name: 'Projets', color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800', icon: '🚀' },
  { name: 'Urgent', color: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800', icon: '🚨' },
  { name: 'Formation', color: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800', icon: '📚' },
  { name: 'Santé', color: 'bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800', icon: '🏥' },
  { name: 'Finance', color: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800', icon: '💰' },
  { name: 'Famille', color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800', icon: '👨‍👩‍👧‍👦' },
  { name: 'Créatif', color: 'bg-violet-100 text-violet-800 border-violet-200 hover:bg-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800', icon: '🎨' },
  { name: 'Sport', color: 'bg-lime-100 text-lime-800 border-lime-200 hover:bg-lime-200 dark:bg-lime-900/20 dark:text-lime-300 dark:border-lime-800', icon: '💪' },
  { name: 'Achats', color: 'bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800', icon: '🛍️' },
  { name: 'Événements', color: 'bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800', icon: '🎉' },
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