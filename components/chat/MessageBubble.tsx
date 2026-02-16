// src/components/chat/MessageBubble.tsx
'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  message: string;
  variant: 'sent' | 'received';
  grouped?: 'first' | 'middle' | 'last' | 'none';
  className?: string;
  children?: React.ReactNode;
}

export function MessageBubble({
  message,
  variant,
  grouped = 'none',
  className,
  children,
}: MessageBubbleProps) {
  const variantClass = variant === 'sent' ? 'imessage-from-me' : 'imessage-from-them';
  
  const groupedClass = grouped !== 'none' 
    ? `imessage-grouped-${grouped}` 
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 500, 
        damping: 30 
      }}
      className={cn(
        'imessage-bubble',
        variantClass,
        groupedClass,
        className
      )}
    >
      {children || (
        <span className="text-sm">{message}</span>
      )}
    </motion.div>
  );
}

// Grouped messages component
interface ChatMessageGroupProps {
  messages: string[];
  variant: 'sent' | 'received';
  timestamp?: string;
  showTimestamp?: boolean;
}

export function ChatMessageGroup({
  messages,
  variant,
  timestamp,
  showTimestamp = true,
}: ChatMessageGroupProps) {
  const getGroupPosition = (index: number, total: number): 'first' | 'middle' | 'last' | 'none' => {
    if (total === 1) return 'none';
    if (index === 0) return 'first';
    if (index === total - 1) return 'last';
    return 'middle';
  };

  return (
    <div className={cn(
      'flex flex-col gap-0.5',
      variant === 'sent' ? 'items-end' : 'items-start'
    )}>
      {messages.map((msg, index) => (
        <MessageBubble
          key={index}
          message={msg}
          variant={variant}
          grouped={getGroupPosition(index, messages.length)}
        />
      ))}
      {showTimestamp && timestamp && (
        <span className={cn(
          'text-[10px] text-white/40 mt-1 px-2',
          variant === 'sent' ? 'text-right' : 'text-left'
        )}>
          {timestamp}
        </span>
      )}
    </div>
  );
}