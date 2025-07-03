
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Tag } from 'lucide-react';

interface TaskFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  keywordFilter: string;
  setKeywordFilter: (filter: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  filterPriority: string;
  setFilterPriority: (priority: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  sortByKeywords: boolean;
  setSortByKeywords: (sort: boolean) => void;
  categories: string[];
}

export const TaskFilters = ({
  searchTerm,
  setSearchTerm,
  keywordFilter,
  setKeywordFilter,
  filterCategory,
  setFilterCategory,
  filterPriority,
  setFilterPriority,
  filterStatus,
  setFilterStatus,
  sortByKeywords,
  setSortByKeywords,
  categories
}: TaskFiltersProps) => {
  return (
    <div className="space-y-4">
      {/* Recherche et filtres avancés */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Input
          placeholder="Filtrer par mot-clé..."
          value={keywordFilter}
          onChange={(e) => setKeywordFilter(e.target.value)}
        />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes catégories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger>
            <SelectValue placeholder="Priorité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes priorités</SelectItem>
            <SelectItem value="high">🔴 Haute</SelectItem>
            <SelectItem value="medium">🟡 Moyenne</SelectItem>
            <SelectItem value="low">🟢 Basse</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            <SelectItem value="pending">En cours</SelectItem>
            <SelectItem value="completed">Terminées</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Options avancées */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={sortByKeywords ? "default" : "outline"}
          size="sm"
          onClick={() => setSortByKeywords(!sortByKeywords)}
        >
          <Tag className="w-4 h-4 mr-2" />
          Trier par mots-clés
        </Button>
      </div>
    </div>
  );
};
