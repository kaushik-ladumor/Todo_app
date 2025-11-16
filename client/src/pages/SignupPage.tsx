import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { authResponseSchema } from "../lib/schemas";
import { useAuthStore } from "../store/authStore";
import { UserPlus, User, Mail, Lock } from "lucide-react";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type SignupForm = z.infer<typeof signupSchema>;

export const SignupPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      const res = await api.post("/auth/signup", data);
      const parsed = authResponseSchema.parse(res.data);
      setAuth(parsed.user, parsed.token);
      navigate("/todos");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/30">
              <UserPlus className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Create Account
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Get started for free
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <User className="w-3 h-3" />
                Name
              </label>
              <input
                placeholder="Username"
                className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-sky-400 dark:focus:border-sky-500 outline-none transition-all duration-300"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  ⚠️ {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Mail className="w-3 h-3" />
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-sky-400 dark:focus:border-sky-500 outline-none transition-all duration-300"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  ⚠️ {errors.email.message}
                </p>
              )}
            </div>


            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Lock className="w-3 h-3" />
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-sky-400 dark:focus:border-sky-500 outline-none transition-all duration-300"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  ⚠️ {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-semibold shadow-sm disabled:opacity-50 transition-all duration-300"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-sky-500 hover:text-sky-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
