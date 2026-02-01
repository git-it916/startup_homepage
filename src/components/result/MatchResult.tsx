"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BirthData } from "../ritual/InputWizard";
import {
  Character,
  matchCharacter,
  getRandomItem,
  sajuMessages,
  dailyFortuneMessages,
  compatibilityMessages,
  luckyItems,
  luckyColors,
  generateLuckyNumber,
} from "@/data/characters";

interface MatchResultProps {
  birthData: BirthData;
  onRestart: () => void;
}

interface FortuneResult {
  character: Character;
  sajuMessage: string;
  dailyFortune: string;
  compatibility: string;
  luckyItem: string;
  luckyColor: string;
  luckyNumber: number;
}

export default function MatchResult({ birthData, onRestart }: MatchResultProps) {
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [isRevealing, setIsRevealing] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    // Generate random result
    const fortune: FortuneResult = {
      character: matchCharacter(),
      sajuMessage: getRandomItem(sajuMessages),
      dailyFortune: getRandomItem(dailyFortuneMessages),
      compatibility: getRandomItem(compatibilityMessages),
      luckyItem: getRandomItem(luckyItems),
      luckyColor: getRandomItem(luckyColors),
      luckyNumber: generateLuckyNumber(),
    };
    setResult(fortune);

    // Reveal animation delay
    const timer = setTimeout(() => {
      setIsRevealing(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const generateShareText = () => {
    if (!result) return "";
    return `🔮 K-Destiny 운명 매칭 결과

나의 운명의 캐릭터: ${result.character.name} (${result.character.koreanName})
${result.character.emoji} ${result.character.element}

💫 ${result.compatibility}

🍀 럭키 아이템: ${result.luckyItem}
🎨 럭키 컬러: ${result.luckyColor}
🔢 럭키 넘버: ${result.luckyNumber}

나도 해보기 👉 ${typeof window !== "undefined" ? window.location.origin : ""}`;
  };

  const handleShare = async (platform: "kakao" | "instagram" | "copy" | "native") => {
    const shareText = generateShareText();
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    switch (platform) {
      case "native":
        // Web Share API (mobile browsers)
        if (navigator.share) {
          try {
            await navigator.share({
              title: "K-Destiny 운명 매칭 결과",
              text: shareText,
              url: shareUrl,
            });
          } catch (err) {
            console.log("Share cancelled");
          }
        }
        break;

      case "kakao":
        // KakaoTalk share via Kakao SDK
        if (typeof window !== "undefined" && (window as typeof window & { Kakao?: { isInitialized: () => boolean; Share: { sendDefault: (options: Record<string, unknown>) => void } } }).Kakao?.isInitialized()) {
          (window as typeof window & { Kakao: { Share: { sendDefault: (options: Record<string, unknown>) => void } } }).Kakao.Share.sendDefault({
            objectType: "feed",
            content: {
              title: "K-Destiny 운명 매칭 결과",
              description: `나의 운명의 캐릭터: ${result?.character.name} (${result?.character.koreanName})`,
              imageUrl: `${window.location.origin}/og-image.png`,
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
              },
            },
            buttons: [
              {
                title: "나도 해보기",
                link: {
                  mobileWebUrl: shareUrl,
                  webUrl: shareUrl,
                },
              },
            ],
          });
        } else {
          // Fallback: Copy to clipboard and open KakaoTalk
          await navigator.clipboard.writeText(shareText);
          alert("텍스트가 복사되었습니다. 카카오톡에서 붙여넣기 해주세요!");
          window.open("kakaotalk://", "_blank");
        }
        break;

      case "instagram":
        // Instagram doesn't support direct sharing, copy text and open Instagram
        await navigator.clipboard.writeText(shareText);
        alert("텍스트가 복사되었습니다. 인스타그램 스토리에 붙여넣기 해주세요!");
        // Try to open Instagram app
        window.open("instagram://story-camera", "_blank");
        break;

      case "copy":
        try {
          await navigator.clipboard.writeText(shareText);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
          console.error("Failed to copy:", err);
        }
        break;
    }
  };

  if (!result) return null;

  // Revealing animation
  if (isRevealing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Mystical orb animation */}
          <motion.div
            className="w-32 h-32 mx-auto mb-8 rounded-full relative"
            style={{
              background: `radial-gradient(circle, ${result.character.color}40 0%, transparent 70%)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="absolute inset-4 rounded-full"
              style={{
                background: `radial-gradient(circle, ${result.character.color}60 0%, transparent 60%)`,
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.span
              className="absolute inset-0 flex items-center justify-center text-5xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {result.character.emoji}
            </motion.span>
          </motion.div>

          <motion.p
            className="text-xl font-medium text-gold mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            운명의 연결고리를 찾는 중...
          </motion.p>
          <motion.p
            className="text-foreground/60 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            당신의 사주를 분석하고 있습니다
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-start px-4 py-8 overflow-y-auto">
        <motion.div
          className="w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
              Your Destiny Match
            </h2>
            <p className="text-lg font-semibold text-gold">운명의 매칭 결과</p>
          </motion.div>

          {/* Character Card */}
          <motion.div
            className="relative p-6 rounded-2xl border-2 mb-6"
            style={{
              borderColor: `${result.character.color}60`,
              background: `linear-gradient(135deg, ${result.character.color}10 0%, transparent 50%)`,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              animate={{
                boxShadow: [
                  `0 0 20px ${result.character.color}30`,
                  `0 0 40px ${result.character.color}50`,
                  `0 0 20px ${result.character.color}30`,
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <div className="text-center relative z-10">
              {/* Character image or emoji */}
              <motion.div
                className="w-56 h-64 mx-auto mb-4 relative"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {!imageError ? (
                  <Image
                    src={result.character.image}
                    alt={result.character.name}
                    fill
                    className="object-contain drop-shadow-2xl"
                    style={{ objectPosition: "center bottom" }}
                    onError={() => setImageError(true)}
                    priority
                  />
                ) : (
                  <span className="text-7xl flex items-center justify-center h-full">
                    {result.character.emoji}
                  </span>
                )}
              </motion.div>

              {/* Character name */}
              <h3 className="text-3xl font-bold text-foreground mb-1">
                {result.character.name}
              </h3>
              <p className="text-xl font-semibold mb-2" style={{ color: result.character.color }}>
                {result.character.koreanName}
              </p>
              <p className="text-sm font-medium text-foreground/60 mb-4">
                {result.character.role}
              </p>

              {/* Element badge */}
              <div
                className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4"
                style={{
                  background: `${result.character.color}20`,
                  color: result.character.color,
                }}
              >
                {result.character.element}
              </div>

              {/* Description */}
              <p className="text-foreground/80 text-sm leading-relaxed">
                {result.character.description}
              </p>
            </div>
          </motion.div>

          {/* Compatibility message */}
          <motion.div
            className="p-4 rounded-xl bg-gold/10 border border-gold/30 mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-gold/80 text-xs uppercase tracking-wider mb-2 font-semibold">
              💫 궁합
            </p>
            <p className="text-foreground/80 text-sm leading-relaxed">
              {result.compatibility}
            </p>
          </motion.div>

          {/* Saju interpretation */}
          <motion.div
            className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 mb-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-purple-400/80 text-xs uppercase tracking-wider mb-2 font-semibold">
              🔮 사주 해석
            </p>
            <p className="text-foreground/80 text-sm leading-relaxed">
              {result.sajuMessage}
            </p>
          </motion.div>

          {/* Daily fortune */}
          <motion.div
            className="p-4 rounded-xl bg-foreground/5 border border-foreground/10 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-foreground/60 text-xs uppercase tracking-wider mb-2 font-semibold">
              ☀️ 오늘의 운세
            </p>
            <p className="text-foreground/80 text-sm leading-relaxed">
              {result.dailyFortune}
            </p>
          </motion.div>

          {/* Lucky items section */}
          <motion.div
            className="grid grid-cols-3 gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="p-3 rounded-xl bg-foreground/5 border border-foreground/10 text-center">
              <p className="text-foreground/50 text-xs mb-1">럭키 아이템</p>
              <p className="text-foreground/90 text-sm font-semibold">{result.luckyItem}</p>
            </div>
            <div className="p-3 rounded-xl bg-foreground/5 border border-foreground/10 text-center">
              <p className="text-foreground/50 text-xs mb-1">럭키 컬러</p>
              <p className="text-foreground/90 text-sm font-semibold">{result.luckyColor}</p>
            </div>
            <div className="p-3 rounded-xl bg-foreground/5 border border-foreground/10 text-center">
              <p className="text-foreground/50 text-xs mb-1">럭키 넘버</p>
              <p className="text-foreground/90 text-sm font-semibold">{result.luckyNumber}</p>
            </div>
          </motion.div>

          {/* User info summary */}
          <motion.div
            className="p-4 rounded-xl bg-foreground/5 border border-foreground/10 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-foreground/50 text-xs uppercase tracking-wider mb-3 font-semibold">
              📋 입력 정보
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground/50">이름</span>
                <span className="text-foreground/80 font-medium">{birthData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/50">생년월일</span>
                <span className="text-foreground/80 font-medium">
                  {birthData.year}.{birthData.month.toString().padStart(2, "0")}.{birthData.day.toString().padStart(2, "0")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/50">태어난 시간</span>
                <span className="text-foreground/80 font-medium">
                  {birthData.hour.toString().padStart(2, "0")}:{birthData.minute.toString().padStart(2, "0")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/50">음양</span>
                <span className={birthData.gender === "yin" ? "text-purple-400 font-medium" : "text-gold font-medium"}>
                  {birthData.gender === "yin" ? "음 (陰)" : "양 (陽)"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 pb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.button
              onClick={onRestart}
              className="flex-1 px-6 py-3 rounded-full border border-foreground/20 text-foreground/60 font-medium
                       hover:border-gold/50 hover:text-gold transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              다시 하기
            </motion.button>
            <motion.button
              onClick={() => setShowShareModal(true)}
              className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/80 via-gold/80 to-purple-500/80
                       text-background font-semibold"
              style={{
                boxShadow: "0 0 20px rgba(212, 175, 55, 0.3), 0 0 20px rgba(168, 85, 247, 0.3)",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              결과 공유하기
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowShareModal(false)}
            />

            {/* Modal content */}
            <motion.div
              className="relative bg-background/95 border border-foreground/20 rounded-2xl p-6 w-full max-w-sm"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="text-xl font-bold text-foreground mb-2 text-center">
                결과 공유하기
              </h3>
              <p className="text-foreground/60 text-sm mb-6 text-center">
                친구들과 운명의 매칭 결과를 공유해보세요
              </p>

              <div className="space-y-3">
                {/* Native share (mobile) */}
                {typeof navigator !== "undefined" && "share" in navigator && (
                  <motion.button
                    onClick={() => handleShare("native")}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl
                             bg-foreground/10 hover:bg-foreground/20 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-xl">📤</span>
                    <span className="font-medium text-foreground">공유하기</span>
                  </motion.button>
                )}

                {/* KakaoTalk */}
                <motion.button
                  onClick={() => handleShare("kakao")}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl
                           bg-[#FEE500] hover:bg-[#FDD835] transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#3C1E1E">
                    <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.47 1.607 4.647 4.035 5.906l-.857 3.2a.5.5 0 00.77.527l3.787-2.514c.734.106 1.49.162 2.265.162 5.523 0 10-3.477 10-7.781C22 6.477 17.523 3 12 3z"/>
                  </svg>
                  <span className="font-medium text-[#3C1E1E]">카카오톡</span>
                </motion.button>

                {/* Instagram */}
                <motion.button
                  onClick={() => handleShare("instagram")}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl
                           bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90 transition-opacity"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  <span className="font-medium text-white">인스타그램</span>
                </motion.button>

                {/* Copy link */}
                <motion.button
                  onClick={() => handleShare("copy")}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl
                           bg-foreground/10 hover:bg-foreground/20 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-xl">{copySuccess ? "✅" : "📋"}</span>
                  <span className="font-medium text-foreground">
                    {copySuccess ? "복사 완료!" : "텍스트 복사"}
                  </span>
                </motion.button>
              </div>

              {/* Close button */}
              <motion.button
                onClick={() => setShowShareModal(false)}
                className="w-full mt-4 px-4 py-2 text-foreground/60 hover:text-foreground transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                닫기
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
