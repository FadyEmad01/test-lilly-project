// src/types/chat.ts
export interface ChatMessage {
  id: string;
  content: string;
  variant: 'sent' | 'received';
  timestamp: Date;
}

export interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
}