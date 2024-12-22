import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface TypewriterProps {
  text: string;
  delay?: number;
}

export const Typewriter: React.FC<TypewriterProps> = ({ text, delay = 50 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const controls = useAnimation();

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        controls.start({ opacity: 1 });
      }
    }, delay);

    return () => clearInterval(timer);
  }, [text, delay, controls]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={controls}
      transition={{ duration: 0.5 }}
    >
      {displayedText}
    </motion.div>
  );
};
