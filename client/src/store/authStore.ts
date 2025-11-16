import { create } from "zustand";
import { setAuthToken } from "../lib/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    set({ user, token });
    setAuthToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },
  logout: () => {
    set({ user: null, token: null });
    setAuthToken(undefined);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}));


const token = localStorage.getItem("token");
const userStr = localStorage.getItem("user");
if (token && userStr) {
  setAuthToken(token);
  const user = JSON.parse(userStr);
  useAuthStore.setState({ user, token });
}
