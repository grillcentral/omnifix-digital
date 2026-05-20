import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "@/lib/authContext.js";
import { supabase } from "@/lib/supabase.js";

const VALID_PROFILE_ROLES = new Set(["admin", "tecnico", "atendente"]);

function isValidProfile(profile) {
  return Boolean(profile?.id && profile?.ativo !== false && VALID_PROFILE_ROLES.has(profile?.role));
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const loadProfile = useCallback(async (currentUser) => {
    if (!currentUser || !supabase) {
      setProfile(null);
      return null;
    }

    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (error) throw error;

      if (!isValidProfile(data)) {
        setProfile(null);
        return null;
      }

      setProfile(data);
      return data;
    } catch (error) {
      console.error("Erro ao carregar profile", error);
      setProfile(null);
      return null;
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function recoverSession() {
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (error) {
        console.error("Erro ao recuperar sessao", error);
      }

      const currentSession = data?.session ?? null;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      await loadProfile(currentSession?.user ?? null);
      setIsLoading(false);
    }

    recoverSession();

    if (!supabase) {
      return () => {
        isMounted = false;
      };
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      loadProfile(nextSession?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async ({ email, password }) => {
    if (!supabase) {
      throw new Error("Supabase nao configurado.");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
    setUser(null);
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      isAuthenticated: Boolean(user),
      isLoading: isLoading || profileLoading,
      signIn,
      signOut,
      refreshProfile: () => loadProfile(user),
    }),
    [isLoading, loadProfile, profile, profileLoading, session, signIn, signOut, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
