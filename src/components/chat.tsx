import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessageProps {
  message: {
    role: string;
    content: string;
  };
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-4 mb-6"
    >
      {!isUser && (
        <Avatar className="w-8 h-8 bg-[#292e42]">
          <AvatarFallback className="text-[#a9b1d6] text-sm">AI</AvatarFallback>
        </Avatar>
      )}
      <div className="bg-[#1e2235] rounded-2xl px-6 py-4 text-[#a9b1d6] max-w-[85%] text-sm">
        {message.content}
      </div>
    </motion.div>
  );
};

