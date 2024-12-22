import { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Typewriter } from './typewriter';
import TypingAnimation from '@/components/ui/typing-animation';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

interface ChatMessageProps {
  message: {
    role: string;
    content: string;
  };
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isCode = message.content.includes('```');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const renderContent = () => {
    if (isCode) {
      const codeBlocks = message.content.split('```');
      return codeBlocks.map((block, index) => {
        if (index % 2 === 1) {
          // This is a code block
          const language = block.split('\n')[0].trim();
          const code = block.split('\n').slice(1).join('\n').trim();
          return (
            <div key={index} className="relative">
              <SyntaxHighlighter
                language={language || 'javascript'}
                style={vscDarkPlus}
                customStyle={{
                  margin: '1em 0',
                  borderRadius: '0.5em',
                  padding: '1em',
                }}
              >
                {code}
              </SyntaxHighlighter>
              <button
                onClick={() => copyToClipboard(code)}
                className="absolute top-2 right-2 p-2 bg-[#292e42] rounded-md hover:bg-[#3a3f58] transition-colors"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-[#a9b1d6]" />
                )}
              </button>
            </div>
          );
        } else {
          // This is regular text
          return <p key={index}>{block}</p>;
        }
      });
    } else {
      return isUser ? (
        message.content
      ) : (
        <TypingAnimation
          className="text-[15px] text-white font-normal dark:text-white"
          text={message.content}
          duration={30}
        />
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`flex items-start gap-2 max-w-[80%] ${
          isUser ? 'flex-row-reverse' : ''
        }`}
      >
        <Avatar className={isUser ? "bg-[#7aa2f7]" : "bg-[#292e42]"}>
          <AvatarFallback className="text-[#1a1b26]">
            {isUser ? "U" : "AI"}
          </AvatarFallback>
        </Avatar>
        <div
          className={`rounded-lg px-4 py-2 ${
            isUser
              ? "bg-[#7aa2f7] text-[#1a1b26]"
              : "bg-[#292e42] text-[#a9b1d6]"
          }`}
        >
          {renderContent()}
        </div>
      </div>
    </motion.div>
  );
};

