
export interface Message {
  id: string;
  sender: 'user' | 'bot' | 'loader';
  text: string;
  isLoading?: boolean
}
