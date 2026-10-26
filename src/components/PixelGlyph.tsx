/**
 * Clean Geometric Triangle Emblem representing The Scam Triangle
 * (Pressure, Authority/Isolation, Financial Extraction).
 */
export function PixelGlyph({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer Triangle */}
      <polygon
        points="24,6 44,40 4,40"
        stroke="#1e3a8a"
        strokeWidth="3"
        strokeLinejoin="round"
        fill="#eff6ff"
      />
      {/* Inner Central Shield Core */}
      <polygon
        points="24,18 36,38 12,38"
        stroke="#2563eb"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="#ffffff"
      />
      {/* Center Warning dot */}
      <circle cx="24" cy="30" r="3" fill="#dc2626" />
    </svg>
  );
}
