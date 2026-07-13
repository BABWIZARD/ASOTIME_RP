import { trpc } from "@/providers/trpc";
import { useCallback, useMemo } from "react";

export type AuthUser = {
  id: number;
  name: string;
  email?: string | null;
  avatar?: string | null;
  role: string;
  authType: "oauth" | "local";
};

export function useAuth() {
  const utils = trpc.useUtils();

  // Query OAuth user
  const {
    data: oauthUser,
    isLoading: oauthLoading,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  // Query local auth user
  const {
    data: localUser,
    isLoading: localLoading,
  } = trpc.localAuth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  // Determine which user is active
  const user: AuthUser | null = useMemo(() => {
    if (oauthUser) {
      return {
        id: oauthUser.id,
        name: oauthUser.name || "User",
        email: oauthUser.email,
        avatar: oauthUser.avatar,
        role: oauthUser.role,
        authType: "oauth" as const,
      };
    }
    if (localUser) {
      return {
        id: localUser.id,
        name: localUser.name || localUser.displayName || localUser.username,
        email: localUser.email,
        avatar: localUser.avatar,
        role: localUser.role,
        authType: "local" as const,
      };
    }
    return null;
  }, [oauthUser, localUser]);

  const isAdmin = user?.role === "admin";

  const logout = useCallback(() => {
    // Always clear local auth token
    localStorage.removeItem("local_auth_token");
    // Always call OAuth logout
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        window.location.reload();
      },
    });
  }, [logoutMutation]);

  const isLoading = oauthLoading || localLoading;

  return useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin,
      isLoading: isLoading || logoutMutation.isPending,
      logout,
      refresh: () => utils.invalidate(),
    }),
    [user, isAdmin, isLoading, logoutMutation.isPending, logout, utils],
  );
}
