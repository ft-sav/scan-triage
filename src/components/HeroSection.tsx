import { Shield, Sparkles, ArrowDown, AlertTriangle } from 'lucide-react';
import { PixelGlyph } from './PixelGlyph';
import { ScrollReveal } from './ScrollRevealText';

interface HeroSectionProps {
  onScrollToTriage: () => void;
  onScrollToVerifier: () => void;
}

export function HeroSection({
  onScrollToTriage,
  onScrollToVerifier,
}: HeroSectionProps) {
  return (
    <section className="relative w-full pt-14 pb-16 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
      {/* Clean Geometric Crest */}
      <ScrollReveal delay={0.05} direction="down">
        <div className="flex justify-center mb-5">
          <PixelGlyph className="w-14 h-14" />
        </div>
      </ScrollReveal>

      {/* Main Title: The Scam Triangle */}
      <ScrollReveal delay={0.15} direction="up" duration={0.8}>
        <h1 className="font-grotesk text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          The Scam Triangle
        </h1>
      </ScrollReveal>

      {/* Clean, Non-cluttered Subtitle */}
      <ScrollReveal delay={0.2} direction="none">
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
          An AI-powered verification tool and safety framework to neutralize online fraud, de-escalate fear, and guide you through immediate precautions.
        </p>
      </ScrollReveal>

      {/* Clean Advisory Card */}
      <ScrollReveal delay={0.25} direction="up" duration={0.8}>
        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm text-left max-w-3xl mx-auto">
          <div className="flex items-start gap-3.5 mb-4">
            <div className="w-8 h-8 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 flex-shrink-0 mt-0.5">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-grotesk font-semibold text-slate-900 text-base mb-1">
                Received an urgent call or message? Stop and breathe first.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Scammers rely on manufactured urgency to bypass your rational thinking. Whether someone claims to be the police, FedEx, customs, or your bank, pause before taking any action. Real authorities never conduct interrogations or demand fund transfers over video calls.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Golden Rule: Real emergencies do not end because you took 10 minutes to verify.
            </span>
            <button
              onClick={onScrollToVerifier}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded font-medium transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Paste Text into AI Form</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Secondary scroll action */}
      <div className="mt-10 flex items-center gap-4 text-xs font-medium text-slate-600">
        <button
          onClick={onScrollToTriage}
          className="inline-flex items-center gap-1.5 hover:text-blue-700 transition-colors cursor-pointer"
        >
          <span>Learn common scam scripts</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}
