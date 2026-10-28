import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldIcon,
  MailIcon,
  GlobeIcon,
  CursorIcon,
  HierarchyIcon,
  BankIcon,
} from './components/pixelIcons';
import { CartridgeBar, SAMPLE_CARTRIDGES } from './components/CartridgeBar';
import { RiskMeter } from './components/RiskMeter';
import { CountdownTimer } from './components/CountdownTimer';
import {
  RedFlagsWindow,
  IfPaidWindow,
  DoNotWindow,
  SafeReplyWindow,
} from './components/TriageResultWindows';
import { GeminiVerdictChatbot } from './components/GeminiVerdictChatbot';
import {
  redactSensitiveData,
  TriageEvaluation,
  evaluateRules,
  getVerdictLabel,
} from './utils/triageEngine';
import resourcesData from './data/resources.json';

const ROTATING_LOADING_STATUS = [
  'SCANNING FOR RED FLAGS...',
  "CHECKING THE SCAMMER'S SCRIPT...",
  'CORRELATING WITH MHA / I4C THREAT DATABASE...',
  'ANALYZING WITH AI FORENSIC ENGINE...',
  'SYNTHESIZING EMERGENCY 10-MINUTE ACTION PLAN...',
];

export default function App() {
  const [inputText, setInputText] = useState<string>('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStatusIdx, setLoadingStatusIdx] = useState<number>(0);
  const [evaluation, setEvaluation] = useState<TriageEvaluation | null>(null);
  const [maskedCount, setMaskedCount] = useState<number>(0);
  const [maskedBannerVisible, setMaskedBannerVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [scrollPercent, setScrollPercent] = useState<number>(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Sync scroll percent for motion HUD
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const current = Math.min(100, Math.max(0, Math.round((window.scrollY / totalHeight) * 100)));
        setScrollPercent(current);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync dark mode class on documentElement and body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Rotate loading text for retro charm
  useEffect(() => {
    let interval: any = null;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStatusIdx((prev) => (prev + 1) % ROTATING_LOADING_STATUS.length);
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Voice Dictation using Web Speech API
  const handleToggleDictation = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage('SPEECH RECOGNITION IS NOT SUPPORTED IN THIS BROWSER. PLEASE TYPE OR PASTE YOUR MESSAGE.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  // Perform Analysis Pipeline
  const runScan = async (textToScan: string) => {
    const trimmed = textToScan.trim();
    if (!trimmed) {
      setErrorMessage('PLEASE PASTE OR TYPE A MESSAGE BEFORE SCANNING.');
      return;
    }

    if (trimmed.length > 4000) {
      setErrorMessage('MESSAGE EXCEEDS 4000 CHARACTERS LIMIT.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    // Step A: Client-side PII redaction
    const redaction = redactSensitiveData(trimmed);
    setMaskedCount(redaction.maskedCount);
    setMaskedBannerVisible(redaction.maskedCount > 0);

    const textForServer = redaction.redactedText;

    try {
      let scanResult: TriageEvaluation | null = null;

      // 1. Call server-side proxy endpoint (/api/triage-scan)
      try {
        let response: Response;
        try {
          response = await fetch('/api/triage-scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: textForServer,
              lang: language,
            }),
          });
        } catch (initialErr) {
          // Automatic retry for server cold start or transient network glitch
          await new Promise((r) => setTimeout(r, 600));
          response = await fetch('/api/triage-scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: textForServer,
              lang: language,
            }),
          });
        }

        if (response.ok) {
          const data = await response.json();
          if (data?.data) {
            scanResult = data.data;
          }
        }
      } catch (serverErr) {
        console.warn('Backend endpoint unavailable or timed out:', serverErr);
      }

      // 2. If scan succeeded via server, display it
      if (scanResult) {
        setEvaluation({
          ...scanResult,
          maskedCount: redaction.maskedCount,
        });

        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return;
      }

      // 4. Fallback only if no Gemini API key was provided anywhere and network failed
      throw new Error('All Gemini evaluation paths exhausted, using local rule engine');
    } catch (err: any) {
      console.warn('Scan network error, running local deterministic fallback:', err);
      // Local client-side fallback if server unreachable
      const ruleRes = evaluateRules(textForServer);
      const isScamLikely = ruleRes.deterministic_score >= 60;
      setEvaluation({
        risk_score: ruleRes.deterministic_score,
        scam_type: ruleRes.inferred_scam_type as any,
        confidence: 'medium',
        verdict_label: getVerdictLabel(ruleRes.deterministic_score),
        summary:
          language === 'hi'
            ? 'नेटवर्क समस्या के कारण बुनियादी नियम जांच परिणाम दिखाए जा रहे हैं।'
            : 'AI analysis unavailable - showing deterministic rule checks.',
        red_flags: ruleRes.rule_hits.map((h) => ({
          label: h.label,
          evidence: h.evidence,
          why: h.why,
        })),
        scammer_goal: isScamLikely ? 'Financial extraction or credential theft.' : 'None identified.',
        next_10_minutes: isScamLikely
          ? [
              'Disconnect immediately. Do not apologize or negotiate.',
              'Block the sender across WhatsApp, phone, and email.',
              'Call 1930 Cyber Helpline if money was transferred.',
            ]
          : ['No urgent action required. Stay vigilant.'],
        if_already_paid: [
          'Call 1930 immediately to freeze transactions in golden hour.',
          'Contact your bank helpline to block cards and netbanking.',
        ],
        do_not: [
          'Do NOT share OTPs or enter UPI PINs.',
          'Do NOT stay on video calls under threat.',
        ],
        safe_reply: '',
        source: 'rules-fallback',
        maskedCount: redaction.maskedCount,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sampleText: string) => {
    setInputText(sampleText);
    runScan(sampleText);
  };

  const isScamLikely = (evaluation?.risk_score ?? 0) >= 60;

  return (
    <div className="min-h-screen text-[#1A1033] flex flex-col justify-between selection:bg-[#FF3EA5] selection:text-white">
      {/* 1. Slow Marquee Ticker */}
      <div className="bg-[#1A1033] text-[#FFE600] border-b-3 border-[#1A1033] py-1 px-4 overflow-hidden select-none">
        <div className="animate-marquee font-pixel text-[10px] tracking-wider whitespace-nowrap">
          <span>
            ★ STAY SAFE ONLINE ★ NEVER SHARE OTPS, PINS, OR PASSWORDS ★ NO AGENCY CONDUCTS "DIGITAL ARREST" ★ NATIONAL CYBER CRIME HELPLINE: 1930 ★ REPORT SUSPICIOUS CALLS TO CHAKSHU (SANCHAR SAATHI) ★&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <span>
            ★ STAY SAFE ONLINE ★ NEVER SHARE OTPS, PINS, OR PASSWORDS ★ NO AGENCY CONDUCTS "DIGITAL ARREST" ★ NATIONAL CYBER CRIME HELPLINE: 1930 ★ REPORT SUSPICIOUS CALLS TO CHAKSHU (SANCHAR SAATHI) ★
          </span>
        </div>
      </div>

      {/* Main Container */}
      <main className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Header / Hero Brand */}
        <header className="pixel-box-lg bg-[#FFE600] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FF3EA5] border-3 border-[#1A1033] text-[#FFF8E7] flex items-center justify-center shrink-0 shadow-[3px_3px_0px_#1A1033]">
              <ShieldIcon size={32} title="Scam Triage Shield Logo" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-pixel text-base sm:text-xl text-[#1A1033] dark:text-[#00E5FF] tracking-wide">
                  SCAM TRIAGE
                </h1>
                <span className="bg-[#FF3EA5] text-[#FFF8E7] font-pixel text-[8px] px-2 py-0.5 border border-[#1A1033] dark:border-[#00E5FF] pixel-star uppercase tracking-wider">
                  RISK SCORING
                </span>
                <span className="bg-[#B6FF00] text-[#1A1033] font-pixel text-[8px] px-2 py-0.5 border border-[#1A1033] dark:border-[#00E5FF] uppercase tracking-wider">
                  EASY AND FAST
                </span>
              </div>
              <p className="font-vt text-sm sm:text-base text-[#1A1033] dark:text-[#FFF8E7]/90 mt-0.5">
                Instant cyber forensic triage to detect fraud patterns, coercive urgency, and extortion tactics.
              </p>
            </div>
          </div>

          {/* Theme Mode Toggle: Light / Dark */}
          <div className="flex items-center gap-2 bg-[#FFF8E7] dark:bg-[#1B1232] border-3 border-[#1A1033] p-1.5 shadow-[3px_3px_0px_#1A1033]">
            <span className="font-pixel text-[9px] text-[#1A1033] dark:text-[#FFF8E7] mr-1">MODE:</span>
            <button
              type="button"
              onClick={() => setIsDarkMode(false)}
              className={`px-2 py-1 font-pixel text-[9px] border-2 border-[#1A1033] cursor-pointer transition-colors ${
                !isDarkMode
                  ? 'bg-[#FFE600] text-[#1A1033] font-bold shadow-[1px_1px_0px_#1A1033]'
                  : 'bg-[#FFF8E7] text-[#1A1033]/70 hover:bg-[#FFE600]'
              }`}
            >
              ☀️ LIGHT
            </button>
            <button
              type="button"
              onClick={() => setIsDarkMode(true)}
              className={`px-2 py-1 font-pixel text-[9px] border-2 border-[#1A1033] cursor-pointer transition-colors ${
                isDarkMode
                  ? 'bg-[#00E5FF] text-[#1A1033] font-bold shadow-[1px_1px_0px_#1A1033]'
                  : 'bg-[#1B1232] text-[#FFF8E7]/70 hover:bg-[#00E5FF] hover:text-[#1A1033]'
              }`}
            >
              🌙 DARK
            </button>
          </div>
        </header>

        {/* 1-Click Game Cartridges Row */}
        <section aria-label="Sample test cartridges">
          <CartridgeBar onSelectSample={handleSelectSample} isLoading={isLoading} />
        </section>

        {/* Main Input Window: SCAN.EXE */}
        <section aria-label="Suspicious message input window">
          <div className="pixel-box-lg bg-[#FFF8E7] overflow-hidden">
            {/* Titlebar */}
            <div className="window-titlebar bg-[#00E5FF] text-[#1A1033]">
              <div className="flex items-center gap-2">
                <MailIcon size={20} title="Mail scanner icon" />
                <span className="font-pixel text-xs">SCAN.EXE</span>
                <span className="font-vt text-sm">[TEXT &amp; VOICE INPUT INTERCEPTOR]</span>
              </div>
              <div className="flex gap-1">
                <span className="window-btn">_</span>
                <span className="window-btn">口</span>
                <span className="window-btn">X</span>
              </div>
            </div>

            {/* Input Form Body */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runScan(inputText);
              }}
              className="p-4 sm:p-5 space-y-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-pixel">
                  <label htmlFor="message-input" className="text-[#1A1033] dark:text-[#FFF8E7]">
                    PASTE SUSPICIOUS SMS / WHATSAPP / EMAIL / CALL TRANSCRIPT:
                  </label>
                  <span
                    className={`font-mono text-xs ${
                      inputText.length > 3800 ? 'text-[#FF3EA5] font-bold' : 'text-[#1A1033]/60 dark:text-[#FFF8E7]/70'
                    }`}
                  >
                    {inputText.length} / 4000
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    id="message-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    maxLength={4000}
                    rows={6}
                    placeholder="Paste or describe suspicious communication here...
Example: 'Caller claiming to be DCP Cyber Mumbai called on Skype, said my FedEx parcel with 140g MDMA was intercepted in Taiwan, demanded Rs 4.8 lakh in safe verification account...'"
                    className="w-full p-3.5 border-3 border-[#1A1033] bg-[#FFF8E7] text-[#1A1033] font-mono-body text-sm placeholder-[#1A1033]/50 focus:bg-white resize-y shadow-[inset_2px_2px_0px_rgba(0,0,0,0.1)] outline-none"
                    disabled={isLoading}
                  />

                  {/* Dictate / Microphone Button */}
                  <button
                    type="button"
                    onClick={handleToggleDictation}
                    title="Dictate message using microphone"
                    className={`absolute bottom-3 right-3 pixel-btn px-2.5 py-1 text-xs font-pixel flex items-center gap-1.5 ${
                      isListening
                        ? 'bg-[#FF3EA5] text-[#FFF8E7] animate-bounce'
                        : 'bg-[#FFE600] text-[#1A1033]'
                    }`}
                  >
                    <span>{isListening ? '🔴 LISTENING...' : '🎤 DICTATE'}</span>
                  </button>
                </div>
              </div>

              {/* Redaction Notice Banner */}
              {maskedBannerVisible && (
                <div className="p-2.5 bg-[#B6FF00]/40 border-2 border-[#1A1033] text-xs font-mono-body flex items-center justify-between shadow-[2px_2px_0px_#1A1033]">
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-[10px] text-[#1A1033]">🛡️ PII SHIELD:</span>
                    <span>
                      Masked <strong>{maskedCount}</strong> sensitive item(s) (Aadhaar / Card / PAN / OTP) before scanning.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMaskedBannerVisible(false)}
                    className="font-pixel text-[8px] px-1 bg-[#1A1033] text-[#FFF8E7]"
                  >
                    DISMISS
                  </button>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 bg-[#FF3EA5]/20 border-2 border-[#FF3EA5] text-xs font-pixel text-[#1A1033] shadow-[2px_2px_0px_#1A1033]">
                  ⚠️ {errorMessage}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setInputText('');
                    setEvaluation(null);
                    setErrorMessage(null);
                    setMaskedBannerVisible(false);
                  }}
                  disabled={isLoading || !inputText}
                  className="pixel-btn bg-[#FFF8E7] dark:bg-[#231742] text-[#1A1033] dark:text-[#FFF8E7] py-3 px-4 font-pixel text-xs text-center"
                >
                  CLEAR BOX
                </button>

                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className="pixel-btn bg-[#B6FF00] text-[#1A1033] py-3.5 px-8 font-pixel text-sm sm:text-base flex items-center justify-center gap-3 shadow-[4px_4px_0px_#1A1033] active:translate-x-1 active:translate-y-1"
                >
                  <CursorIcon size={28} title="Scan pointer cursor" />
                  <span>{isLoading ? 'ANALYZING...' : 'SCAN FOR FRAUD >>'}</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Loading Progress Bar Window */}
        {isLoading && (
          <div className="pixel-box-lg bg-[#FFE600] p-4 text-center space-y-3">
            <div className="font-pixel text-xs sm:text-sm text-[#1A1033]">
              {ROTATING_LOADING_STATUS[loadingStatusIdx]}
            </div>

            <div className="w-full bg-[#1A1033] p-1 border-3 border-[#1A1033] h-6 flex overflow-hidden">
              <div
                className="bg-[#FF3EA5] h-full transition-all duration-300"
                style={{ width: `${((loadingStatusIdx + 1) / ROTATING_LOADING_STATUS.length) * 100}%` }}
              />
            </div>

            <div className="font-vt text-sm text-[#1A1033]">
              PLEASE WAIT • ANALYZING PSYCHOLOGICAL COERCION &amp; PHISHING SIGNATURES...
            </div>
          </div>
        )}

        {/* Results Live Region */}
        <div ref={resultsRef} aria-live="polite" className="space-y-6">
          {evaluation && !isLoading && (
            <>
              {/* Fallback Banner if Gemini failed/timed out */}
              {evaluation.source === 'rules-fallback' && (
                <div className="p-3 bg-[#FFE600] border-3 border-[#1A1033] shadow-[3px_3px_0px_#1A1033] flex items-center justify-between text-xs font-pixel text-[#1A1033]">
                  <span>⚠️ AI analysis unavailable - showing deterministic rule checks.</span>
                  <span className="font-vt text-sm">[RULES ENGINE ACTIVE]</span>
                </div>
              )}

              {/* Big Emergency 1930 Helpline Button if SCAM LIKELY */}
              {isScamLikely && (
                <div className="border-4 border-[#1A1033] dark:border-[#00E5FF] !bg-[#FF3EA5] text-white p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[6px_6px_0px_#1A1033] dark:shadow-[6px_6px_0px_#00E5FF]">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl shrink-0">🚨</span>
                    <div>
                      <div className="font-pixel text-xs sm:text-sm uppercase tracking-wide text-white drop-shadow-[1px_1px_0px_#1A1033]">
                        HIGH THREAT DETECTED: DO NOT TRANSFER MONEY
                      </div>
                      <div className="font-vt text-base text-white/95 mt-0.5">
                        If money was already deducted or credentials shared, call Indian Cyber Helpline immediately.
                      </div>
                    </div>
                  </div>

                  <a
                    href="tel:1930"
                    className="pixel-btn !bg-[#FFE600] text-[#1A1033] font-pixel text-xs sm:text-sm py-2.5 px-6 shrink-0 flex items-center gap-2 hover:bg-white shadow-[3px_3px_0px_#1A1033]"
                  >
                    <span>📞 DIAL 1930 NOW</span>
                  </a>
                </div>
              )}

              {/* Window: VERDICT.EXE */}
              <section aria-label="Triage verdict window">
                <div className="pixel-box-lg bg-[#FFF8E7] overflow-hidden">
                  <div className="window-titlebar bg-[#7B2FFF] text-[#FFF8E7]">
                    <div className="flex items-center gap-2">
                      <HierarchyIcon size={20} title="Verdict icon" />
                      <span className="font-pixel text-xs">VERDICT.EXE</span>
                      <span className="font-vt text-sm text-[#FFF8E7]/90">[THREAT EVALUATION]</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="window-btn">_</span>
                      <span className="window-btn">口</span>
                      <span className="window-btn">X</span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 space-y-5">
                    {/* Segmented Risk Meter */}
                    <RiskMeter
                      score={evaluation.risk_score}
                      verdictLabel={evaluation.verdict_label}
                      confidence={evaluation.confidence}
                      scamType={evaluation.scam_type}
                    />

                    {/* Summary */}
                    <div className="p-3.5 border-2 border-[var(--ink)] bg-[#00E5FF]/15 dark:bg-[#00E5FF]/10 shadow-[2px_2px_0px_var(--ink)] space-y-1">
                      <span className="font-pixel text-[10px] text-[#005B6E] dark:text-[#00E5FF] uppercase block font-bold tracking-wide">
                        EXECUTIVE FORENSIC SUMMARY:
                      </span>
                      <p className="font-mono-body text-sm font-semibold text-[#1A1033] dark:text-[#FFF8E7] leading-relaxed">
                        {evaluation.summary}
                      </p>
                    </div>

                    {/* Scammer's Goal */}
                    <div className="p-3 border-2 border-[var(--ink)] bg-[#FFE600]/25 dark:bg-[#FFE600]/15 shadow-[2px_2px_0px_var(--ink)] flex items-start gap-2 text-xs font-mono-body">
                      <span className="font-pixel text-sm shrink-0">🎯</span>
                      <div>
                        <strong className="font-pixel text-[9px] text-[#7A5800] dark:text-[#FFE600] block mb-0.5 font-bold tracking-wide">
                          SCAMMER'S SUSPECTED GOAL:
                        </strong>
                        <span className="text-[#1A1033] dark:text-[#FFF8E7] font-medium leading-relaxed">{evaluation.scammer_goal}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Window: SCAM_TRIAGE_INVESTIGATOR.EXE (Forensic Chatbot & Scam Triage Deconstruction) */}
              <section aria-label="Forensic verdict investigator and scam triage breakdown">
                <GeminiVerdictChatbot evaluation={evaluation} originalText={inputText} />
              </section>

              {/* Window: FLAGS.TXT (Red Flags with quoted evidence) */}
              <section aria-label="Detected red flags list">
                <RedFlagsWindow flags={evaluation.red_flags} />
              </section>



              {/* Window: IF_ALREADY_PAID.EXE */}
              <section aria-label="If already paid emergency recovery protocol">
                <IfPaidWindow
                  steps={evaluation.if_already_paid}
                  isScamLikely={isScamLikely}
                  scamType={evaluation.scam_type}
                />
              </section>

              {/* Window: DO_NOT.EXE */}
              <section aria-label="Things not to do">
                <DoNotWindow items={evaluation.do_not} />
              </section>

              {/* Window: SAFE_REPLY.TXT */}
              <section aria-label="Safe response copy text">
                <SafeReplyWindow reply={evaluation.safe_reply} />
              </section>
            </>
          )}
        </div>
      </main>

      {/* Retro Pixel Footer */}
      <footer className="mt-12 bg-[#1A1033] text-[#FFF8E7] border-t-4 border-[#1A1033] p-6 text-center space-y-3">
        <div className="max-w-3xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2 flex-wrap font-pixel text-[10px] text-[#FFE600]">
            <span>NATIONAL CYBER CRIME HELPLINE: 1930</span>
            <span>•</span>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-[#00E5FF]"
            >
              CYBERCRIME.GOV.IN
            </a>
            <span>•</span>
            <a
              href="https://sancharsaathi.gov.in/sfc/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-[#B6FF00]"
            >
              SANCHAR SAATHI (CHAKSHU)
            </a>
          </div>

          <p className="font-vt text-sm text-[#FFF8E7]/70">
            DISCLAIMER: Triage tool, not legal or financial advice. Nothing you paste is stored. Verify every resource before launch.
          </p>
        </div>
      </footer>

      {/* Retro Scroll Motion Graphic HUD */}
      <div
        aria-hidden="true"
        className="fixed right-3 bottom-6 hidden lg:flex flex-col items-end gap-1.5 z-40 pointer-events-none select-none transition-opacity duration-300"
        style={{ opacity: scrollPercent > 2 ? 1 : 0.4 }}
      >
        <div className="bg-[#1A1033] border-2 border-[#00E5FF] px-2.5 py-1 text-[8px] font-pixel text-[#FFE600] shadow-[2px_2px_0px_#00E5FF] flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#B6FF00] animate-ping inline-block" />
          <span>TRIAGE DEPTH: {scrollPercent}%</span>
        </div>
        <div className="w-32 h-2.5 bg-[#1A1033] border border-[#00E5FF] p-0.5 shadow-[1px_1px_0px_#00E5FF]">
          <div
            className="h-full bg-gradient-to-r from-[#00E5FF] via-[#FFE600] to-[#FF3EA5] transition-all duration-75"
            style={{ width: `${scrollPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
