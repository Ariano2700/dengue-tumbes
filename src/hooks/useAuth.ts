import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  logout,
  setLoading,
  selectUser,
  selectAuthLoading,
  selectProfileFetched,
  fetchUserProfile,
  completeUserProfile,
} from "@/store/slices/authSlice";

export function useAuth() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectAuthLoading);
  const profileFetched = useAppSelector(selectProfileFetched);

  // Manejar autenticación básica
  useEffect(() => {
    dispatch(setLoading(status === "loading"));

    if (
      status === "authenticated" &&
      session?.user &&
      !user &&
      !profileFetched
    ) {
      dispatch(fetchUserProfile());
    } else if (status === "unauthenticated") {
      dispatch(logout());
    }

    if (status !== "loading") {
      setIsInitialized(true);
    }
  }, [session?.user?.id, status, dispatch, user, profileFetched]);

  const completeProfile = async (profileData: {
    firstName: string;
    lastName: string;
    dni: string;
    phone: string;
  }) => {
    try {
      const result = await dispatch(completeUserProfile(profileData)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error as string };
    }
  };

  const refreshProfile = async () => {
    if (status === "authenticated" && session?.user) {
      try {
        await dispatch(fetchUserProfile()).unwrap();
      } catch (error) {
        console.error("Error refreshing profile:", error);
      }
    }
  };

  return {
    user,
    isAuthenticated: status === "authenticated" && !!session,
    isLoading: status === "loading" || isLoading || !isInitialized,
    session,
    completeProfile,
    refreshProfile,
    isInitialized,
  };
}
