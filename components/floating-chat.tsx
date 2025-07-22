"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, X, Bot, User } from "lucide-react"
import BorderFrame from "./border-frame"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface FloatingChatProps {
  className?: string
  hideInput?: boolean
}

export function FloatingChat({hideInput = false}: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(hideInput)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! I'm Alex's AI assistant. Ask me anything about his skills, experience, or projects!",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
   const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  console.log("🚀 ~ Home ~ hoveredIndex:", hoveredIndex)
  const springConfig = { stiffness: 100, damping: 5 };

  const x = useMotionValue(0); // going to set this value on mouse move

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if(hideInput) return
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      console.log("🚀 ~ handleScroll ~ scrollPosition:", scrollPosition)
      const windowHeight = window.innerHeight
      console.log("🚀 ~ handleScroll ~ windowHeight:", windowHeight * 0.1)
      const documentHeight = document.documentElement.scrollHeight

      // Minimize when scrolled past 50% of the page
      if (scrollPosition > windowHeight * 0.1) {
        setIsMinimized(true)
      } else {
        setIsMinimized(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai?query=" + message, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let assistantContent = "";

      while (!done) {
        const { value, done: readerDone } = await reader?.read() as any;
        done = readerDone;
        assistantContent += decoder.decode(value, { stream: !done });
      }

      console.log("🚀 ~ handleSendMessage ~ assistantContent:", assistantContent);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: assistantContent,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
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
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
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
            <Card className="bg-transparent w-full border-none shadow-none">
              <CardContent>
                    <BorderFrame>
                <div className="flex items-center space-x-3">
                  <Input
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
                  </Button>
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
            className="fixed bottom-8 z-50 w-96 max-w-[calc(100vw-2rem)]"
            style={{ transformOrigin: "bottom center" }}
          >
            <Card className="glass shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  AI Assistant
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-80 p-4">
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
                          className={`flex items-start space-x-2 max-w-[80%] ${
                            msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              msg.role === "user" ? "bg-primary" : "bg-accent"
                            }`}
                          >
                            {msg.role === "user" ? (
                              <User className="h-4 w-4 text-primary-foreground" />
                            ) : (
                              <Bot className="h-4 w-4 text-accent-foreground" />
                            )}
                          </div>
                          <div
                            className={`rounded-lg p-3 ${
                              msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
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
                    <Input
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={isLoading || !message.trim()} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
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
