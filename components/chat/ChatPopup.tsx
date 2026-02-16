// src/components/chat/ChatPopup.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { ChatMessage } from '@/types/chat';
import { cn } from '@/lib/utils';

interface ChatPopupProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    accentColor?: string;
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Format timestamp
const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

// Sample bot responses
const botResponses = [
    "Hey! How can I help you today? 👋",
    "That's a great question! Let me think about that...",
    "I'm here to assist you with anything you need!",
    "Thanks for reaching out! What would you like to know?",
    "Interesting! Tell me more about that.",
];

export function ChatPopup({
    isOpen,
    onClose,
    title = "Chat Support",
    subtitle = "We typically reply within minutes",
    accentColor = "#00bbff",
}: ChatPopupProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: generateId(),
            content: "Hey there! 👋 How can I help you today?",
            variant: 'received',
            timestamp: new Date(),
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Scroll to bottom when new messages arrive
    const scrollToBottom = useCallback(() => {
        if (messagesEndRef.current) {
            // messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, scrollToBottom]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when chat is open on mobile
    useEffect(() => {
        if (isOpen) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [isOpen]);

    const handleSendMessage = useCallback(() => {
        if (!inputValue.trim()) return;

        const userMessage: ChatMessage = {
            id: generateId(),
            content: inputValue.trim(),
            variant: 'sent',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
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
        }, 1500 + Math.random() * 1000);
    }, [inputValue]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop - Mobile only */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                        onClick={onClose}
                    />

                    {/* Chat Window */}
                    <motion.div
                    data-lenis-prevent
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 30
                        }}
                        className={cn(
                            "fixed z-50",
                            // Mobile: full screen with safe areas
                            "inset-4 md:inset-auto",
                            // Desktop: bottom right corner
                            "md:bottom-24 md:right-6",
                            "md:w-[380px] md:h-[600px] md:max-h-[80vh]",
                            "flex flex-col",
                            "bg-black rounded-2xl overflow-hidden",
                            "border border-white/10",
                            "shadow-2xl shadow-black/50"
                        )}
                    >
                        {/* Header */}
                        <motion.header
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0"
                            style={{ backgroundColor: accentColor }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-black uppercase text-sm">
                                        {title}
                                    </h3>
                                    <p className="text-xs text-black/60">
                                        {subtitle}
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                className="w-8 h-8 rounded-full border border-black/30 flex items-center justify-center
                         hover:bg-black/10 transition-colors"
                            >
                                <X className="w-4 h-4 text-black" />
                            </motion.button>
                        </motion.header>

                        {/* Messages Container */}
                        <div
                            data-lenis-prevent
                            ref={messagesContainerRef}
                            className="flex-1 overflow-y-auto overscroll-contain p-4"
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'rgba(255,255,255,0.2) transparent',
                            }}
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
                                    {isTyping && (
                                        <div className="flex items-start">
                                            <TypingIndicator />
                                        </div>
                                    )}
                                </AnimatePresence>

                                {/* Scroll anchor */}
                                <div ref={messagesEndRef} className="h-px" />
                            </div>
                        </div>

                        {/* Input */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-4 border-t border-white/10 flex-shrink-0"
                        >
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
                           focus:outline-none focus:ring-2 focus:ring-white/20
                           transition-all duration-200"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim()}
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                                        "transition-all duration-200",
                                        inputValue.trim()
                                            ? "bg-[#00bbff] text-black"
                                            : "bg-white/5 text-white/30 cursor-not-allowed"
                                    )}
                                >
                                    <Send className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}