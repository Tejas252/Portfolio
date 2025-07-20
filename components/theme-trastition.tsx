'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [nextTheme, setNextTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setNextTheme(newTheme);
    setIsAnimating(true);

    setTimeout(() => {
      setTheme(newTheme);
    }, 300); // switch theme during animation

    setTimeout(() => {
      setIsAnimating(false);
    }, 1000); // clean up
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-[60] p-2 rounded-full bg-black text-white dark:bg-white dark:text-black shadow"
      >
        {theme === 'dark' ? '🌞' : '🌙'}
      </button>

      {/* Animation Overlay */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white dark:bg-black"
            initial={{ scale: 0 }}
            animate={{ scale: 50 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            style={{ originX: 1, originY: 0 }} // top-right corner
          />
        )}
      </AnimatePresence>
    </>
  );
}
