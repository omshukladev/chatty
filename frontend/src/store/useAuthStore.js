import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create(
  persist(
    (set) => ({
      authUser: null,
      isCheckingAuth: true,
      isSigningUp: false,
      isLoggingIn: false,

      checkAuth: async () => {
        try {
          const res = await axiosInstance.get("/auth/me");
          if (res.data?.data?.user) set({ authUser: res.data.data.user });
        } catch (error) {
          console.log("Error in checkAuth:", error);
          set({ authUser: null });
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      signup: async (data) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("/auth/signup", data);
          set({ authUser: res.data.data.user, isCheckingAuth: false });
          toast.success("Signup successful!");
        } catch (error) {
          toast.error(error.response?.data?.message || "Signup failed!");
          set({ authUser: null });
        } finally {
          set({ isSigningUp: false });
        }
      },

      login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data.data.user, isCheckingAuth: false });
          toast.success("Login successful!");
        } catch (error) {
          toast.error(error.response?.data?.message || "Login failed!");
          set({ authUser: null });
        } finally {
          set({ isLoggingIn: false });
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({ authUser: null, isCheckingAuth: false });
          toast.success("Logged out successfully");
        } catch (error) {
          console.error("Logout error:", error);
          set({ authUser: null });
        }
      },
    }),
    {
      name: "auth-storage", // key name in localStorage
      partialize: (state) => ({ authUser: state.authUser }), // only save authUser
    }
  )
);

