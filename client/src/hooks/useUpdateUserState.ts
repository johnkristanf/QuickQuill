import { getUserData } from "@/api/get/user";
import { useUserStore } from "@/store/userStore";
import { UserData } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useUpdateUserState = () => {
    const { data, error, isLoading } = useQuery({ 
        queryKey: ['user_data'], queryFn: getUserData 
    });

    const user: UserData = data && data.user;
    const updateUserState = useUserStore((state) => state.updateUserState)

    useEffect(() => {
        updateUserState(user)
    }, [updateUserState, user])

    return {
        isLoading,
        error
    }
}