"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NameInput from "./steps/NameInput";
import DateWheelPicker from "./steps/DateWheelPicker";
import TimeWheelPicker from "./steps/TimeWheelPicker";
import GenderSelection from "./steps/GenderSelection";

export interface BirthData {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: "yin" | "yang" | null;
}

interface InputWizardProps {
  onComplete: (data: BirthData) => void;
  onBack: () => void;
}

const TOTAL_STEPS = 4;

export default function InputWizard({ onComplete, onBack }: InputWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [birthData, setBirthData] = useState<BirthData>({
    name: "",
    year: 2000,
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
    gender: null,
  });

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete(birthData);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  const updateBirthData = (data: Partial<BirthData>) => {
    setBirthData((prev) => ({ ...prev, ...data }));
  };

  // Handle Enter key to advance to next step
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        // Check if we can proceed (name is required for step 0, gender for step 3)
        if (currentStep === 0 && birthData.name.trim() === "") return;
        if (currentStep === 3 && birthData.gender === null) return;

        if (currentStep < TOTAL_STEPS - 1) {
          setDirection(1);
          setCurrentStep((prev) => prev + 1);
        } else {
          onComplete(birthData);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, birthData, onComplete]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const stepTitles = [
    { en: "Your Name", ko: "이름" },
    { en: "Birth Date", ko: "생년월일" },
    { en: "Birth Time", ko: "태어난 시간" },
    { en: "Energy Type", ko: "음양" },
  ];

  return (
    <motion.div
      className="min-h-screen flex flex-col z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Fixed Header - Progress indicator + Title */}
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-md pt-6 pb-4">
        {/* Progress indicator - Constellation dots */}
        <div className="flex justify-center items-center gap-3 mb-6">
        {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
          <div key={index} className="flex items-center">
            <motion.div
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                index <= currentStep
                  ? "bg-gold glow-gold"
                  : "bg-foreground/20 border border-foreground/30"
              }`}
              animate={{
                scale: index === currentStep ? [1, 1.3, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: index === currentStep ? Infinity : 0,
                ease: "easeInOut",
              }}
            />
            {index < TOTAL_STEPS - 1 && (
              <motion.div
                className="w-8 h-px mx-1"
                style={{
                  background:
                    index < currentStep
                      ? "linear-gradient(90deg, #d4af37 0%, #d4af37 100%)"
                      : "linear-gradient(90deg, rgba(232,232,240,0.2) 0%, rgba(232,232,240,0.2) 100%)",
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            )}
          </div>
        ))}
      </div>

        {/* Step title */}
        <motion.div
          className="text-center px-4"
          key={currentStep}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
            {stepTitles[currentStep].en}
          </h2>
          <p className="text-lg font-semibold text-gold">{stepTitles[currentStep].ko}</p>
        </motion.div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-20 pt-2">
        <div className="w-full max-w-lg relative" style={{ minHeight: "300px" }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
              }}
              className="w-full flex items-start justify-center pt-4"
            >
              {currentStep === 0 && (
                <NameInput
                  value={birthData.name}
                  onChange={(name) => updateBirthData({ name })}
                  onNext={nextStep}
                />
              )}
              {currentStep === 1 && (
                <DateWheelPicker
                  year={birthData.year}
                  month={birthData.month}
                  day={birthData.day}
                  onChange={(year, month, day) =>
                    updateBirthData({ year, month, day })
                  }
                  onNext={nextStep}
                />
              )}
              {currentStep === 2 && (
                <TimeWheelPicker
                  hour={birthData.hour}
                  minute={birthData.minute}
                  onChange={(hour, minute) => updateBirthData({ hour, minute })}
                  onNext={nextStep}
                />
              )}
              {currentStep === 3 && (
                <GenderSelection
                  value={birthData.gender}
                  onChange={(gender) => updateBirthData({ gender })}
                  onNext={nextStep}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-6 left-0 right-0 flex items-center justify-between px-6 max-w-lg mx-auto">
        <motion.button
          onClick={prevStep}
          className="px-6 py-2 rounded-full text-white font-medium
                     hover:text-gold transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {currentStep === 0 ? "Back" : "Previous"}
        </motion.button>

        <span className="text-white text-sm font-medium">
          {currentStep + 1} / {TOTAL_STEPS}
        </span>
      </div>
    </motion.div>
  );
}
