"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { api } from "./api";
import { setSentryUser, clearSentryUser } from "./sentry";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl: string | null;
  workspaceId: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

const DEV_USER: User = {
  id: "dev-local-user",
  email: "dev@localhost",
  name: "Dev User",
  role: "admin",
  avatarUrl: null,
  workspaceId: "dev-workspace",
};

function isDevBypass() {
  return (
    process.env.NODE_ENV === "development" &&
    typeof window !== "undefined" &&
    window.location.hostname === "localhost"
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Always start with null/loading to match server-rendered HTML (avoids hydration mismatch)
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (isDevBypass()) {
      setUser(DEV_USER);
      setLoading(false);
      return;
    }
    // Clear any legacy localStorage tokens from before httpOnly cookie migration
    api.clearLegacyToken();
    try {
      const me = await api.getMe();
      setUser(me);
      setSentryUser({ id: me.id, email: me.email });
    } catch {
      setUser(null);
      clearSentryUser();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async () => {
    // Cookie is already set by the API response; just fetch the user profile
    await fetchUser();
  };

  const logout = async () => {
    try {
      await api.logout(); // server revokes session + clears httpOnly cookie
    } catch {
      // Best-effort: clear local state even if the server call fails
    }
    setUser(null);
    clearSentryUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
