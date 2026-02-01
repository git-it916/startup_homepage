"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CosmicBackground from "@/components/ui/CosmicBackground";
import HeroSection from "@/components/ui/HeroSection";
import InputWizard, { BirthData } from "@/components/ritual/InputWizard";
import MatchResult from "@/components/result/MatchResult";

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
            className="relative z-10"
          >
            <MatchResult birthData={birthData} onRestart={handleBackToLanding} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
