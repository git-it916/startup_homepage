"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

interface InkBlob {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  delay: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  duration: number;
  xOffset: number;
}

export default function CosmicBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);
  const [inkBlobs, setInkBlobs] = useState<InkBlob[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate random elements only on client side to avoid hydration mismatch
  useEffect(() => {
    setStars(
      Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
      }))
    );

    setInkBlobs(
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60,
        scale: 0.8 + Math.random() * 0.5,
        rotation: Math.random() * 360,
        delay: i * 2,
      }))
    );

    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 10 + Math.random() * 10,
        xOffset: Math.random() * 50 - 25,
      }))
    );

    setMounted(true);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, #0f0f23 0%, #050510 70%, #020208 100%)",
      }}
    >
      {/* Deep space gradient layers */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 70% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 40%)",
        }}
      />

      {/* Ink blobs - Korean calligraphy ink diffusion effect */}
      {mounted && inkBlobs.map((blob) => (
        <motion.div
          key={blob.id}
          className="absolute"
          style={{
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [blob.scale, blob.scale * 1.3, blob.scale],
            rotate: [blob.rotation, blob.rotation + 180, blob.rotation + 360],
          }}
          transition={{
            duration: 20 + blob.id * 5,
            delay: blob.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            width="400"
            height="400"
            viewBox="0 0 400 400"
            className="opacity-30"
          >
            <defs>
              <filter id={`blur-${blob.id}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="30" />
              </filter>
              <radialGradient id={`ink-gradient-${blob.id}`}>
                <stop offset="0%" stopColor="#1a1a2e" stopOpacity="1" />
                <stop offset="50%" stopColor="#0f0f1a" stopOpacity="0.8" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>
            <ellipse
              cx="200"
              cy="200"
              rx="180"
              ry="150"
              fill={`url(#ink-gradient-${blob.id})`}
              filter={`url(#blur-${blob.id})`}
            />
          </svg>
        </motion.div>
      ))}

      {/* Constellation lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
            <stop offset="50%" stopColor="#d4af37" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.line
          x1="10%"
          y1="20%"
          x2="25%"
          y2="35%"
          stroke="url(#lineGradient)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, delay: 1, repeat: Infinity, repeatDelay: 5 }}
        />
        <motion.line
          x1="25%"
          y1="35%"
          x2="40%"
          y2="25%"
          stroke="url(#lineGradient)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, delay: 2, repeat: Infinity, repeatDelay: 5 }}
        />
        <motion.line
          x1="70%"
          y1="60%"
          x2="85%"
          y2="70%"
          stroke="url(#lineGradient)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, delay: 3, repeat: Infinity, repeatDelay: 5 }}
        />
        <motion.line
          x1="60%"
          y1="80%"
          x2="70%"
          y2="60%"
          stroke="url(#lineGradient)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, delay: 4, repeat: Infinity, repeatDelay: 5 }}
        />
      </svg>

      {/* Twinkling stars */}
      {mounted && stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            background:
              star.id % 3 === 0
                ? "radial-gradient(circle, #d4af37 0%, transparent 70%)"
                : "radial-gradient(circle, #e8e8f0 0%, transparent 70%)",
          }}
          initial={{ opacity: 0.3, scale: 1 }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating particles */}
      {mounted && particles.map((particle) => (
        <motion.div
          key={`particle-${particle.id}`}
          className="absolute w-1 h-1 rounded-full bg-gold/30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, particle.xOffset, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.id * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(5, 5, 16, 0.4) 70%, rgba(5, 5, 16, 0.8) 100%)",
        }}
      />
    </div>
  );
}
