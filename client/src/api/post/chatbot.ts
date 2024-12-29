/* eslint-disable @typescript-eslint/no-explicit-any */
import { simulateTypingEffect } from "@/lib/utils";
import { useChatbotStore } from "@/store/chatbotState";
import { Message } from "@/types/chatbot";
import apiInstance from '../axios';

export const handleChatbotMessage = async (message: string, setMessage: React.Dispatch<React.SetStateAction<string>>) => {
    const updateConversationState = useChatbotStore.getState().updateConversationState;

    if (message.trim()) {
        const userMessage: Message = { sender: 'user', text: message };
        updateConversationState(prevConversation => [...prevConversation, userMessage]);

        try {
            const res = await apiInstance.post<{ response: string }>('/message/chatbot', { message });
            simulateTypingEffect(res.data.response);

        } catch (error: any) {

            const statusCode = error.response?.status; 
            let errorMessageText = "There was an error sending the message, Please Try Again.";

            if(statusCode === 401){
                errorMessageText = "Please login or signup to get started chatting";
            }

            const errorMessage: Message = { sender: 'bot', text: errorMessageText };
            console.error("There was an error sending the message!", error);
            updateConversationState(prevConversation => [...prevConversation, errorMessage]);
        }

        setMessage('');
    }
};