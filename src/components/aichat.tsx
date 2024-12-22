"use client";

import { useEffect, useRef, useState } from "react";
import { X, SendHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "./chat";

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
    { role: "system", content: code }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[#1a1b26] rounded-xl shadow-lg w-full max-w-2xl h-[600px] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#292e42]">
              <h2 className="text-[#a9b1d6] text-lg font-medium">Chat with AI</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="text-[#a9b1d6] hover:bg-[#292e42] hover:text-[#c0caf5] rounded-lg"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-[#292e42]">
              <div className="relative flex items-center">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-[#1e2235] border-none text-[#a9b1d6] placeholder-[#565f89] rounded-xl pr-12"
                />
                <Button 
                  type="submit"
                  size="icon"
                  className="absolute right-2 bg-[#7aa2f7] hover:bg-[#7aa2f7]/90 text-[#1a1b26] rounded-lg"
                >
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

