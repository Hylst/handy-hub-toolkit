
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Split } from 'lucide-react';
import { Task } from '../hooks/useTaskManagerEnhanced';

interface TaskFormProps {
  isEditing: boolean;
  editingTask: Task | null;
  newTask: {
    title: string;
    description: string;
    priority: Task['priority'];
    category: string;
    tags: string;
    dueDate: string;
  };
  setNewTask: (task: any) => void;
  categories: string[];
  onSubmit: () => void;
  onSplit?: () => void;
}

export const TaskForm = ({
  isEditing,
  editingTask,
  newTask,
  setNewTask,
  categories,
  onSubmit,
  onSplit
}: TaskFormProps) => {
  return (
    <Card className="border-2 border-emerald-200 dark:border-emerald-800">
      <CardContent className="p-4 space-y-4">
        <Input
          placeholder="Titre de la tâche *"
          value={newTask.title}
          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
        />
        <Textarea
          placeholder="Description (optionnel) - Une ligne par sous-tâche pour découper"
          value={newTask.description}
          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({...newTask, priority: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">🟢 Basse</SelectItem>
              <SelectItem value="medium">🟡 Moyenne</SelectItem>
              <SelectItem value="high">🔴 Haute</SelectItem>
            </SelectContent>
          </Select>
          <Select value={newTask.category} onValueChange={(value) => setNewTask({...newTask, category: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
          />
        </div>
        <Input
          placeholder="Tags (séparés par des virgules)"
          value={newTask.tags}
          onChange={(e) => setNewTask({...newTask, tags: e.target.value})}
        />
        <div className="flex gap-2">
          <Button 
            onClick={onSubmit}
            disabled={!newTask.title.trim()}
            className="flex-1"
          >
            {isEditing ? 'Mettre à jour' : 'Ajouter'} la tâche
          </Button>
          {isEditing && editingTask && newTask.description && onSplit && (
            <Button
              variant="outline"
              onClick={onSplit}
            >
              <Split className="w-4 h-4 mr-2" />
              Découper
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
