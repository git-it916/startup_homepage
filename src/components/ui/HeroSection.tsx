"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface HeroSectionProps {
  onBeginRitual: () => void;
}

const titleWords = ["K", "-", "DESTINY"];
const subtitleWords = ["Discover", "the", "K-Star", "aligned", "with", "your", "soul."];
const koreanTitle = "나의 K-운명";

export default function HeroSection({ onBeginRitual }: HeroSectionProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Magnetic effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 400 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    mouseX.set(distanceX * 0.15);
    mouseY.set(distanceY * 0.15);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: 1.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <motion.section
      className="relative min-h-screen flex flex-col items-center justify-center px-6 z-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Main Title */}
      <motion.div className="flex items-center justify-center mb-4">
        {titleWords.map((word, index) => (
          <motion.span
            key={index}
            variants={wordVariants}
            className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight ${
              word === "K" ? "gradient-text text-glow" : "text-foreground/90"
            }`}
            style={{
              fontFamily: "'Geist', sans-serif",
              letterSpacing: word === "-" ? "0.05em" : "0.02em",
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>

      {/* Korean Title */}
      <motion.p
        variants={wordVariants}
        className="text-2xl sm:text-3xl md:text-4xl text-gold font-bold mb-8 tracking-widest text-glow"
        style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
      >
        {koreanTitle}
      </motion.p>

      {/* Decorative Line */}
      <motion.div
        className="w-32 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent mb-8"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.8 }}
      />

      {/* Subtitle */}
      <motion.div
        className="flex flex-wrap justify-center gap-x-2 gap-y-1 mb-12 max-w-lg"
        variants={containerVariants}
      >
        {subtitleWords.map((word, index) => (
          <motion.span
            key={index}
            variants={subtitleVariants}
            className={`text-lg sm:text-xl md:text-2xl font-semibold ${
              word === "K-Star" ? "text-gold text-glow-subtle" : "text-foreground/80"
            }`}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>

      {/* CTA Button with Magnetic Effect */}
      <motion.div
        variants={buttonVariants}
        className="relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
      >
        {/* Glow effect behind button */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gold/20 blur-xl"
          animate={{
            scale: isHovered ? 1.5 : 1,
            opacity: isHovered ? 0.6 : 0.3,
          }}
          transition={{ duration: 0.4 }}
        />

        <motion.button
          ref={buttonRef}
          onClick={onBeginRitual}
          className="relative px-10 py-4 rounded-full font-medium text-lg
                     bg-gradient-to-r from-gold/90 via-gold to-gold/90
                     text-background overflow-hidden group
                     border border-gold/30"
          style={{ x, y }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            animate={isHovered ? { x: "100%" } : { x: "-100%" }}
            transition={{ duration: 0.6 }}
          />

          {/* Button content */}
          <span className="relative z-10 flex items-center gap-3">
            <span>Begin the Ritual</span>
            <span className="text-sm opacity-70">운명 확인하기</span>
          </span>

          {/* Ripple rings on hover */}
          {isHovered && (
            <>
              <motion.span
                className="absolute inset-0 rounded-full border border-gold/30"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.span
                className="absolute inset-0 rounded-full border border-gold/20"
                initial={{ scale: 1, opacity: 0.3 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              />
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <motion.div
          className="w-5 h-8 rounded-full border border-foreground/20 flex justify-center pt-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 rounded-full bg-gold/60"
            animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
