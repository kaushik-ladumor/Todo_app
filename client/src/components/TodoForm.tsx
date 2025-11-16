import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

const todoFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional()
});

type TodoFormValues = z.infer<typeof todoFormSchema>;

interface Props {
  onSubmit: (data: TodoFormValues) => Promise<void> | void;
  initial?: TodoFormValues | null;
  loading?: boolean;
}

const TodoForm = ({ onSubmit, initial, loading }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TodoFormValues>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: initial || { title: "", description: "" }
  });

  const [popup, setPopup] = useState("");

  const handleFormSubmit = async (data: TodoFormValues) => {
    await onSubmit(data);

    setPopup(initial ? "Todo updated successfully!" : "Todo added!");
    setTimeout(() => setPopup(""), 2500);

    if (!initial) reset();
  };

  return (
    <div className="relative">

      {popup && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 text-white shadow-lg">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">{popup}</span>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-5"
      >

        <div className="space-y-2 group">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            Title
            <span className="text-red-400">*</span>
          </label>

          <input
            placeholder="What needs to be done?"
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-sky-400 dark:focus:border-sky-500 focus:outline-none transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700"
            {...register("title")}
          />

          {errors.title && (
            <p className="text-xs text-red-500 flex items-center gap-1 animate-shake">
              ⚠️ {errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-2 group">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            Description
            <span className="text-xs text-slate-400 font-normal">(optional)</span>
          </label>

          <textarea
            placeholder="Add more details..."
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 min-h-[100px] focus:border-sky-400 dark:focus:border-sky-500 focus:outline-none transition-all duration-300 resize-none hover:border-slate-300 dark:hover:border-slate-700"
            {...register("description")}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-[0.98] text-white font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              {initial ? "Update Todo" : "Add Todo"}
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </>
          )}
        </button>
      </form>

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default TodoForm;