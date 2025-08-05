
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Filter } from "lucide-react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  category: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'personal', name: 'Personnel', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: '👤' },
  { id: 'work', name: 'Travail', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: '💼' },
  { id: 'shopping', name: 'Courses', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: '🛒' },
  { id: 'health', name: 'Santé', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: '❤️' },
  { id: 'learning', name: 'Apprentissage', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: '📚' },
  { id: 'finance', name: 'Finance', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200', icon: '💰' },
  { id: 'family', name: 'Famille', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200', icon: '👨‍👩‍👧‍👦' },
  { id: 'travel', name: 'Voyage', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200', icon: '✈️' },
];

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("personal");
  const [filterCategory, setFilterCategory] = useState("all");

  const addTodo = () => {
    if (inputValue.trim() !== "") {
      setTodos([...todos, {
        id: Date.now(),
        text: inputValue,
        completed: false,
        category: selectedCategory
      }]);
      setInputValue("");
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return DEFAULT_CATEGORIES.find(cat => cat.id === categoryId) || DEFAULT_CATEGORIES[0];
  };

  const filteredTodos = filterCategory === "all" 
    ? todos 
    : todos.filter(todo => todo.category === filterCategory);

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Liste de Tâches</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Ajouter une nouvelle tâche..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
              className="flex-1"
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addTodo}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {todos.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  {DEFAULT_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <span className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        {category.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            {filteredTodos.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {filterCategory === "all" 
                  ? "Aucune tâche pour le moment. Ajoutez-en une !"
                  : "Aucune tâche dans cette catégorie."
                }
              </p>
            ) : (
              filteredTodos.map((todo) => {
                const categoryInfo = getCategoryInfo(todo.category);
                return (
                  <div
                    key={todo.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border ${
                      todo.completed ? "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700" : "bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-600"
                    }`}
                  >
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                    />
                    <div className="flex-1 flex items-center gap-2">
                      <span
                        className={`${
                          todo.completed ? "line-through text-gray-500" : "text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {todo.text}
                      </span>
                      <Badge className={categoryInfo.color}>
                        <span className="flex items-center gap-1">
                          <span>{categoryInfo.icon}</span>
                          {categoryInfo.name}
                        </span>
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })
            )}
          </div>
          
          {todos.length > 0 && (
            <div className="flex justify-between text-sm text-gray-600 pt-4 border-t">
              <span>Total: {todos.length} tâches</span>
              <span>Terminées: {todos.filter(t => t.completed).length}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
