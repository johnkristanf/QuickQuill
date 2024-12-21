import { UserData } from "@/types/user";
import { create } from "zustand";

interface UserDataState{
    user: UserData,
    updateUserState: (user: UserData) => void
}

export const useUserStore = create<UserDataState>((set) => ({
    user: {
        id: 0,
        name: "",
        email: "",
        avatar: "",
    },
    updateUserState: (user) => set({ user })
}))