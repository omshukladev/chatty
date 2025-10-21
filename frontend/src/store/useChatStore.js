import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    const newValue = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", newValue);
    set({ isSoundEnabled: newValue });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data.data });
    } catch (err) {
      toast.error(err.response?.data?.data || "Failed to fetch contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data.data });
    } catch (err) {
      toast.error(err.response?.data?.data || "Failed to fetch chats");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    if (!userId) return;
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      // Messages are already decrypted from backend
      set({ messages: res.data.data });
    } catch (err) {
      toast.error(err.response?.data?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return;

    const { authUser } = useAuthStore.getState();
    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      images: messageData.image || null,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    // Add optimistic message
    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      const serverMessage = res.data.data; // Already decrypted

      // Replace optimistic message with server message
      set({
        messages: get().messages.map((msg) =>
          msg._id === tempId ? serverMessage : msg
        ),
      });
    } catch (err) {
      // Remove optimistic message on error
      set({
        messages: get().messages.filter((msg) => msg._id !== tempId),
      });
      toast.error(err.response?.data?.message || "Failed to send message");
    }
  },

  // Subscribe to real-time messages
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const { socket, authUser } = useAuthStore.getState();
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const { messages, selectedUser } = get();
      if (!selectedUser) return;

      // Only accept messages from/to this chat
      if (
        newMessage.senderId !== selectedUser._id &&
        newMessage.receiverId !== selectedUser._id
      )
        return;

      // Avoid duplicates (replace optimistic message if _id matches)
      const updatedMessages = messages.map((msg) =>
        msg._id === newMessage._id ? newMessage : msg
      );

      if (!updatedMessages.find((msg) => msg._id === newMessage._id)) {
        updatedMessages.push(newMessage);
      }

      set({ messages: updatedMessages });

      // Play notification sound
      if (newMessage.senderId !== authUser._id && get().isSoundEnabled) {
        const audio = new Audio("/sounds/notification.mp3");
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    });
  },

  unsubscribeFromMessages: () => {
    const { socket } = useAuthStore.getState();
    socket?.off("newMessage");
  },
}));
