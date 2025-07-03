
import { CheckSquare } from 'lucide-react';
import { Task } from '../hooks/useTaskManagerEnhanced';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  searchTerm: string;
  keywordFilter: string;
  filterCategory: string;
  filterPriority: string;
  filterStatus: string;
  onToggle: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskList = ({
  tasks,
  searchTerm,
  keywordFilter,
  filterCategory,
  filterPriority,
  filterStatus,
  onToggle,
  onEdit,
  onDelete
}: TaskListProps) => {
  const hasActiveFilters = searchTerm || keywordFilter || filterCategory !== 'all' || filterPriority !== 'all' || filterStatus !== 'all';

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 lg:py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <CheckSquare className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 text-gray-400" />
        <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-2">
          {hasActiveFilters
            ? 'Aucune tâche ne correspond aux filtres'
            : 'Aucune tâche créée'
          }
        </p>
        <p className="text-sm text-gray-500">
          {hasActiveFilters
            ? 'Modifiez vos critères de recherche'
            : 'Commencez par ajouter votre première tâche'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
