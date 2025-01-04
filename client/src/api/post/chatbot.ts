/* eslint-disable @typescript-eslint/no-explicit-any */
import { useChatbotStore } from "@/store/chatbotState";
import { Message } from "@/types/chatbot";

import { v4 as uuidv4 } from 'uuid';

import apiInstance from '../axios';

export const handleChatbotMessage = async (
    message: string,
    setMessage: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const updateConversationState = useChatbotStore.getState().updateConversationState;
  
    if (message.trim()) {
      const userMessage: Message = { id: uuidv4(), sender: 'user', text: message };
      const loaderMessage: Message = { id: uuidv4(), sender: 'bot', text: '', isLoading: true };
  
      updateConversationState(prevConversation => [...prevConversation, userMessage]);
      updateConversationState(prevConversation => [...prevConversation, loaderMessage]);
  
        try {
            const res = await apiInstance.post<{ response: string }>('/message/chatbot', { message });
    
            // Update loader with the bot's response
            updateConversationState(prevConversation =>
            prevConversation.map(msg =>
                msg.id === loaderMessage.id
                ? { ...msg, text: res.data.response, isLoading: false }
                : msg
            )
            );
    
            
        } catch (error: any) {
            const statusCode = error.response?.status;
            let errorMessageText = 'There was an error sending the message. Please try again.';
    
            if (statusCode === 401) {
                errorMessageText = 'Please login or signup to get started chatting';
            }
    
            console.error('There was an error sending the message!', error);
    
            updateConversationState(prevConversation =>
            prevConversation.map(msg =>
                msg.id === loaderMessage.id
                ? { ...msg, text: errorMessageText, isLoading: false }
                : msg
            )
            );
        }
    
        setMessage('');
        }
  };
  