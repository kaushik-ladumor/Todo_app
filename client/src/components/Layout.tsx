import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { CheckSquare2, LogOut, Sparkles } from "lucide-react";

const Layout = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(
    location.pathname
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link 
            to="/todos" 
            className="flex items-center gap-2 group transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              <CheckSquare2 className="w-7 h-7 text-sky-500 transition-transform duration-300 group-hover:rotate-12" />
              <Sparkles className="w-3 h-3 text-sky-400 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300">
              Todo<span className="text-sky-500">TS</span>
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            {user && (
              <>
                <span className="hidden sm:inline text-sm font-medium text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 animate-fade-in">
                  👋 {user.name}
                </span>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">

            <Outlet />
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-slate-200/50 dark:border-slate-800/50 py-4 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          TodoTS &copy; {new Date().getFullYear()} · Made with ❤️
        </p>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Layout;