import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../lib/api";
import { useState } from "react";
import { Lock, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";

const resetSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters")
});

type ResetForm = z.infer<typeof resetSchema>;

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ResetForm>({ resolver: zodResolver(resetSchema) });

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
      if (type === 'success') {
        setTimeout(() => navigate("/login"), 500);
      }
    }, 3000);
  };

  const onSubmit = async (data: ResetForm) => {
    try {
      await api.post(`/auth/reset-password/${token}`, data);
      showToast('success', "Password reset successful! Redirecting to login...");
    } catch (err: any) {
      showToast('error', err?.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 animate-fade-in">

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg ${
            toast.type === 'success' 
              ? 'bg-emerald-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950/30">
              <ShieldCheck className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Reset Password
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Create a new secure password
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-sky-400 dark:focus:border-sky-500 outline-none transition-all duration-300"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-400 flex items-center gap-1 animate-shake">
                  ⚠️ {errors.password.message}
                </p>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-2">
                <span>💡</span>
                Use at least 6 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-600 active:scale-[0.98] text-white font-semibold shadow-sm disabled:opacity-50 transition-all duration-300"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Updating...
                </span>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
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

export default ResetPasswordPage;