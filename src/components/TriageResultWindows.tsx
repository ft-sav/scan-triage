import React, { useState, useEffect } from 'react';
import { RedFlag, ScamType } from '../utils/triageEngine';
import resourcesData from '../data/resources.json';

// Window 1: RED FLAGS LIST WITH EXACT QUOTED EVIDENCE
interface RedFlagsWindowProps {
  flags: RedFlag[];
}

export const RedFlagsWindow: React.FC<RedFlagsWindowProps> = ({ flags }) => {
  if (!flags || flags.length === 0) {
    return (
      <div className="pixel-box p-4 text-center">
        <div className="font-pixel text-xs text-[#1A1033] mb-1">NO RED FLAGS IDENTIFIED</div>
        <div className="font-vt text-sm text-[#1A1033]/80">
          No suspicious urgency, threats, or fake authority credentials detected in this message.
        </div>
      </div>
    );
  }

  return (
    <div className="pixel-box-lg bg-[#FFF8E7] overflow-hidden">
      <div className="window-titlebar bg-[#FF3EA5] text-[#FFF8E7]">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-xs">FLAGS.TXT</span>
          <span className="font-vt text-sm text-[#FFF8E7]/90">
            [{flags.length} DETECTED THREAT INDICATORS]
          </span>
        </div>
        <div className="flex gap-1">
          <span className="window-btn">_</span>
          <span className="window-btn">口</span>
          <span className="window-btn">X</span>
        </div>
      </div>

      <div className="p-4 space-y-3.5">
        {flags.map((flag, idx) => (
          <div
            key={idx}
            className="p-3 border-2 border-[#1A1033] dark:border-[#00E5FF] bg-white dark:bg-[#231742] shadow-[2px_2px_0px_#1A1033] dark:shadow-[2px_2px_0px_#00E5FF] space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[10px] text-[#7B2FFF] dark:text-[#00E5FF] uppercase font-bold">
                FLAG #{idx + 1}: {flag.label}
              </span>
              <span className="bg-[#FF3EA5] text-[#FFF8E7] text-[8px] font-pixel px-1.5 py-0.5 border border-[#1A1033]">
                VERIFIED QUOTE
              </span>
            </div>

            {/* Quoted Evidence from user's own message */}
            <div className="bg-[#00E5FF]/20 dark:bg-[#00E5FF]/10 border-l-4 border-[#00E5FF] p-2 text-xs font-mono-body text-[#1A1033] dark:text-[#FFF8E7]">
              <span className="font-pixel text-[9px] text-[#005B6E] dark:text-[#00E5FF] block mb-0.5 font-bold">
                EXACT QUOTE FROM YOUR TEXT:
              </span>
              <span className="font-semibold bg-[#FFE600] px-1 py-0.5 text-[#1A1033]">
                "{flag.evidence}"
              </span>
            </div>

            <div className="font-mono-body text-xs text-[#1A1033] dark:text-[#FFF8E7] leading-relaxed">
              <strong className="text-[#1A1033] dark:text-[#FFE600]">Why this is dangerous: </strong>
              {flag.why}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Window 2: IF YOU ALREADY PAID OR SHARED AN OTP
interface IfPaidWindowProps {
  steps: string[];
  isScamLikely: boolean;
  scamType: ScamType;
}

export const IfPaidWindow: React.FC<IfPaidWindowProps> = ({
  steps,
  isScamLikely,
  scamType,
}) => {
  // Automatically show expanded by default so emergency recovery protocols are immediately visible
  const [isOpen, setIsOpen] = useState(true);

  // Auto-expand whenever a new scan result is loaded
  useEffect(() => {
    setIsOpen(true);
  }, [steps, scamType]);
  const scamAdvice = (resourcesData.scam_specific as any)[scamType] || resourcesData.global_emergency;

  return (
    <div className="pixel-box-lg bg-[#FFF8E7] overflow-hidden">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="window-titlebar bg-[#FF3EA5] text-[#FFF8E7] cursor-pointer hover:brightness-105"
      >
        <div className="flex items-center gap-2">
          <span className="font-pixel text-xs">IF_ALREADY_PAID.EXE</span>
          <span className="font-vt text-sm bg-[#FFE600] text-[#1A1033] px-1.5 py-0.5 font-bold">
            {isOpen ? '[CLICK TO MINIMIZE]' : '[CLICK TO EXPAND EMERGENCY PROTOCOL]'}
          </span>
        </div>
        <div className="flex gap-1">
          <span className="window-btn">{isOpen ? '▲' : '▼'}</span>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 space-y-4">
          <div className="bg-[#FFE600]/25 dark:bg-[#34113F] border-2 border-[#1A1033] dark:border-[#FF3EA5] p-3.5 text-xs font-mono-body shadow-[3px_3px_0px_#1A1033] dark:shadow-[3px_3px_0px_#FF3EA5] space-y-2">
            <div className="font-pixel text-[11px] text-[#9A0048] dark:text-[#FFE600] uppercase flex items-center gap-2 font-bold tracking-wide">
              <span className="text-sm">⚠️</span>
              <span>GOLDEN HOUR RULE:</span>
            </div>
            <p className="text-[#1A1033] dark:text-[#FFF8E7] leading-relaxed text-xs sm:text-sm font-medium">
              In financial cyber fraud, calling{' '}
              <strong className="bg-[#FF3EA5] text-white dark:bg-[#FFE600] dark:text-[#1A1033] px-1.5 py-0.5 font-bold border border-[#1A1033]">
                1930
              </strong>{' '}
              within <span className="underline decoration-2 font-bold">2 hours</span> enables banks to trace and freeze fraudulent transfers before scammers siphon the money through mule accounts.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-pixel text-[10px] text-[#1A1033] dark:text-[#FFF8E7] uppercase block font-bold">
              EMERGENCY PROTOCOL CHECKLIST:
            </span>
            <ul className="space-y-2 text-xs font-mono-body">
              {steps.map((st, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 bg-white dark:bg-[#231742] border-2 border-[#1A1033] dark:border-[#00E5FF] p-2 shadow-[2px_2px_0px_#1A1033] dark:shadow-[2px_2px_0px_#00E5FF] text-[#1A1033] dark:text-[#FFF8E7]"
                >
                  <span className="font-pixel text-[9px] bg-[#1A1033] text-[#FFF8E7] dark:bg-[#00E5FF] dark:text-[#1A1033] px-1 py-0.5 shrink-0 font-bold">
                    #{i + 1}
                  </span>
                  <span>{st}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Specific Advice from static resources */}
          {scamAdvice && scamAdvice.advice && (
            <div className="bg-[#B6FF00]/30 dark:bg-[#B6FF00]/15 border-2 border-[#1A1033] dark:border-[#B6FF00] p-2.5 text-xs font-mono-body text-[#1A1033] dark:text-[#FFF8E7]">
              <strong className="font-pixel text-[9px] block mb-1 text-[#3E6B00] dark:text-[#B6FF00] font-bold">
                LEGAL TRUTH FOR THIS SCAM:
              </strong>
              {scamAdvice.advice}
            </div>
          )}

          {/* Big Helpline Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="tel:1930"
              className="pixel-btn bg-[#FF3EA5] text-white text-center py-2.5 px-4 font-pixel text-xs flex-1 flex items-center justify-center gap-2 hover:brightness-110 shadow-[3px_3px_0px_#1A1033]"
            >
              <span>📞 CALL 1930 HELPLINE NOW</span>
            </a>

            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-btn bg-[#00E5FF] text-[#1A1033] text-center py-2.5 px-4 font-pixel text-xs flex-1 flex items-center justify-center gap-2 hover:brightness-110 shadow-[3px_3px_0px_#1A1033]"
            >
              <span>🌐 CYBERCRIME.GOV.IN &gt;&gt;</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

// Window 3: THINGS NOT TO DO
interface DoNotWindowProps {
  items: string[];
}

export const DoNotWindow: React.FC<DoNotWindowProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="pixel-box-lg bg-[#FFF8E7] overflow-hidden">
      <div className="window-titlebar bg-[#1A1033] text-[#FFF8E7]">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-xs text-[#FF3EA5]">DO_NOT.EXE</span>
          <span className="font-vt text-sm text-[#FFF8E7]/80">[CRITICAL PROHIBITIONS]</span>
        </div>
        <div className="flex gap-1">
          <span className="window-btn">_</span>
          <span className="window-btn">口</span>
          <span className="window-btn">X</span>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-2 bg-[#FF3EA5]/10 dark:bg-[#FF3EA5]/15 border-2 border-[#1A1033] dark:border-[#FF3EA5] p-2.5 shadow-[2px_2px_0px_#1A1033] dark:shadow-[2px_2px_0px_#FF3EA5] text-xs font-mono-body text-[#1A1033] dark:text-[#FFF8E7]"
          >
            <span className="font-pixel text-sm text-[#FF3EA5] shrink-0">❌</span>
            <span className="font-semibold">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Window 4: SAFE REPLY WITH 1-CLICK COPY
interface SafeReplyWindowProps {
  reply: string;
}

export const SafeReplyWindow: React.FC<SafeReplyWindowProps> = ({ reply }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!reply) return;
    navigator.clipboard.writeText(reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isReplyUnsafe = !reply || reply.trim().length === 0;

  return (
    <div className="pixel-box-lg bg-[#FFF8E7] overflow-hidden">
      <div className="window-titlebar bg-[#7B2FFF] text-[#FFF8E7]">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-xs">SAFE_REPLY.TXT</span>
          <span className="font-vt text-sm text-[#FFF8E7]/90">[REPLY SCRIPT]</span>
        </div>
        <div className="flex gap-1">
          <span className="window-btn">_</span>
          <span className="window-btn">口</span>
          <span className="window-btn">X</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {isReplyUnsafe ? (
          <div className="bg-[#FFE600]/40 border-2 border-[#1A1033] p-3 text-xs font-mono-body text-[#1A1033]">
            <span className="font-pixel text-[10px] block mb-1 text-[#FF3EA5] font-bold">
              DO NOT REPLY TO THIS CONTACT:
            </span>
            For extortion, video arrest summons, or threatening calls, replying or negotiating validates your phone number to the gang. The safest protocol is immediate disconnection and blocking.
          </div>
        ) : (
          <>
            <div className="bg-[#00E5FF]/15 dark:bg-[#00E5FF]/10 border-2 border-[#1A1033] dark:border-[#00E5FF] p-3 text-sm font-mono-body text-[#1A1033] dark:text-[#FFF8E7] select-all leading-relaxed shadow-[2px_2px_0px_#1A1033] dark:shadow-[2px_2px_0px_#00E5FF]">
              "{reply}"
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleCopy}
                className="pixel-btn bg-[#B6FF00] text-[#1A1033] px-4 py-2 font-pixel text-xs flex items-center gap-2"
              >
                <span>{copied ? '✅ COPIED TO CLIPBOARD!' : '📋 COPY SAFE REPLY'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
