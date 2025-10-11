"use client"

import type React from "react"

import { useState, useEffect, useRef, type FormEventHandler, } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, X, Bot, User, GlobeIcon, MicIcon, PlusIcon, HammerIcon } from "lucide-react"
import BorderFrame from "./border-frame"
import ReactMarkdown from 'react-markdown'
import {
    AIInput,
    AIInputButton,
    AIInputModelSelect,
    AIInputModelSelectContent,
    AIInputModelSelectItem,
    AIInputModelSelectTrigger,
    AIInputModelSelectValue,
    AIInputSubmit,
    AIInputTextarea,
    AIInputToolbar,
    AIInputTools,
} from '@/components/ui/kibo-ui/ai/input';
import { Badge } from "./ui/badge"

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import {
    PromptInput,
    PromptInputBody,
    PromptInputMessage,
    PromptInputSubmit,
    PromptInputTextarea,
    PromptInputToolbar,
} from '@/components/ai-elements/prompt-input';
import {
    Conversation,
    ConversationContent,
    ConversationEmptyState,
    ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
    Message,
    MessageAvatar,
    MessageContent,
} from '@/components/ai-elements/message';
import { MessageSquareIcon } from 'lucide-react';
import { nanoid } from "nanoid"
import { Response } from "./ai-elements/response"

interface Message {
    id: string
    content: string
    role: "user" | "assistant"
    timestamp: Date
    metadata?: {
        tokens?: number
        model?: string
        processingTime?: number
    }
}

interface FloatingChatProps {
    className?: string
    hideInput?: boolean
}

