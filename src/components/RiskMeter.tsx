import React from 'react';
import { ShieldIcon, HierarchyIcon, BankIcon } from './pixelIcons';

interface RiskMeterProps {
  score: number;
  verdictLabel: string;
  confidence: 'low' | 'medium' | 'high';
  scamType: string;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({
  score,
  verdictLabel,
  confidence,
  scamType,
}) => {
  // 10 segments in the pixel HP bar
  const totalBlocks = 10;
  const activeBlocks = Math.round((Math.min(100, Math.max(0, score)) / 100) * totalBlocks);

  // Verdict style mapping
  const isNoFlags = score < 25;
  const isSuspicious = score >= 25 && score < 60;
  const isScamLikely = score >= 60;

  const badgeBg = isNoFlags
    ? '#B6FF00' // acid lime
    : isSuspicious
    ? '#FFE600' // sunny yellow
    : '#FF3EA5'; // hot pink

  const badgeText = isNoFlags ? '#1A1033' : isSuspicious ? '#1A1033' : '#FFF8E7';

  // Determine active block colors: green for low, yellow for mid, hot-pink for high
  const getBlockColor = (index: number) => {
    if (index >= activeBlocks) return '#FFF8E7'; // empty paper
    if (index < 3) return '#B6FF00'; // lime
    if (index < 6) return '#FFE600'; // yellow
    return '#FF3EA5'; // hot pink
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Banner: Verdict & Icon */}
      <div
        className="p-3.5 border-3 border-[#1A1033] shadow-[4px_4px_0px_#1A1033] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{ backgroundColor: badgeBg, color: badgeText }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 border-2 border-[#1A1033] bg-[#FFF8E7] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#1A1033]"
            style={{ color: isNoFlags ? '#00A82D' : isSuspicious ? '#B8860B' : '#FF3EA5' }}
          >
            {isNoFlags && <ShieldIcon size={32} title="No red flags icon" />}
            {isSuspicious && <HierarchyIcon size={32} title="Suspicious pattern icon" />}
            {isScamLikely && <BankIcon size={32} title="Fraud alert icon" />}
          </div>

          <div>
            <div className="font-pixel text-[11px] sm:text-xs tracking-wider uppercase">
              VERDICT: {verdictLabel}
            </div>
            <div className="font-vt text-sm sm:text-base opacity-90 mt-0.5">
              CONFIDENCE: {confidence.toUpperCase()} // CLASSIFICATION: {scamType.replace(/_/g, ' ')}
            </div>
          </div>
        </div>

        <div className="bg-[#1A1033] text-[#FFF8E7] px-3 py-1.5 border-2 border-[#1A1033] font-pixel text-xs text-right shrink-0">
          THREAT: {score}/100
        </div>
      </div>

      {/* 10-Block Segmented HP Risk Bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5 text-xs font-pixel text-[var(--ink)]">
          <span>RISK HP METER:</span>
          <span>{activeBlocks} / 10 BLOCKS ACTIVE</span>
        </div>

        <div className="flex w-full bg-[#1A1033] p-1 border-3 border-[var(--ink)] shadow-[3px_3px_0px_var(--ink)]">
          {Array.from({ length: totalBlocks }).map((_, i) => (
            <div
              key={i}
              className="pixel-meter-block"
              style={{
                backgroundColor: getBlockColor(i),
              }}
            />
          ))}
        </div>

        <div className="flex justify-between text-[10px] font-pixel text-[var(--ink)]/80 mt-1">
          <span>0 (CLEAN)</span>
          <span>25 (VERIFY)</span>
          <span>60 (SCAM LIKELY)</span>
          <span>100 (CRITICAL)</span>
        </div>
      </div>
    </div>
  );
};
