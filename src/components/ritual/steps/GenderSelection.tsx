"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface GenderSelectionProps {
  value: "yin" | "yang" | null;
  onChange: (gender: "yin" | "yang") => void;
  onNext: () => void;
}

export default function GenderSelection({
  value,
  onChange,
  onNext,
}: GenderSelectionProps) {
  const [hoveredCard, setHoveredCard] = useState<"yin" | "yang" | null>(null);

  const handleSelect = (gender: "yin" | "yang") => {
    onChange(gender);
  };

  const cardVariants = {
    initial: { opacity: 0, y: 30, scale: 1 },
    animate: { opacity: 1, y: 0, scale: 1 },
    hover: { opacity: 1, scale: 1.02, y: -5 },
    selected: { opacity: 1, scale: 1.08, y: 0 },
    hidden: { opacity: 0, scale: 0.8, y: 20 },
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl">
      {/* Description */}
      <motion.p
        className="text-foreground/70 text-sm font-medium mb-2 text-center leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        사주에서 음양은 해석에 중요한 영향을 미칩니다
      </motion.p>
      <motion.p
        className="text-foreground/50 text-xs font-medium mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        태어날 때의 생물학적 성별을 선택해주세요
      </motion.p>

      {/* Cards */}
      <div className="flex flex-col sm:flex-row gap-6 mb-8 w-full px-4 justify-center">
        {/* Yin Card - Female */}
        <motion.button
          className={`relative flex-1 p-8 rounded-2xl border-2 transition-colors duration-300
                      ${
                        value === "yin"
                          ? "border-purple-400/60 bg-purple-500/10"
                          : "border-foreground/10 bg-foreground/5 hover:border-purple-400/30"
                      }`}
          variants={cardVariants}
          initial="initial"
          animate={
            value === null
              ? "animate"
              : value === "yin"
                ? "selected"
                : "hidden"
          }
          whileHover={value === null ? "hover" : undefined}
          transition={{ delay: 0.2, duration: 0.5 }}
          onClick={() => handleSelect("yin")}
          onMouseEnter={() => setHoveredCard("yin")}
          onMouseLeave={() => setHoveredCard(null)}
          style={{ pointerEvents: value === "yang" ? "none" : "auto" }}
        >
          {/* Ripple effect on selection */}
          {value === "yin" && (
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-purple-400/30"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{
              boxShadow:
                value === "yin" || hoveredCard === "yin"
                  ? "0 0 40px rgba(168, 85, 247, 0.3), inset 0 0 30px rgba(168, 85, 247, 0.1)"
                  : "0 0 0px transparent",
            }}
            transition={{ duration: 0.4 }}
          />

          {/* Yin symbol */}
          <div className="relative mb-6 flex justify-center">
            <svg
              width="80"
              height="80"
              viewBox="0 0 100 100"
              className={`transition-all duration-300 ${
                value === "yin" ? "drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" : ""
              }`}
            >
              <defs>
                <linearGradient id="yinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              {/* Moon crescent */}
              <circle cx="50" cy="50" r="40" fill="url(#yinGradient)" opacity="0.2" />
              <path
                d="M50 10 A40 40 0 1 1 50 90 A25 25 0 1 0 50 10"
                fill="url(#yinGradient)"
              />
              {/* Stars around moon */}
              <circle cx="25" cy="25" r="2" fill="#a855f7" opacity="0.8" />
              <circle cx="75" cy="30" r="1.5" fill="#a855f7" opacity="0.6" />
              <circle cx="70" cy="70" r="1" fill="#a855f7" opacity="0.7" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-foreground mb-2">Yin</h3>
          <p className="text-lg font-semibold text-purple-300 mb-4">음 (陰)</p>
          <p className="text-sm font-medium text-foreground/80">Female Energy</p>
          <p className="text-xs font-medium text-foreground/60 mt-2">
            Moon · Receptive · Intuitive
          </p>

          {/* Selected indicator */}
          {value === "yin" && (
            <motion.div
              className="absolute top-4 right-4 w-6 h-6 rounded-full bg-purple-400 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </motion.div>
          )}
        </motion.button>

        {/* Yang Card - Male */}
        <motion.button
          className={`relative flex-1 p-8 rounded-2xl border-2 transition-colors duration-300
                      ${
                        value === "yang"
                          ? "border-gold/60 bg-gold/10"
                          : "border-foreground/10 bg-foreground/5 hover:border-gold/30"
                      }`}
          variants={cardVariants}
          initial="initial"
          animate={
            value === null
              ? "animate"
              : value === "yang"
                ? "selected"
                : "hidden"
          }
          whileHover={value === null ? "hover" : undefined}
          transition={{ delay: 0.3, duration: 0.5 }}
          onClick={() => handleSelect("yang")}
          onMouseEnter={() => setHoveredCard("yang")}
          onMouseLeave={() => setHoveredCard(null)}
          style={{ pointerEvents: value === "yin" ? "none" : "auto" }}
        >
          {/* Ripple effect on selection */}
          {value === "yang" && (
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-gold/30"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{
              boxShadow:
                value === "yang" || hoveredCard === "yang"
                  ? "0 0 40px rgba(212, 175, 55, 0.3), inset 0 0 30px rgba(212, 175, 55, 0.1)"
                  : "0 0 0px transparent",
            }}
            transition={{ duration: 0.4 }}
          />

          {/* Yang symbol */}
          <div className="relative mb-6 flex justify-center">
            <svg
              width="80"
              height="80"
              viewBox="0 0 100 100"
              className={`transition-all duration-300 ${
                value === "yang" ? "drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]" : ""
              }`}
            >
              <defs>
                <linearGradient id="yangGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fcd34d" />
                  <stop offset="100%" stopColor="#d4af37" />
                </linearGradient>
              </defs>
              {/* Sun with rays */}
              <circle cx="50" cy="50" r="25" fill="url(#yangGradient)" />
              {/* Sun rays */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * 45 * Math.PI) / 180;
                const x1 = 50 + Math.cos(angle) * 30;
                const y1 = 50 + Math.sin(angle) * 30;
                const x2 = 50 + Math.cos(angle) * 42;
                const y2 = 50 + Math.sin(angle) * 42;
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="url(#yangGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-foreground mb-2">Yang</h3>
          <p className="text-lg font-semibold text-gold mb-4">양 (陽)</p>
          <p className="text-sm font-medium text-foreground/80">Male Energy</p>
          <p className="text-xs font-medium text-foreground/60 mt-2">
            Sun · Active · Analytical
          </p>

          {/* Selected indicator */}
          {value === "yang" && (
            <motion.div
              className="absolute top-4 right-4 w-6 h-6 rounded-full bg-gold flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0a0a15"
                strokeWidth="3"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* Complete Ritual button */}
      <motion.button
        onClick={onNext}
        disabled={!value}
        className={`px-10 py-4 rounded-full font-medium text-lg
                   transition-all duration-300 ${
                     value
                       ? "bg-gradient-to-r from-purple-500/80 via-gold/80 to-purple-500/80 text-background"
                       : "bg-foreground/10 text-foreground/30 cursor-not-allowed"
                   }`}
        style={{
          boxShadow: value
            ? "0 0 30px rgba(212, 175, 55, 0.3), 0 0 30px rgba(168, 85, 247, 0.3)"
            : "none",
        }}
        whileHover={value ? { scale: 1.05 } : {}}
        whileTap={value ? { scale: 0.95 } : {}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {value ? "Complete the Ritual" : "Select your energy"}
      </motion.button>
    </div>
  );
}
