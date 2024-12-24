import { Message } from "@/types/chatbot"
import { create } from "zustand"

interface ChatBotMessage {
    conversation: Message[],
    updateConversationState: (updater: (prev: Message[]) => Message[]) => void;
}


export const useChatbotStore = create<ChatBotMessage>((set) => ({
    conversation: [],
    updateConversationState: (updater) =>
      set((state) => ({ conversation: updater(state.conversation) })),
}));