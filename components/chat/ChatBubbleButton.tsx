// src/components/chat/ChatBubbleButton.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatBubbleButtonProps {
  isOpen: boolean;
  onClick: () => void;
  unreadCount?: number;
  accentColor?: string;
}

export function ChatBubbleButton({ 
  isOpen, 
  onClick, 
  unreadCount = 0,
  accentColor = "#00bbff",
}: ChatBubbleButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "w-14 h-14 rounded-full",
        "flex items-center justify-center",
        "shadow-lg shadow-black/30",
        "border border-white/10",
        "transition-colors duration-300"
      )}
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
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
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
          className="absolute inset-0 rounded-full"
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
  );
}