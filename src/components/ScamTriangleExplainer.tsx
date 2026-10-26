import { useState } from 'react';
import { AlertCircle, EyeOff, Zap, Shield, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from './ScrollRevealText';

export function ScamTriangleExplainer() {
  const [activeSide, setActiveSide] = useState<'pressure' | 'authority' | 'extraction'>('pressure');

  const pillars = {
    pressure: {
      title: '1. Manufactured Urgency & Panic',
      subtitle: 'Bypassing Rational Prefrontal Thinking',
      summary:
        'Scammers artificially compress time with phrases like "within 15 minutes", "warrant issued", or "electricity disconnected tonight at 9:30 PM". The flood of adrenaline forces impulsive decisions before reason can intervene.',
      scammerScript:
        '"If you disconnect this video call, our police team will raid your house in 45 minutes and seize your assets in public."',
      counterWeapon:
        'Take 3 slow breaths. Legitimate government legal processes take days and formal registered post. Artificial urgency is the single biggest indicator of fraud.',
      icon: Zap,
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
    },
    authority: {
      title: '2. Fake Authority & Forced Isolation',
      subtitle: 'The Weapon of Secrecy',
      summary:
        'Scammers don fake uniforms, forge courtroom stamps, and strictly forbid you from speaking to family or lawyers under threat of the "Official Secrets Act". Isolation prevents a third-party reality check.',
      scammerScript:
        '"This is a confidential national security case. Do not speak to your spouse or family. Keep your camera on in a closed room."',
      counterWeapon:
        'Disconnect and call a trusted friend or family member immediately. Sunlight dissolves the scammer’s illusion the moment a second person hears it.',
      icon: EyeOff,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    extraction: {
      title: '3. Financial Drain & Extraction',
      subtitle: 'The Extraction Trap',
      summary:
        'Once panicked and isolated, the scammer reveals the solution: transfer savings to a "Safe RBI Escrow Account", pay a customs bond via UPI, or install a "verification APK" that secretly steals OTPs.',
      scammerScript:
        '"Transfer your funds to the Supreme Court verification account. The money will be audited and refunded to you in two hours."',
      counterWeapon:
        'No police force, judge, or government entity holds private bank accounts to "verify funds". Never transfer money to prove innocence.',
      icon: AlertCircle,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  };

  const activePillar = pillars[activeSide];
  const Icon = activePillar.icon;

  return (
    <section id="scam-triangle" className="w-full max-w-6xl mx-auto px-4 py-16 border-t border-slate-200">
      <div className="text-center mb-12">
        <ScrollReveal delay={0.1} direction="down">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Psychological Framework
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.15} direction="up">
          <h2 className="font-grotesk text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-3 mb-2">
            The Scam Triangle Framework
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2} direction="none">
          <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
            Every scam vector relies on three interlocking psychological pillars.
            Severing <strong>just one side</strong> instantly breaks the illusion and protects your money.
          </p>
        </ScrollReveal>
      </div>

      {/* Clean 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Triangle Selector */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-4">
            Select a pillar to inspect:
          </span>

          <div className="space-y-2.5">
            <button
              onClick={() => setActiveSide('pressure')}
              className={`w-full text-left p-3.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                activeSide === 'pressure'
                  ? 'border-red-300 bg-red-50 text-red-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>1. Manufactured Urgency &amp; Panic</span>
              <span className="text-slate-400">&gt;</span>
            </button>

            <button
              onClick={() => setActiveSide('authority')}
              className={`w-full text-left p-3.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                activeSide === 'authority'
                  ? 'border-blue-300 bg-blue-50 text-blue-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>2. Fake Authority &amp; Forced Isolation</span>
              <span className="text-slate-400">&gt;</span>
            </button>

            <button
              onClick={() => setActiveSide('extraction')}
              className={`w-full text-left p-3.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                activeSide === 'extraction'
                  ? 'border-amber-300 bg-amber-50 text-amber-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>3. Financial Extraction &amp; APKs</span>
              <span className="text-slate-400">&gt;</span>
            </button>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <strong>The Defense Rule:</strong> When you pause and consult someone else, the scammer loses both urgency and isolation, collapsing the triangle.
          </div>
        </div>

        {/* Right: Detailed Card */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-grotesk font-bold text-xl text-slate-900">
                {activePillar.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {activePillar.subtitle}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                How it works:
              </span>
              <p className="text-slate-700 leading-relaxed">
                {activePillar.summary}
              </p>
            </div>

            <div className="bg-red-50/60 border border-red-200 p-3.5 rounded-lg">
              <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block mb-1">
                Typical scammer script:
              </span>
              <p className="text-slate-800 italic leading-relaxed text-xs">
                {activePillar.scammerScript}
              </p>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-200 p-3.5 rounded-lg">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>How to defeat this pillar:</span>
              </span>
              <p className="text-slate-800 font-medium leading-relaxed text-xs">
                {activePillar.counterWeapon}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
