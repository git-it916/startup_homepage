"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NameInputProps {
  value: string;
  onChange: (name: string) => void;
  onNext: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
}

export default function NameInput({ value, onChange, onNext }: NameInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);

  // Auto-focus on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Spawn particles on typing
  const spawnParticle = () => {
    if (!containerRef.current || !inputRef.current) return;

    const inputRect = inputRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // Calculate cursor position (approximate based on text length)
    const charWidth = 20; // Approximate character width
    const cursorX = inputRect.left - containerRect.left + Math.min(value.length * charWidth, inputRect.width - 20);
    const cursorY = inputRect.top - containerRect.top + inputRect.height / 2;

    const newParticle: Particle = {
      id: particleIdRef.current++,
      x: cursorX + (Math.random() - 0.5) * 30,
      y: cursorY + (Math.random() - 0.5) * 20,
    };

    setParticles((prev) => [...prev.slice(-15), newParticle]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length > value.length) {
      spawnParticle();
    }
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim().length > 0) {
      onNext();
    }
  };

  const isValid = value.trim().length > 0;

  return (
    <div className="flex flex-col items-center w-full max-w-md" ref={containerRef}>
      {/* Description */}
      <motion.p
        className="text-foreground/70 text-sm font-medium mb-8 text-center leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        이름은 당신의 운명의 진동을 담고 있습니다
      </motion.p>

      {/* Input container with particles */}
      <div className="relative w-full mb-12">
        {/* Particle effects */}
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute pointer-events-none"
              style={{
                left: particle.x,
                top: particle.y,
              }}
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                opacity: 0,
                scale: 0,
                y: -50,
                x: (Math.random() - 0.5) * 40,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              onAnimationComplete={() => {
                setParticles((prev) => prev.filter((p) => p.id !== particle.id));
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background:
                    Math.random() > 0.5
                      ? "radial-gradient(circle, #d4af37 0%, transparent 70%)"
                      : "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
                  boxShadow:
                    Math.random() > 0.5
                      ? "0 0 10px rgba(212, 175, 55, 0.5)"
                      : "0 0 10px rgba(124, 58, 237, 0.5)",
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Glow effect when focused */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            boxShadow: isFocused
              ? "0 0 30px rgba(212, 175, 55, 0.3), 0 0 60px rgba(212, 175, 55, 0.1)"
              : "0 0 0px transparent",
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Main input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter your name"
          className="w-full px-6 py-5 text-2xl font-bold text-center
                     bg-transparent border-2 rounded-2xl
                     placeholder:text-foreground/40 placeholder:font-normal
                     focus:border-gold/50 transition-all duration-500"
          style={{
            borderColor: isFocused ? "rgba(212, 175, 55, 0.5)" : "rgba(232, 232, 240, 0.15)",
            color: "#e8e8f0",
            caretColor: "#d4af37",
          }}
          maxLength={50}
        />

        {/* Animated underline */}
        <motion.div
          className="absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent"
          initial={{ width: 0, x: "-50%" }}
          animate={{
            width: isFocused ? "80%" : "0%",
            x: "-50%",
          }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Character count */}
      <motion.p
        className="text-foreground/60 text-xs font-medium mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {value.length} / 50 characters
      </motion.p>

      {/* Continue button */}
      <motion.button
        onClick={onNext}
        disabled={!isValid}
        className={`px-8 py-3 rounded-full font-medium
                   transition-all duration-300 ${
                     isValid
                       ? "bg-gradient-to-r from-gold/80 to-gold text-background glow-gold hover:from-gold hover:to-gold/80"
                       : "bg-foreground/10 text-foreground/30 cursor-not-allowed"
                   }`}
        whileHover={isValid ? { scale: 1.05 } : {}}
        whileTap={isValid ? { scale: 0.95 } : {}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        {isValid ? "Continue" : "Enter your name"}
      </motion.button>

      {/* Hint */}
      <motion.p
        className="text-foreground/60 text-xs font-medium mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Press Enter to continue
      </motion.p>
    </div>
  );
}
