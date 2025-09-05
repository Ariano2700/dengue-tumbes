import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser, logout, setLoading, selectUser } from "@/store/slices/authSlice";

export function useAuth() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  // Sincronizar NextAuth session con Redux
  useEffect(() => {
    dispatch(setLoading(status === "loading"));

    if (status === "authenticated" && session?.user) {
      // Obtener datos completos del perfil del usuario
      fetchUserProfile();
    } else if (status === "unauthenticated") {
      dispatch(logout());
    }
  }, [session, status, dispatch]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data.user));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const completeProfile = async (profileData: {
    firstName: string;
    lastName: string;
    dni: string;
    phone: string;
  }) => {
    try {
      dispatch(setLoading(true));
      
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data.user));
        return { success: true, data: data.user };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      return { success: false, error: "Error de conexión" };
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    user,
    isAuthenticated: !!session && !!user,
    isLoading: status === "loading",
    session,
    completeProfile,
    fetchUserProfile,
  };
}
