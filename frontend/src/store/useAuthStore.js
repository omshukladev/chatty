import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:4000" : "/"; // Socket.io server URL


export const useAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,
      isCheckingAuth: true,
      isSigningUp: false,
      isLoggingIn: false,
      socket: null,
      onlineUsers: [],

      checkAuth: async () => {
        try {
          const res = await axiosInstance.get("/auth/me");
          if (res.data?.data?.user) {
            set({ authUser: res.data.data.user });
            get().connectSocket();
          }
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
          const res = await axiosInstance.post("/auth/signup", data); // Sending data to the backend
          set({ authUser: res.data.data.user, isCheckingAuth: false });
          toast.success("Signup successful!");
          get().connectSocket();
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
          get().connectSocket();
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
          get().disconnectSocket();
        } catch (error) {
          console.error("Logout error:", error);
          set({ authUser: null });
        }
      },

      updateProfile: async (data) => {
        //so here we are taking data from Profile component and sending it to backend to update the user profile
        set({ isUpdatingProfile: true });
        try {
          // Create FormData if we have base64 image data
          let requestData;

          if (data.profilePic && data.profilePic.startsWith("data:image")) {
            // Convert base64 to Blob and then to File
            const response = await fetch(data.profilePic);
            const blob = await response.blob();

            // Create a file from the blob
            const file = new File([blob], "profile-pic.jpg", { type: "image/jpeg" });

            // Create FormData and append the file
            requestData = new FormData();
            requestData.append("profilePic", file);

            // Send with FormData content type
            const res = await axiosInstance.put("/auth/update-profile", requestData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            set({ authUser: res.data.data });
          } else {
            // Regular JSON data
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data.data });
          }

          toast.success("Profile updated successfully");
        } catch (error) {
          console.error("Update profile error:", error);
          toast.error(error.response?.data?.message || "Profile update failed");
        }
      },

      connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
          withCredentials: true, // this ensures cookies are sent with the connection
        });

        socket.connect();

        set({ socket });

        // listen for online users event
        socket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsers: userIds });
        });
      },

      disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
      },
    }),
    {
      // why we use persist : to store data in localStorage so that even after refresh data will be there
      // how to check : go to application in inspect and check localStorage
      name: "auth-storage", // key name in localStorage
      partialize: (state) => ({ authUser: state.authUser }), // only save authUser
    }
  )
);
