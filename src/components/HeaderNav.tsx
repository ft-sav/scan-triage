import { PhoneCall, ShieldCheck, AlertCircle, FileText, Sparkles } from 'lucide-react';
import { PixelGlyph } from './PixelGlyph';

interface HeaderNavProps {
  onOpenReportModal: () => void;
  onOpenPanicModal: () => void;
  onScrollToVerifier: () => void;
}

export function HeaderNav({
  onOpenReportModal,
  onOpenPanicModal,
  onScrollToVerifier,
}: HeaderNavProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5">
          <PixelGlyph className="w-7 h-7" />
          <div className="flex flex-col">
            <span className="font-grotesk font-bold text-base text-slate-900 tracking-tight leading-none">
              The Scam Triangle
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Fraud Detection &amp; Safety Protocol
            </span>
          </div>
        </div>

        {/* Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
          <button
            onClick={onScrollToVerifier}
            className="hover:text-blue-700 transition-colors cursor-pointer flex items-center gap-1.5 font-semibold text-blue-700"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Check a Message
          </button>
          <a
            href="#types-of-fraud"
            className="hover:text-blue-700 transition-colors"
          >
            Common Scams
          </a>
          <a
            href="#scam-triangle"
            className="hover:text-blue-700 transition-colors"
          >
            How it Works
          </a>
          <a
            href="#community-reports"
            className="hover:text-blue-700 transition-colors"
          >
            Incident Feed
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 text-xs">
          {/* Helpline 1930 */}
          <a
            href="tel:1930"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-200 bg-slate-50 text-slate-800 font-medium hover:bg-slate-100 transition-colors"
            title="National Cyber Crime Reporting Helpline (India: 1930)"
          >
            <PhoneCall className="w-3.5 h-3.5 text-blue-700" />
            <span>1930 Helpline</span>
          </a>

          {/* Report Scam Button */}
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-800 font-medium hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>Report a Scam</span>
          </button>

          {/* Emergency Sent Funds Button */}
          <button
            onClick={onOpenPanicModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-600 text-white font-medium hover:bg-red-700 transition-colors cursor-pointer shadow-sm"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sent Funds?</span>
            <span className="sm:hidden">Emergency</span>
          </button>
        </div>
      </div>
    </header>
  );
}
