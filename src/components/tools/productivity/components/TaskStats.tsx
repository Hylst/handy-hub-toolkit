
import { Card, CardContent } from '@/components/ui/card';

interface TaskStatsProps {
  stats: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    highPriorityTasks: number;
  };
}

export const TaskStats = ({ stats }: TaskStatsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      <div className="p-3 lg:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
        <h3 className="font-semibold text-blue-700 dark:text-blue-300 text-sm lg:text-base">Total</h3>
        <p className="text-xl lg:text-2xl font-bold text-blue-600">{stats.totalTasks}</p>
      </div>
      <div className="p-3 lg:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
        <h3 className="font-semibold text-green-700 dark:text-green-300 text-sm lg:text-base">Terminées</h3>
        <p className="text-xl lg:text-2xl font-bold text-green-600">{stats.completedTasks}</p>
      </div>
      <div className="p-3 lg:p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
        <h3 className="font-semibold text-orange-700 dark:text-orange-300 text-sm lg:text-base">En cours</h3>
        <p className="text-xl lg:text-2xl font-bold text-orange-600">{stats.pendingTasks}</p>
      </div>
      <div className="p-3 lg:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
        <h3 className="font-semibold text-red-700 dark:text-red-300 text-sm lg:text-base">Urgentes</h3>
        <p className="text-xl lg:text-2xl font-bold text-red-600">{stats.highPriorityTasks}</p>
      </div>
    </div>
  );
};
