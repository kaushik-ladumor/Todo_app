import type { ITodo } from "../types/index";
import { CheckCircle2, Circle, Trash2, Pencil } from "lucide-react";

interface Props {
  todo: ITodo;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const TodoItem = ({ todo, onToggle, onDelete, onEdit }: Props) => {
  return (
    <div
      className="group flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 hover:border-sky-200 dark:hover:border-sky-900/50 hover:shadow-md transition-all duration-300"
    >

      <button
        onClick={onToggle}
        className="mt-0.5 hover:scale-110 active:scale-95 transition-transform duration-200"
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {todo.completed ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-500 drop-shadow-sm animate-scale-in" />
        ) : (
          <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600 hover:text-sky-400 dark:hover:text-sky-500 transition-colors duration-200" />
        )}
      </button>


      <div className="flex-1 min-w-0">
        <p
          className={`font-medium break-words transition-all duration-300 ${
            todo.completed
              ? "line-through text-slate-400 dark:text-slate-500"
              : "text-slate-900 dark:text-slate-100"
          }`}
        >
          {todo.title}
        </p>

        {todo.description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed break-words">
            {todo.description}
          </p>
        )}
      </div>


      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">

        <button
          onClick={onEdit}
          className="p-2 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-950/50 active:scale-95 transition-all duration-200"
          aria-label="Edit todo"
        >
          <Pencil className="w-4 h-4 text-sky-500 hover:text-sky-600 dark:hover:text-sky-400" />
        </button>

        {/* Delete */}
        <button
          onClick={onDelete}
          className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/50 active:scale-95 transition-all duration-200"
          aria-label="Delete todo"
        >
          <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600 dark:hover:text-red-400" />
        </button>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TodoItem;