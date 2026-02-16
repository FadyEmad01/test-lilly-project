// src/context/ChatContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ChatMessage } from '@/types/chat';

interface ChatContextValue {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  unreadCount: number;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  sendMessage: (content: string) => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

const generateId = () => Math.random().toString(36).substring(2, 9);

const botResponses = [
  "Hey! How can I help you today? 👋",
  "That's a great question! Let me think about that...",
  "I'm here to assist you with anything you need!",
  "Thanks for reaching out! What would you like to know?",
  "Interesting! Tell me more about that.",
];

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: generateId(),
      content: "Hey there! 👋 How can I help you today?",
      variant: 'received',
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const openChat = useCallback(() => {
    setIsOpen(true);
    setUnreadCount(0);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => {
      if (!prev) setUnreadCount(0);
      return !prev;
    });
  }, []);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      content: content.trim(),
      variant: 'sent',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false);
      const botMessage: ChatMessage = {
        id: generateId(),
        content: botResponses[Math.floor(Math.random() * botResponses.length)],
        variant: 'received',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      
      // Increment unread if chat is closed
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    }, 1500 + Math.random() * 1000);
  }, [isOpen]);

  const clearMessages = useCallback(() => {
    setMessages([{
      id: generateId(),
      content: "Hey there! 👋 How can I help you today?",
      variant: 'received',
      timestamp: new Date(),
    }]);
  }, []);

  return (
    <ChatContext.Provider value={{
      isOpen,
      messages,
      isTyping,
      unreadCount,
      openChat,
      closeChat,
      toggleChat,
      sendMessage,
      clearMessages,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}