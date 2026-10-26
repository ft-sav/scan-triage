import { PhoneCall, ExternalLink } from 'lucide-react';
import { PixelGlyph } from './PixelGlyph';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-12 px-4 mt-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <PixelGlyph className="w-8 h-8 flex-shrink-0" />
          <div>
            <span className="font-grotesk font-bold text-sm text-slate-900 block">
              The Scam Triangle
            </span>
            <span className="text-xs text-slate-500">
              An open digital literacy and psychological scam de-escalation initiative.
            </span>
          </div>
        </div>

        {/* Right Links */}
        <div className="text-xs font-medium text-slate-600 flex flex-wrap items-center justify-center gap-5">
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700 transition-colors flex items-center gap-1"
          >
            <span>cybercrime.gov.in</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <span className="text-slate-300">|</span>
          <a
            href="tel:1930"
            className="hover:text-blue-700 transition-colors flex items-center gap-1 font-semibold text-blue-700"
          >
            <PhoneCall className="w-3.5 h-3.5 text-blue-700" />
            <span>National Helpline: 1930</span>
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>
          Always pause before moving funds. Genuine law enforcement never conducts interrogations or issues bail over video calls.
        </p>
        <p className="font-medium text-slate-700">
          De-escalate Panic · Protect Finances · Report Fraud
        </p>
      </div>
    </footer>
  );
}
