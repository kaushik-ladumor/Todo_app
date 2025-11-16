import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { todoListSchema } from "../lib/schemas";
import TodoForm from "../components/TodoForm";
import TodoItem from "../components/TodoItem";
import type { ITodo } from "../types/index";
import { useState } from "react";
import { Plus, X, ListChecks, Loader2 } from "lucide-react";

const TodosPage = () => {
  const queryClient = useQueryClient();
  const [editingTodo, setEditingTodo] = useState<ITodo | null>(null);

  const { data: todos, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await api.get("/todos");
      return todoListSchema.parse(res.data);
    }
  });

  const createMutation = useMutation({
    mutationFn: (values: { title: string; description?: string }) =>
      api.post("/todos", values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] })
  });

  const updateMutation = useMutation({
    mutationFn: (values: { title?: string; description?: string }) =>
      api.put(`/todos/${editingTodo?._id}`, values),
    onSuccess: () => {
      setEditingTodo(null);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/todos/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] })
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/todos/${id}/toggle`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] })
  });

  const handleCreateOrUpdate = async (data: {
    title: string;
    description?: string;
  }) => {
    if (editingTodo) {
      await updateMutation.mutateAsync(data);
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const completedCount = todos?.filter((t) => t.completed).length || 0;
  const totalCount = todos?.length || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            {editingTodo ? (
              <>
                <Plus className="w-5 h-5 text-amber-500 rotate-45" />
                Edit Todo
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 text-sky-500" />
                New Todo
              </>
            )}
          </h1>
          {editingTodo && (
            <button
              onClick={() => setEditingTodo(null)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all duration-200"
              aria-label="Cancel editing"
            >
              <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>
          )}
        </div>
        <TodoForm
          onSubmit={handleCreateOrUpdate}
          initial={
            editingTodo
              ? { title: editingTodo.title, description: editingTodo.description }
              : null
          }
          loading={createMutation.isPending || updateMutation.isPending}
        />
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-sky-500" />
            Your Todos
          </h2>
          {totalCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-full bg-sky-100 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50">
                <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">
                  {completedCount}/{totalCount}
                </span>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading your todos...</p>
          </div>
        ) : todos && todos.length > 0 ? (
          <div className="space-y-3">
            {todos.map((todo, index) => (
              <div
                key={todo._id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TodoItem
                  todo={todo}
                  onToggle={() => toggleMutation.mutate(todo._id)}
                  onDelete={() => deleteMutation.mutate(todo._id)}
                  onEdit={() => setEditingTodo(todo)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <ListChecks className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No todos yet</p>
            <p className="text-xs text-slate-500 dark:text-slate-500">Create your first todo above!</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default TodosPage;