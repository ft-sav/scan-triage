import React, { useState, useEffect, useRef } from 'react';
import { TriageEvaluation } from '../utils/triageEngine';

interface Message {
  id: string;
  sender: 'citizen' | 'investigator';
  text: string;
  timestamp: string;
}

interface GeminiVerdictChatbotProps {
  evaluation: TriageEvaluation;
  originalText: string;
}

/**
 * Human-readable message formatter that transforms raw markdown (bolding,
 * lists, links) into clean, high-contrast, easily scannable styled elements.
 */
function FormattedChatMessage({ content }: { content: string }) {
  const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);

  const formatInline = (text: string) => {
    const tokenRegex = /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|\*\*[^*]+\*\*)/g;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let keyIdx = 0;

    while ((match = tokenRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        elements.push(text.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        elements.push(
          <strong key={keyIdx++} className="font-bold text-[#9A0048] dark:text-[#FFE600]">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('[')) {
        const linkMatch = token.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/);
        if (linkMatch) {
          elements.push(
            <a
              key={keyIdx++}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold text-[#006070] dark:text-[#00E5FF] hover:text-[#FF3EA5] dark:hover:text-[#FFE600]"
            >
              {linkMatch[1]}
            </a>
          );
        } else {
          elements.push(token);
        }
      }
      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      elements.push(text.substring(lastIndex));
    }

    return elements.length > 0 ? elements : text;
  };

  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        const isBullet = line.startsWith('* ') || line.startsWith('- ');
        const cleanLine = isBullet ? line.slice(2) : line;

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-0.5 my-0.5">
              <span className="text-[#FF3EA5] dark:text-[#00E5FF] font-pixel text-[8px] mt-1 shrink-0">
                ▶
              </span>
              <span className="leading-relaxed text-xs sm:text-sm">{formatInline(cleanLine)}</span>
            </div>
          );
        }

        return (
          <p key={idx} className="leading-relaxed text-xs sm:text-sm">
            {formatInline(cleanLine)}
          </p>
        );
      })}
    </div>
  );
}

const DEFAULT_SUGGESTED_QUESTIONS = [
  'Can police arrest me over a video call?',
  'What if they already have my Aadhaar or PAN?',
  'How do I report this to 1930 / cybercrime.gov.in?',
  'Can my bank freeze my account without notice?',
];

