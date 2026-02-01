"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";

interface TimeWheelPickerProps {
  hour: number;
  minute: number;
  onChange: (hour: number, minute: number) => void;
  onNext: () => void;
}

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = [0, 15, 30, 45]; // 15분 단위

interface WheelColumnProps {
  items: number[];
  value: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  label: string;
}

function WheelColumn({
  items,
  value,
  onChange,
  formatValue = (v) => v.toString().padStart(2, "0"),
  label,
}: WheelColumnProps) {
  const y = useMotionValue(0);
  const smoothY = useSpring(y, { stiffness: 300, damping: 30 });
  const selectedIndex = items.indexOf(value);
  const isDragging = useRef(false);

  const getYPosition = useCallback(
    (index: number) => {
      return -(index * ITEM_HEIGHT) + ITEM_HEIGHT * 2;
    },
    []
  );

  const snapToNearest = useCallback(
    (currentY: number) => {
      const index = Math.round(-(currentY - ITEM_HEIGHT * 2) / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(items.length - 1, index));
      const targetY = getYPosition(clampedIndex);

      animate(y, targetY, {
        type: "spring",
        stiffness: 400,
        damping: 40,
      });

      if (items[clampedIndex] !== value) {
        onChange(items[clampedIndex]);
      }
    },
    [items, value, onChange, y, getYPosition]
  );

  useEffect(() => {
    if (!isDragging.current) {
      const idx = selectedIndex >= 0 ? selectedIndex : 0;
      y.set(getYPosition(idx));
    }
  }, [selectedIndex, y, getYPosition]);

  const handleDragEnd = () => {
    isDragging.current = false;
    snapToNearest(y.get());
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1 : -1;
    const currentIndex = items.indexOf(value);
    const newIndex = Math.max(0, Math.min(items.length - 1, currentIndex + delta));

    if (newIndex !== currentIndex) {
      onChange(items[newIndex]);
    }
  };

  // 클릭으로 해당 항목 선택
  const handleItemClick = (item: number) => {
    onChange(item);
  };

  return (
    <div className="flex flex-col items-center">
      <span className="text-xs font-semibold text-foreground/70 mb-2 uppercase tracking-wider">
        {label}
      </span>
      <div
        className="relative overflow-hidden wheel-picker"
        style={{ height: CONTAINER_HEIGHT, width: 80 }}
        onWheel={handleWheel}
      >
        <div
          className="absolute left-0 right-0 pointer-events-none z-10"
          style={{
            top: ITEM_HEIGHT * 2,
            height: ITEM_HEIGHT,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.1) 50%, transparent 100%)",
            borderTop: "1px solid rgba(212,175,55,0.3)",
            borderBottom: "1px solid rgba(212,175,55,0.3)",
          }}
        />

        <motion.div
          drag="y"
          dragConstraints={{
            top: getYPosition(items.length - 1),
            bottom: getYPosition(0),
          }}
          dragElastic={0.1}
          onDragStart={() => { isDragging.current = true; }}
          onDragEnd={handleDragEnd}
          style={{ y: smoothY }}
          className="cursor-grab active:cursor-grabbing"
        >
          {items.map((item, index) => {
            const isSelected = item === value;
            const distance = Math.abs(index - selectedIndex);
            const opacity = distance === 0 ? 1 : distance === 1 ? 0.5 : 0.2;
            const scale = distance === 0 ? 1 : distance === 1 ? 0.85 : 0.7;

            return (
              <div
                key={item}
                className="flex items-center justify-center select-none cursor-pointer hover:opacity-80"
                style={{
                  height: ITEM_HEIGHT,
                  opacity,
                  transform: `scale(${scale})`,
                  transition: "opacity 0.2s, transform 0.2s",
                }}
                onClick={() => handleItemClick(item)}
              >
                <span
                  className={`text-2xl font-semibold transition-colors duration-200 ${
                    isSelected ? "text-gold text-glow" : "text-foreground/60"
                  }`}
                >
                  {formatValue(item)}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

function getKoreanTimePeriod(hour: number): { name: string; hanja: string } {
  const periods = [
    { name: "子時 (자시)", hanja: "쥐" },
    { name: "丑時 (축시)", hanja: "소" },
    { name: "寅時 (인시)", hanja: "호랑이" },
    { name: "卯時 (묘시)", hanja: "토끼" },
    { name: "辰時 (진시)", hanja: "용" },
    { name: "巳時 (사시)", hanja: "뱀" },
    { name: "午時 (오시)", hanja: "말" },
    { name: "未時 (미시)", hanja: "양" },
    { name: "申時 (신시)", hanja: "원숭이" },
    { name: "酉時 (유시)", hanja: "닭" },
    { name: "戌時 (술시)", hanja: "개" },
    { name: "亥時 (해시)", hanja: "돼지" },
  ];

  let periodIndex;
  if (hour === 23 || hour === 0) {
    periodIndex = 0;
  } else {
    periodIndex = Math.floor((hour + 1) / 2);
  }

  return periods[periodIndex];
}

export default function TimeWheelPicker({
  hour,
  minute,
  onChange,
  onNext,
}: TimeWheelPickerProps) {
  const koreanPeriod = getKoreanTimePeriod(hour);

  // 분 값을 15분 단위로 조정
  const adjustedMinute = minutes.includes(minute) ? minute : 0;

  const handleHourChange = (newHour: number) => {
    onChange(newHour, adjustedMinute);
  };

  const handleMinuteChange = (newMinute: number) => {
    onChange(hour, newMinute);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Description */}
      <motion.p
        className="text-foreground/70 text-sm font-medium mb-6 text-center leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        태어난 시간은 오행의 균형에 영향을 줍니다
      </motion.p>

      <motion.button
        className="text-foreground/40 text-sm mb-6 hover:text-gold/60 transition-colors underline underline-offset-4"
        onClick={() => {
          onChange(12, 0);
          onNext();
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        I don&apos;t know my birth time
      </motion.button>

      <motion.div
        className="flex items-center justify-center gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <WheelColumn
          items={hours}
          value={hour}
          onChange={handleHourChange}
          formatValue={(v) => v.toString().padStart(2, "0")}
          label="Hour"
        />

        <div className="text-gold/50 text-3xl font-light mt-6">:</div>

        <WheelColumn
          items={minutes}
          value={adjustedMinute}
          onChange={handleMinuteChange}
          formatValue={(v) => v.toString().padStart(2, "0")}
          label="Minute"
        />
      </motion.div>

      <motion.div
        className="text-center mb-8 p-4 rounded-xl border border-gold/20 bg-gold/5"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-foreground/50 text-xs mb-2 uppercase tracking-wider">
          Traditional Korean Time
        </p>
        <p className="text-xl font-semibold text-gold text-glow mb-1">
          {koreanPeriod.name}
        </p>
        <p className="text-foreground/40 text-sm">
          Hour of the {koreanPeriod.hanja}
        </p>
      </motion.div>

      <motion.button
        onClick={onNext}
        className="px-8 py-3 rounded-full bg-gradient-to-r from-gold/80 to-gold
                   text-background font-medium hover:from-gold hover:to-gold/80
                   transition-all duration-300 glow-gold"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        Continue
      </motion.button>
    </div>
  );
}
