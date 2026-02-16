// src/components/chat/ChatWidgetWithContext.tsx
'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, MessageCircle } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { cn } from '@/lib/utils';

interface ChatWidgetWithContextProps {
  title?: string;
  subtitle?: string;
  accentColor?: string;
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

export function ChatWidgetWithContext({ 
  title = "Chat Support",
  subtitle = "We typically reply within minutes",
  accentColor = "#00bbff",
}: ChatWidgetWithContextProps) {
  const { 
    isOpen, 
    messages, 
    isTyping, 
    unreadCount, 
    toggleChat, 
    closeChat, 
    sendMessage 
  } = useChat();
  
  const [inputValue, setInputValue] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 300);
    }
  }, [isOpen, scrollToBottom]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeChat();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeChat]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full
                   flex items-center justify-center shadow-lg shadow-black/30
                   border border-white/10 transition-colors duration-300"
        style={{ backgroundColor: isOpen ? '#27272a' : accentColor }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <MessageCircle className="w-6 h-6 text-black" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread Badge */}
        <AnimatePresence>
          {!isOpen && unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full 
                       bg-red-500 text-white text-xs font-bold
                       flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulse Animation */}
        {!isOpen && (
          <motion.span
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ backgroundColor: accentColor }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.button>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - Mobile only */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={closeChat}
            />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={cn(
                "fixed z-50",
                "inset-4 md:inset-auto",
                "md:bottom-24 md:right-6",
                "md:w-[380px] md:h-[600px] md:max-h-[80vh]",
                "flex flex-col",
                "bg-black rounded-2xl overflow-hidden",
                "border border-white/10",
                "shadow-2xl shadow-black/50"
              )}
            >
              {/* Header */}
              <header
                className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0"
                style={{ backgroundColor: accentColor }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black uppercase text-sm">{title}</h3>
                    <p className="text-xs text-black/60">{subtitle}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeChat}
                  className="w-8 h-8 rounded-full border border-black/30 flex items-center justify-center
                           hover:bg-black/10 transition-colors"
                >
                  <X className="w-4 h-4 text-black" />
                </motion.button>
              </header>

              {/* Messages */}
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto overscroll-contain p-4"
              >
                <div className="flex flex-col gap-3">
                  {messages.map((message, index) => {
                    const prevMessage = messages[index - 1];
                    const nextMessage = messages[index + 1];
                    const isFirstInGroup = !prevMessage || prevMessage.variant !== message.variant;
                    const isLastInGroup = !nextMessage || nextMessage.variant !== message.variant;
                    
                    let grouped: 'first' | 'middle' | 'last' | 'none' = 'none';
                    if (!isFirstInGroup && !isLastInGroup) grouped = 'middle';
                    else if (!isFirstInGroup) grouped = 'last';
                    else if (!isLastInGroup) grouped = 'first';

                    return (
                      <div 
                        key={message.id}
                        className={cn(
                          "flex flex-col",
                          message.variant === 'sent' ? 'items-end' : 'items-start'
                        )}
                      >
                        <MessageBubble
                          message={message.content}
                          variant={message.variant}
                          grouped={grouped}
                        />
                        {isLastInGroup && (
                          <span className="text-[10px] text-white/30 mt-1 px-1">
                            {formatTime(message.timestamp)}
                          </span>
                        )}
                      </div>
                    );
                  })}

                  <AnimatePresence>
                    {isTyping && <TypingIndicator />}
                  </AnimatePresence>

                  <div ref={messagesEndRef} className="h-px" />
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5
                             text-sm text-white placeholder:text-white/30
                             focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                      inputValue.trim()
                        ? "bg-[#00bbff] text-black"
                        : "bg-white/5 text-white/30 cursor-not-allowed"
                    )}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}