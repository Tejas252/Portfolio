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

export function FloatingChat({ hideInput = false }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(hideInput)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState<string>('');
  const [status, setStatus] = useState<
    'submitted' | 'streaming' | 'ready' | 'error'
  >('ready');
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load chat history when component mounts
  // useEffect(() => {
  //   loadChatHistory()
  // }, [])

  // const loadChatHistory = async () => {
  //   if (isLoadingHistory) return
    
  //   setIsLoadingHistory(true)
  //   try {
  //     // First, try to get an existing session or create a new one
  //     const response = await fetch('/api/ai', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         query: 'Hello', // Initial greeting to establish session
  //         sessionId: sessionId
  //       })
  //     })

  //     if (response.ok) {
  //       const newSessionId = response.headers.get('X-Session-Id')
  //       if (newSessionId && newSessionId !== sessionId) {
  //         setSessionId(newSessionId)
          
  //         // Try to load existing conversation history for this session
  //         // Note: In a real implementation, you might have a separate endpoint for this
  //         // For now, we'll start with an empty conversation
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error loading chat history:', error)
  //   } finally {
  //     setIsLoadingHistory(false)
  //   }
  // }

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

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return

    setStatus('submitted')

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentMessage = message
    setMessage("")
    setIsLoading(true)

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }))

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: currentMessage,
          sessionId: sessionId,
          conversationHistory: conversationHistory
        })
      })

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.")
        }
        throw new Error("Failed to send message")
      }

      // Update session ID if provided
      const newSessionId = response.headers.get('X-Session-Id')
      if (newSessionId && newSessionId !== sessionId) {
        setSessionId(newSessionId)
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let assistantContent = "";
      
      // Create assistant message placeholder
      const assistantMessageId = (Date.now() + 1).toString()
      const assistantMessage: Message = {
        id: assistantMessageId,
        content: "",
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setStatus('streaming')

      while (!done) {
        const { value, done: readerDone } = await reader?.read() as any;
        done = readerDone;
        const chunk = decoder.decode(value, { stream: !done });
        assistantContent += chunk;
        
        // Update the assistant message in real-time
        setMessages((prev) => 
          prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: assistantContent }
              : msg
          )
        );
      }
      
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble responding right now. Please contact to savaliyatejas108@gmail.com",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setTimeout(() => {
      setStatus('streaming');
    }, 200);
    setTimeout(() => {
      setStatus('ready');
    }, 2000);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
      setIsOpen(true)
    }
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
                  <div className="flex items-center space-x-3">
                    <AIInput onSubmit={(e) =>{ e.preventDefault();}}>
                      <AIInputToolbar>
                        <AIInputTextarea onChange={(e) => setMessage(e.target.value)} onKeyUp={handleKeyPress} placeholder="Ask me about Tejas..." value={message} />
                        <AIInputSubmit disabled={!message} status={status} onClick={() => {
                          if (message.trim()) {
                            // Add animation to move to right side before opening chat
                            setIsOpen(true)
                            handleSendMessage()
                          } else {
                            setIsOpen(true)
                          }
                        }} />
                      </AIInputToolbar>
                    </AIInput>
                    {/* <Input
                    placeholder="Ask me about Tejas..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 rounded-none text-white"
                  />
                  <Button
                    size="icon"
                    onClick={() => {
                      if (message.trim()) {
                        // Add animation to move to right side before opening chat
                        setIsOpen(true)
                        handleSendMessage()
                      } else {
                        setIsOpen(true)
                      }
                    }}
                    className="shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button> */}
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
                <ScrollArea className="h-100 p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex items-start space-x-2 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                            }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-primary" : "bg-accent"
                              }`}
                          >
                            {msg.role === "user" ? (
                              <User className="h-4 w-10 text-primary-foreground" />
                            ) : (
                              <Bot className="h-4 w-10 text-accent-foreground" />
                            )}
                          </div>
                          <div
                            className={`rounded-lg p-3 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                          >
                            <p className="text-sm">
                              <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="flex items-start space-x-2">
                          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                            <Bot className="h-4 w-4 text-accent-foreground" />
                          </div>
                          <div className="bg-muted rounded-lg p-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <AIInput onSubmit={handleSendMessage}>
                      <AIInputToolbar>
                        <AIInputTextarea onChange={(e) => setMessage(e.target.value)} onKeyUp={handleKeyPress} placeholder="Ask me about Tejas..." value={message} />
                        <AIInputSubmit disabled={isLoading || !message.trim()} status={status} onClick={() => {
                          if (message.trim()) {
                            // Add animation to move to right side before opening chat
                            setIsOpen(true)
                            handleSendMessage()
                          } else {
                            setIsOpen(true)
                          }
                        }} />
                      </AIInputToolbar>
                    </AIInput>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
