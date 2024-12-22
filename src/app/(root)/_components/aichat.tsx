"use client";

import { useEffect, useRef, useState } from "react";
import { X, SendHorizontal, Loader2, ChevronDown, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TypingAnimation } from "./typing-animation";
import { ChatMessage } from "./chat-message";
import { ShinyText } from "./shiny-text";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function AIChat({
  isOpen,
  onClose,
  code
}: {
  code: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "system", content: "Hello! I'm here to help you with your code. Here's the code you provided:" },
    { role: "system", content: code },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API || "");

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      const handleScroll = () => {
        const isScrolledToBottom = scrollArea.scrollHeight - scrollArea.scrollTop <= scrollArea.clientHeight + 100;
        setShowScrollButton(!isScrolledToBottom);
      };
      scrollArea.addEventListener('scroll', handleScroll);
      return () => scrollArea.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      setIsLoading(true);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const response = await model.generateContent([
        ...messages.map(msg => ({ role: msg.role, parts: [msg.content] })),
        { role: "user", parts: [input] }
      ]);
      const botMessage = {
        role: "bot",
        content: response?.response?.text() || "I couldn't understand that.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
      setIsThinking(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#0f111a]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[#1a1b26] rounded-lg shadow-lg w-full max-w-2xl overflow-hidden border border-[#292e42]"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#292e42]">
              <h2 className="text-[#a9b1d6] text-lg font-medium">Chat with AI</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="text-[#a9b1d6] hover:bg-[#292e42] hover:text-[#c0caf5]"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea 
              className="h-[60vh] px-4 py-6 relative" 
              ref={scrollAreaRef}
            >
              {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
              ))}
              {isThinking && (
                <div className="flex justify-start mb-4">
                  <div className="flex items-center gap-2 max-w-[80%]">
                    <Avatar className="bg-[#292e42]">
                      <AvatarFallback className="text-[#1a1b26]">AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 bg-[#292e42] text-[#a9b1d6]">
                      <ShinyText text="AI is Thinking" />
                      {/* <TypingAnimation /> */}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
              {showScrollButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-4 right-4 bg-[#292e42] text-[#a9b1d6] hover:bg-[#3a3f58] hover:text-[#c0caf5]"
                  onClick={scrollToBottom}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              )}
            </ScrollArea>
            <form onSubmit={handleSubmit} className="p-4 border-t border-[#292e42]">
              <div className="relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="pr-12 bg-[#292e42] border-none text-[#a9b1d6] placeholder-[#565f89] focus-visible:ring-1 focus-visible:ring-[#7aa2f7] rounded-full h-[3rem]"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#7aa2f7] hover:bg-[#7aa2f7]/90 text-[#1a1b26] rounded-full w-10 h-10 p-0"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <SendHorizontal className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

