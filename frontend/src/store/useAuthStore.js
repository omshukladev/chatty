import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
//this create take 2 arguments useAuthStore= create((set, get) => ({}))
export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningup: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      set({ authUser: res.data.data.user }); //if user is authenticated set the user data
    } catch (error) {
      console.log("Error of authCheck", error);
      set({ authUser: null }); //if error then user is not authenticated
    } finally {
      set({ isCheckingAuth: false }); //after checking auth set it to false
    }
  },

  signup: async (data) => {
    set({ isSigningup: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data.data.user });  // Set the authenticated user
      // res.data.data
      toast.success("Signup successful!");
    } catch (error) {
      console.log("Error of signup", error);
      toast.error("Signup failed!");
    } finally {
      set({ isSigningup: false });
    }
  },
}));


// form input → formData (React state) → axios POST (JSON body) → backend (req.body) → process → response → store authUser