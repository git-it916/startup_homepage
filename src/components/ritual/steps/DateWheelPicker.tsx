"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";

interface DateWheelPickerProps {
  year: number;
  month: number;
  day: number;
  onChange: (year: number, month: number, day: number) => void;
  onNext: () => void;
}

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

// Generate year, month, day arrays
const years = Array.from({ length: 100 }, (_, i) => 1950 + i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

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
      y.set(getYPosition(selectedIndex >= 0 ? selectedIndex : 0));
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
        {/* Selection highlight */}
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

export default function DateWheelPicker({
  year,
  month,
  day,
  onChange,
  onNext,
}: DateWheelPickerProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    if (day > daysInMonth) {
      onChange(year, month, daysInMonth);
    }
  }, [year, month, day, daysInMonth, onChange]);

  const handleYearChange = (newYear: number) => {
    onChange(newYear, month, day);
  };

  const handleMonthChange = (newMonth: number) => {
    onChange(year, newMonth, day);
  };

  const handleDayChange = (newDay: number) => {
    onChange(year, month, newDay);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Description */}
      <motion.p
        className="text-foreground/70 text-sm font-medium mb-8 text-center leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        생년월일은 사주팔자의 기초가 됩니다
      </motion.p>

      <motion.div
        className="flex items-center justify-center gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <WheelColumn
          items={years}
          value={year}
          onChange={handleYearChange}
          formatValue={(v) => v.toString()}
          label="Year"
        />

        <div className="text-gold/30 text-3xl font-light mt-6">.</div>

        <WheelColumn
          items={months}
          value={month}
          onChange={handleMonthChange}
          formatValue={(v) => v.toString().padStart(2, "0")}
          label="Month"
        />

        <div className="text-gold/30 text-3xl font-light mt-6">.</div>

        <WheelColumn
          items={days}
          value={Math.min(day, daysInMonth)}
          onChange={handleDayChange}
          formatValue={(v) => v.toString().padStart(2, "0")}
          label="Day"
        />
      </motion.div>

      <motion.div
        className="text-center mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-foreground/40 text-sm mb-2">Selected birth date</p>
        <p className="text-2xl font-semibold text-gold text-glow">
          {year}년 {month}월 {Math.min(day, daysInMonth)}일
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
