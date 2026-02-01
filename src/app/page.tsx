"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CosmicBackground from "@/components/ui/CosmicBackground";
import HeroSection from "@/components/ui/HeroSection";
import InputWizard, { BirthData } from "@/components/ritual/InputWizard";

type AppState = "landing" | "ritual" | "result";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [birthData, setBirthData] = useState<BirthData | null>(null);

  const handleBeginRitual = () => {
    setAppState("ritual");
  };

  const handleBackToLanding = () => {
    setAppState("landing");
  };

  const handleRitualComplete = async (data: BirthData) => {
    setBirthData(data);
    setAppState("result");

    // Save to database
    try {
      await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Failed to save response:", error);
    }
  };

  const pageTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Cosmic Background - Always present */}
      <CosmicBackground />

      {/* Main content with page transitions */}
      <AnimatePresence mode="wait">
        {appState === "landing" && (
          <motion.div key="landing" {...pageTransition}>
            <HeroSection onBeginRitual={handleBeginRitual} />
          </motion.div>
        )}

        {appState === "ritual" && (
          <motion.div key="ritual" {...pageTransition}>
            <InputWizard
              onComplete={handleRitualComplete}
              onBack={handleBackToLanding}
            />
          </motion.div>
        )}

        {appState === "result" && birthData && (
          <motion.div
            key="result"
            {...pageTransition}
            className="relative min-h-screen flex flex-col items-center justify-center px-6 z-10"
          >
            {/* Completion Screen - Placeholder for future results page */}
            <motion.div
              className="text-center max-w-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {/* Success icon */}
              <motion.div
                className="w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%)",
                  border: "2px solid rgba(212, 175, 55, 0.3)",
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                <motion.svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="url(#successGradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <defs>
                    <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#d4af37" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  <path d="M20 6L9 17l-5-5" stroke="#d4af37" />
                </motion.svg>
              </motion.div>

              <motion.h2
                className="text-3xl sm:text-4xl font-light text-foreground/90 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                The Ritual is Complete
              </motion.h2>

              <motion.p
                className="text-xl text-gold/70 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                의식이 완료되었습니다
              </motion.p>

              {/* Summary */}
              <motion.div
                className="p-6 rounded-2xl border border-foreground/10 bg-foreground/5 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-foreground/60 text-sm mb-4">Your destiny profile</p>
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-foreground/40">Name</span>
                    <span className="text-foreground/80">{birthData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/40">Birth Date</span>
                    <span className="text-foreground/80">
                      {birthData.year}.{birthData.month.toString().padStart(2, "0")}.
                      {birthData.day.toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/40">Birth Time</span>
                    <span className="text-foreground/80">
                      {birthData.hour.toString().padStart(2, "0")}:
                      {birthData.minute.toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/40">Energy Type</span>
                    <span
                      className={
                        birthData.gender === "yin" ? "text-purple-400" : "text-gold"
                      }
                    >
                      {birthData.gender === "yin" ? "Yin (음)" : "Yang (양)"}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* K-Entity Preview - Teaser */}
              <motion.div
                className="p-6 rounded-2xl border border-gold/20 bg-gold/5 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <p className="text-gold/60 text-xs uppercase tracking-wider mb-3">
                  Coming Soon
                </p>
                <p className="text-lg text-foreground/80 mb-2">
                  K-Entity Matching
                </p>
                <p className="text-sm text-foreground/50">
                  Discover which K-Pop idol or K-Drama character shares your destiny structure
                </p>
              </motion.div>

              {/* Actions */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <motion.button
                  onClick={handleBackToLanding}
                  className="px-6 py-3 rounded-full border border-foreground/20 text-foreground/60
                           hover:border-gold/50 hover:text-gold transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Over
                </motion.button>
                <motion.button
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-gold/80 to-gold
                           text-background font-medium glow-gold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Full Report
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