const models = [
    { id: 'gpt-4', name: 'GPT-4', provider: 'openai.com' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai.com' },
    { id: 'claude-2', name: 'Claude 2', provider: 'anthropic.com' },
    { id: 'claude-instant', name: 'Claude Instant', provider: 'anthropic.com' },
    { id: 'palm-2', name: 'PaLM 2', provider: 'google.com' },
    { id: 'llama-2-70b', name: 'Llama 2 70B', provider: 'meta.com' },
    { id: 'llama-2-13b', name: 'Llama 2 13B', provider: 'meta.com' },
    { id: 'cohere-command', name: 'Command', provider: 'cohere.com' },
    { id: 'mistral-7b', name: 'Mistral 7B', provider: 'mistral.ai' },
];

export function AIFloatingChat({ hideInput = false }: FloatingChatProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(hideInput)
    const [text, setText] = useState<string>('');

    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/ai/chat',
        }),
        messages: [
            {
                id: nanoid(),
                parts: [{
                    type: 'text',
                    text: 'Hello, how are you?',
                }],
                role: 'user',
                timestamp: new Date(),
            },
            {
                id: nanoid(),
                parts: [{
                    type: 'text',
                    text: "I'm good, thank you! How can I assist you today?",
                }],
                role: 'assistant',
                timestamp: new Date(),
            },],
            onError: (error) => {
                console.error('Chat error:', error)
            },
            onToolCall: (toolCall) => {
                console.log('Tool call:', toolCall)
            },
    });
    console.log("🚀 ~ AIFloatingChat ~ messages:", messages)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    //   const scrollToBottom = () => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    //   }

    //   useEffect(() => {
    //     scrollToBottom()
    //   }, [messages])

    //   // Load chat history when component mounts
    //   // useEffect(() => {
    //   //   loadChatHistory()
    //   // }, [])

    //   // const loadChatHistory = async () => {
    //   //   if (isLoadingHistory) return

    //   //   setIsLoadingHistory(true)
    //   //   try {
    //   //     // First, try to get an existing session or create a new one
    //   //     const response = await fetch('/api/ai', {
    //   //       method: 'POST',
    //   //       headers: {
    //   //         'Content-Type': 'application/json',
    //   //       },
    //   //       body: JSON.stringify({
    //   //         query: 'Hello', // Initial greeting to establish session
    //   //         sessionId: sessionId
    //   //       })
    //   //     })

    //   //     if (response.ok) {
    //   //       const newSessionId = response.headers.get('X-Session-Id')
    //   //       if (newSessionId && newSessionId !== sessionId) {
    //   //         setSessionId(newSessionId)

    //   //         // Try to load existing conversation history for this session
    //   //         // Note: In a real implementation, you might have a separate endpoint for this
    //   //         // For now, we'll start with an empty conversation
    //   //       }
    //   //     }
    //   //   } catch (error) {
    //   //     console.error('Error loading chat history:', error)
    //   //   } finally {
    //   //     setIsLoadingHistory(false)
    //   //   }
    //   // }

    useEffect(() => {
        if (hideInput) return
        const handleScroll = () => {
            const isMobile = window.innerWidth < 768
            const scrollPosition = window.scrollY
            const windowHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight

            // Minimize when scrolled past 50% of the page
            if (scrollPosition > windowHeight * (isMobile ? 0.2 : 0.1)) {
                setIsMinimized(true)
            } else {
                setIsMinimized(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleSendMessage = async (message: PromptInputMessage) => {
        if (!message?.text?.trim() || status === 'submitted') return

        setIsOpen(true)
        setText('')
        await sendMessage({ text: message.text as string })
    }

    return (
        <>
            {/* Floating Input (Bottom of page) */}
            <AnimatePresence>
                {!isMinimized && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-md rounded-none"
                    >
                        <Card className="sm:glass md:bg-transparent w-full border-none shadow-none">
                            <CardContent>
                                <BorderFrame>
                                    <div className="">
                                        <PromptInput globalDrop multiple onSubmit={handleSendMessage} className="w-full flex items-center">
                                            <PromptInputBody className="w-full max-h-[100px] overflow-auto">
                                                <PromptInputTextarea
                                                    onChange={(e) => setText(e.target.value)}
                                                    ref={textareaRef}
                                                    value={text}
                                                />
                                            </PromptInputBody>
                                            <PromptInputToolbar className="flex justify-end">
                                                <PromptInputSubmit status={status} />
                                            </PromptInputToolbar>
                                        </PromptInput>
                                    </div>
                                </BorderFrame>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Minimized Chatbot Icon */}
            <AnimatePresence>
                {isMinimized && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 100 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 100 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-8 right-8 z-40"
                    >
                        <Button
                            size="icon"
                            onClick={() => setIsOpen(true)}
                            className="w-14 h-14 rounded-full shadow-lg animate-pulse-glow"
                        >
                            <MessageCircle className="h-6 w-6" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.8,
                            x: "-50%",
                            y: 100,
                            left: "50%",
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            x: 0,
                            y: 0,
                            left: "auto",
                            right: "2rem",
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.8,
                            y: 100,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            duration: 0.6,
                        }}
                        className="fixed bottom-8 z-50 w-100 max-w-[calc(100vw-2rem)]"
                        style={{ transformOrigin: "bottom center" }}
                    >
                        <Card className="glass shadow-2xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Bot className="h-5 w-5 text-primary" />
                                    AI Assistant <Badge variant="outline">Beta</Badge>
                                </CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                {/* <ScrollArea className="h-100 p-4"> */}
                                    <Conversation className="relative size-full" style={{ height: '498px' }}>
                                        <ConversationContent>
                                            {messages.length === 0 ? (
                                                <ConversationEmptyState
                                                    icon={<MessageSquareIcon className="size-6" />}
                                                    title="Start a conversation"
                                                    description="Messages will appear here as the conversation progresses."
                                                />
                                            ) : (
                                                messages.map(({ id, role, parts }, index) => (
                                                    <Message from={role} key={id}>
                                                        <MessageContent>
                                                            {parts.map((part, partIndex) => {
                                                                if (part.type === 'text') {
                                                                    return (
                                                                        <div key={partIndex} className="whitespace-pre-wrap">
                                                                            <Response>{part.text}</Response>
                                                                        </div>
                                                                    );
                                                                }
                                                                return null;
                                                            })}
                                                        </MessageContent>
                                                    </Message>
                                                ))
                                            )}
                                        </ConversationContent>
                                        <ConversationScrollButton />
                                    </Conversation>
                                {/* </ScrollArea> */}
                                <div className="p-4 border-t">
                                    <PromptInput globalDrop multiple onSubmit={(message) => { message?.text?.trim() && sendMessage({ text: message.text as string }) }} className="w-full flex items-center">
                                        <PromptInputBody className="w-full max-h-[100px] overflow-auto">
                                            <PromptInputTextarea
                                                onChange={(e) => setText(e.target.value)}
                                                ref={textareaRef}
                                                value={text}
                                            />
                                        </PromptInputBody>
                                        <PromptInputToolbar className="flex justify-end">
                                            <PromptInputSubmit status={status} />
                                        </PromptInputToolbar>
                                    </PromptInput>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
