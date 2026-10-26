import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  steps: string[];
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ steps }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(600); // 10 minutes = 600s
  const [isActive, setIsActive] = useState<boolean>(true);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const minutes = Math.floor(secondsLeft / 60);
  const remainingSeconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

  const resetTimer = () => {
    setSecondsLeft(600);
    setIsActive(true);
  };

  return (
    <div className="w-full space-y-4">
      {/* 10:00 Timer Header */}
      <div className="bg-[#FFE600] border-3 border-[#1A1033] p-3 shadow-[3px_3px_0px_#1A1033] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">⏱️</span>
          <div>
            <div className="font-pixel text-[11px] text-[#1A1033]">
              ACTION WINDOW: GOLDEN 10 MINUTES
            </div>
            <div className="font-vt text-sm text-[#1A1033]">
              Execute these emergency steps immediately to protect funds and accounts.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="font-pixel text-lg text-[#FF3EA5] bg-[#1A1033] px-3 py-1 border-2 border-[#1A1033]">
            {timeFormatted}
          </div>

          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className="pixel-btn bg-[#FFF8E7] px-2.5 py-1 text-[10px] font-pixel text-[#1A1033]"
          >
            {isActive ? 'PAUSE' : 'RESUME'}
          </button>

          <button
            type="button"
            onClick={resetTimer}
            className="pixel-btn bg-[#FFF8E7] px-2.5 py-1 text-[10px] font-pixel text-[#1A1033]"
          >
            RESET
          </button>
        </div>
      </div>

      {/* Checkable Action Items */}
      <div className="space-y-2">
        {steps.map((step, idx) => {
          const isDone = !!completedSteps[idx];
          return (
            <div
              key={idx}
              onClick={() => toggleStep(idx)}
              className={`p-2.5 border-2 border-[#1A1033] shadow-[2px_2px_0px_#1A1033] flex items-start gap-3 cursor-pointer transition-all ${
                isDone ? 'bg-[#B6FF00]/40 line-through text-[#1A1033]/70' : 'bg-[#FFF8E7] text-[#1A1033]'
              }`}
            >
              <input
                type="checkbox"
                checked={isDone}
                onChange={() => {}} // handled by parent div click
                className="mt-1 w-4 h-4 accent-[#1A1033] cursor-pointer shrink-0"
              />
              <div className="font-mono-body text-sm font-semibold leading-snug">
                <span className="font-pixel text-[10px] text-[#7B2FFF] mr-1.5 not-sr-only">
                  STEP {idx + 1}:
                </span>
                {step}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