export const GeminiVerdictChatbot: React.FC<GeminiVerdictChatbotProps> = ({
  evaluation,
  originalText,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activeLeg, setActiveLeg] = useState<'all' | 'urgency' | 'authority' | 'extraction'>('all');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Initialize conversation when a new evaluation is received
  useEffect(() => {
    const initialGreeting =
      evaluation.investigator_feedback ||
      `I've completed the forensic analysis of this message under India's IT Act and RBI cybercrime frameworks. ${
        evaluation.risk_score >= 60
          ? 'WARNING: This contains classic criminal manipulation signatures designed to induce panic and bypass rational checks. Do NOT send money or stay in contact.'
          : evaluation.risk_score >= 25
          ? 'CAUTION: This exhibits several suspicious red flags commonly used by phishing syndicates. Verify independently before proceeding.'
          : 'NO RED FLAGS FOUND: While this appears standard, always remember legitimate institutions never ask for confidential PINs or OTPs.'
      } Ask me any questions or test your doubts below.`;

    setMessages([
      {
        id: 'msg-init',
        sender: 'investigator',
        text: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [evaluation]);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isSending) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'citizen',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsSending(true);

    try {
      const response = await fetch('/api/gemini-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: query,
          contextText: originalText,
          verdictData: {
            scam_type: evaluation.scam_type,
            risk_score: evaluation.risk_score,
            verdict_label: evaluation.verdict_label,
            summary: evaluation.summary,
          },
          history: messages.map((m) => ({
            role: m.sender === 'citizen' ? 'user' : 'model',
            content: m.text,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `inv-${Date.now()}`,
            sender: 'investigator',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error(data.error || 'Failed to fetch forensic response');
      }
    } catch (err: any) {
      console.warn('Chat feedback error:', err);
      // Helpful fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `inv-err-${Date.now()}`,
          sender: 'investigator',
          text:
            'Under Indian Law (BNS/IT Act) and RBI guidelines: No government agency or bank conducts legal interrogations or arrests over Skype/WhatsApp/video calls, nor do they demand money in secret "verification accounts". If you shared funds, dial 1930 immediately.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const triangle = evaluation.scam_triangle || {
    pressure_urgency:
      evaluation.risk_score >= 60
        ? 'Imposes artificial time pressure (e.g. 2 hours, "immediate arrest", "blocked today") to force hurried, emotional mistakes.'
        : 'Watch out for artificial deadlines or panic threats.',
    fake_authority:
      evaluation.risk_score >= 60
        ? 'Impersonates official power (CBI, Police, RBI, Customs, Bank Manager) to disarm skepticism and demand obedience.'
        : 'Verify any caller or sender claiming official rank through known verified channels.',
    financial_extraction:
      evaluation.risk_score >= 60
        ? 'Directs victim to pay "clearance fees", move money into "verification accounts", or approve UPI collect requests.'
        : 'No legal body or legitimate job asks for upfront fees or UPI PINs.',
  };

  return (
    <div className="pixel-box-lg bg-[var(--paper)] overflow-hidden shadow-[6px_6px_0px_var(--ink)]">
      {/* Titlebar */}
      <div className="window-titlebar bg-[#FF3EA5] text-[#FFF8E7]">
        <div className="flex items-center gap-2">
          <span className="text-base">🔺</span>
          <span className="font-pixel text-xs tracking-wider">SCAM_TRIAGE_INVESTIGATOR.EXE</span>
          <span className="font-vt text-sm text-[#FFF8E7]/90 hidden sm:inline">
            [AI VERDICT &amp; LEGAL DECONSTRUCTION]
          </span>
        </div>
        <div className="flex gap-1">
          <span className="window-btn">_</span>
          <span className="window-btn">口</span>
          <span className="window-btn">X</span>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-6">
        {/* Scam Triage 3-Pillar Breakdown */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-dashed border-[var(--ink)]/40 pb-2">
            <div>
              <h2 className="font-pixel text-xs sm:text-sm text-[var(--ink)] flex items-center gap-2">
                <span>🔺</span>
                <span>THE SCAM TRIAGE ANATOMY</span>
              </h2>
              <p className="font-vt text-sm text-[var(--ink)]/80">
                Every Indian cyber scam relies on three psychological levers. Here is how this scan breaks them down:
              </p>
            </div>
            <div className="flex gap-1 font-pixel text-[9px] shrink-0">
              <button
                type="button"
                onClick={() => setActiveLeg('all')}
                className={`px-2 py-0.5 border border-[var(--ink)] ${
                  activeLeg === 'all' ? 'bg-[#FFE600] text-[#1A1033] font-bold' : 'bg-transparent text-[var(--ink)]'
                }`}
              >
                ALL
              </button>
              <button
                type="button"
                onClick={() => setActiveLeg('urgency')}
                className={`px-2 py-0.5 border border-[var(--ink)] ${
                  activeLeg === 'urgency' ? 'bg-[#FF3EA5] text-white font-bold' : 'bg-transparent text-[var(--ink)]'
                }`}
              >
                URGENCY
              </button>
              <button
                type="button"
                onClick={() => setActiveLeg('authority')}
                className={`px-2 py-0.5 border border-[var(--ink)] ${
                  activeLeg === 'authority' ? 'bg-[#00E5FF] text-[#1A1033] font-bold' : 'bg-transparent text-[var(--ink)]'
                }`}
              >
                AUTHORITY
              </button>
              <button
                type="button"
                onClick={() => setActiveLeg('extraction')}
                className={`px-2 py-0.5 border border-[var(--ink)] ${
                  activeLeg === 'extraction' ? 'bg-[#B6FF00] text-[#1A1033] font-bold' : 'bg-transparent text-[var(--ink)]'
                }`}
              >
                EXTRACTION
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Pillar 1: Urgency / Pressure */}
            {(activeLeg === 'all' || activeLeg === 'urgency') && (
              <div className="p-3 border-2 border-[var(--ink)] bg-[#FF3EA5]/15 dark:bg-[#FF3EA5]/10 shadow-[3px_3px_0px_var(--ink)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-pixel text-[10px] text-[#B8005A] dark:text-[#FF66B2] font-bold">
                      LEG 1: PRESSURE &amp; PANIC
                    </span>
                    <span className="text-base">⏳</span>
                  </div>
                  <p className="font-mono-body text-xs text-[#1A1033] dark:text-[#FFF8E7] leading-relaxed">
                    {triangle.pressure_urgency}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-[var(--ink)]/20 font-vt text-xs text-[#B8005A] dark:text-[#FF66B2] font-bold uppercase">
                  Goal: Disable rational critical thinking
                </div>
              </div>
            )}

            {/* Pillar 2: Fake Authority / Isolation */}
            {(activeLeg === 'all' || activeLeg === 'authority') && (
              <div className="p-3 border-2 border-[var(--ink)] bg-[#00E5FF]/15 dark:bg-[#00E5FF]/10 shadow-[3px_3px_0px_var(--ink)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-pixel text-[10px] text-[#006677] dark:text-[#00E5FF] font-bold">
                      LEG 2: FAKE AUTHORITY
                    </span>
                    <span className="text-base">👮‍♂️</span>
                  </div>
                  <p className="font-mono-body text-xs text-[#1A1033] dark:text-[#FFF8E7] leading-relaxed">
                    {triangle.fake_authority}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-[var(--ink)]/20 font-vt text-xs text-[#006677] dark:text-[#00E5FF] font-bold uppercase">
                  Goal: Compel blind obedience &amp; isolation
                </div>
              </div>
            )}

            {/* Pillar 3: Financial Extraction */}
            {(activeLeg === 'all' || activeLeg === 'extraction') && (
              <div className="p-3 border-2 border-[var(--ink)] bg-[#B6FF00]/25 dark:bg-[#B6FF00]/10 shadow-[3px_3px_0px_var(--ink)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-pixel text-[10px] text-[#3E6B00] dark:text-[#B6FF00] font-bold">
                      LEG 3: EXTRACTION TRAP
                    </span>
                    <span className="text-base">💸</span>
                  </div>
                  <p className="font-mono-body text-xs text-[#1A1033] dark:text-[#FFF8E7] leading-relaxed">
                    {triangle.financial_extraction}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-[var(--ink)]/20 font-vt text-xs text-[#3E6B00] dark:text-[#B6FF00] font-bold uppercase">
                  Goal: Transfer money / harvest OTPs
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Forensic Investigator Chat Stream */}
        <div className="border-3 border-[var(--ink)] bg-white dark:bg-[#1B1232] shadow-[4px_4px_0px_var(--ink)] overflow-hidden">
          <div className="bg-[#7B2FFF] text-[#FFF8E7] px-3 py-2 flex items-center justify-between border-b-2 border-[var(--ink)]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-none bg-[#B6FF00] border border-[#1A1033] inline-block" />
              <span className="font-pixel text-[10px] sm:text-xs tracking-wider">
                FORENSIC AGENT
              </span>
            </div>
            <span className="font-vt text-xs text-[#FFF8E7]/90">INDIAN CYBER LAW ADVISOR</span>
          </div>

          {/* Messages Container */}
          <div
            ref={chatScrollRef}
            className="p-3 sm:p-4 max-h-72 overflow-y-auto space-y-3 bg-[#FFFDF7] dark:bg-[#150D24]"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'citizen' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-pixel text-[8px] uppercase text-[#1A1033]/80 dark:text-[#FFF8E7]/80 font-bold">
                    {msg.sender === 'citizen' ? '👤 YOU (CITIZEN)' : '🤖 FORENSIC INVESTIGATOR'}
                  </span>
                  <span className="font-vt text-[10px] text-[#1A1033]/60 dark:text-[#FFF8E7]/60">{msg.timestamp}</span>
                </div>
                <div
                  className={`max-w-[88%] p-3 border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] font-mono-body text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'citizen'
                      ? 'bg-[#FFE600] text-[#1A1033] font-medium'
                      : 'bg-white dark:bg-[#231742] text-[#1A1033] dark:text-[#FFF8E7]'
                  }`}
                >
                  <FormattedChatMessage content={msg.text} />
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex items-center gap-2 p-2 bg-[#00E5FF]/20 border border-[var(--ink)] font-pixel text-[9px] text-[#005B6E] dark:text-[#00E5FF]">
                <span className="animate-spin text-sm">⚙️</span>
                <span>INVESTIGATOR IS ANALYZING EVIDENCE...</span>
              </div>
            )}
          </div>

          {/* Quick Questions Prompt Chips */}
          <div className="p-2 sm:p-3 bg-[#1A1033]/5 dark:bg-[#1A1033]/40 border-t-2 border-[var(--ink)] space-y-1.5">
            <span className="font-pixel text-[8px] text-[#1A1033]/80 dark:text-[#FFF8E7]/80 block uppercase font-bold">
              QUICK CYBER INQUIRIES:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {DEFAULT_SUGGESTED_QUESTIONS.map((question, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isSending}
                  onClick={() => handleSendMessage(question)}
                  className="font-vt text-xs sm:text-sm bg-white dark:bg-[#1B1232] text-[#1A1033] dark:text-[#FFF8E7] px-2 py-0.5 border border-[var(--ink)] hover:bg-[#00E5FF] hover:text-[#1A1033] dark:hover:bg-[#00E5FF] dark:hover:text-[#1A1033] transition-colors cursor-pointer text-left shadow-[1px_1px_0px_var(--ink)] active:translate-x-0.5 active:translate-y-0.5"
                >
                  💬 {question}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2 sm:p-3 bg-white dark:bg-[#1B1232] border-t-2 border-[var(--ink)] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask the investigator about this scam, legal risks, or next steps..."
              disabled={isSending}
              className="flex-1 p-2 border-2 border-[var(--ink)] bg-white dark:bg-[#100824] text-[#1A1033] dark:text-[#FFF8E7] placeholder-[#1A1033]/50 dark:placeholder-[#FFF8E7]/50 font-mono-body text-xs outline-none focus:border-[#7B2FFF] dark:focus:border-[#00E5FF]"
            />
            <button
              type="submit"
              disabled={isSending || !inputQuery.trim()}
              className="pixel-btn bg-[#00E5FF] text-[#1A1033] px-4 py-2 font-pixel text-[10px] sm:text-xs font-bold shrink-0 shadow-[2px_2px_0px_var(--ink)]"
            >
              SEND &gt;&gt;
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
