import { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Bot,
  User,
  ArrowRight,
  RefreshCw,
  PhoneCall,
  Lock,
} from 'lucide-react';
import { ChatMessage, formatTimestamp } from '../utils/chatbot-helper';
import { ReportedIncident } from '../../server';

interface GeminiChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportIncidentSuccess: (report: ReportedIncident) => void;
}

const SAMPLE_PROMPTS = [
  'Fake Mumbai Police Skype call demanding money transfer',
  'FedEx narcotics package seized by Taiwan customs',
  'WhatsApp message to install electricity bill APK before 9:30 PM',
  'Telegram HR offering ₹5,000/day for rating hotel reviews',
];

export function GeminiChatbotModal({
  isOpen,
  onClose,
  onReportIncidentSuccess,
}: GeminiChatbotModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content:
        'Hello. I am your AI Cyber Defense Investigator. If you received a suspicious email, DM, phone call, or APK download, paste the text or describe what happened. I will evaluate whether it is a scam, calm any fear, explain how to overcome it, and help you report it.',
      timestamp: formatTimestamp(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFilingReport, setIsFilingReport] = useState<string | null>(null);
  const [filedReports, setFiledReports] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: formatTimestamp(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/scam-chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          currentMessage: text.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze message.');
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: data.reply || 'Analysis completed.',
        timestamp: formatTimestamp(),
        analysis: data.diagnosis
          ? {
              isScam: data.diagnosis.isScam,
              confidence: data.diagnosis.confidence,
              scamType: data.diagnosis.scamType,
              howToOvercome: data.diagnosis.howToOvercome,
              precautions: data.diagnosis.precautions || [],
              canReport: data.diagnosis.isScam,
              incidentDraft: data.diagnosis.incidentDraft,
            }
          : undefined,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'model',
          content: `Notice: ${err.message || 'Network hiccup'}. As a precaution: never transfer funds or provide banking OTPs to unverified contacts.`,
          timestamp: formatTimestamp(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileIncidentFromChat = async (msgId: string, draft: any) => {
    if (!draft || isFilingReport) return;

    setIsFilingReport(msgId);
    try {
      const res = await fetch('/api/report-scam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: draft.category || 'Confirmed Cyber Scam',
          sourcePlatform: draft.platform || 'WhatsApp',
          summary: draft.summary || 'Logged via Forensic Chatbot Assistant.',
          demandedAmount: draft.demandedAmount || 'Financial transfer attempt',
          senderIdentifier: draft.sender || 'Unknown contact',
          evidenceNotes: 'Directly verified and reported via Scam Defense Chatbot.',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to file report');

      setFiledReports((prev) => ({
        ...prev,
        [msgId]: data.report.refCode,
      }));
      onReportIncidentSuccess(data.report);
    } catch (err) {
      console.error('Error logging incident:', err);
    } finally {
      setIsFilingReport(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-3xl h-[88vh] flex flex-col overflow-hidden text-slate-100">
        {/* Chatbot Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-sans font-bold text-sm tracking-wide text-white">
                  AI Scam Defense &amp; Triage Bot
                </h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-blue-900/50 text-blue-300 border border-blue-700/40">
                  AI Grounded
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Analyze chats, verify phishing scripts, overcome threats, and report scams.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Sample Prompts Bar */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Try Scenario:</span>
          {SAMPLE_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="text-[11px] font-sans px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/50 shrink-0 transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role !== 'user' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-indigo-300" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-800/90 border border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1 opacity-70 text-[10px]">
                  <span>{msg.role === 'user' ? 'You' : 'Forensic Investigator'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Structured Analysis Card if scam diagnosis exists */}
                {msg.analysis && (
                  <div className="mt-3 pt-3 border-t border-slate-700 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                          msg.analysis.isScam
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {msg.analysis.isScam
                          ? `⚠️ Scam Detected (${msg.analysis.confidence}%)`
                          : '🟢 Benign Notification'}
                      </span>
                      <span className="text-slate-300 font-semibold text-[11px]">
                        {msg.analysis.scamType}
                      </span>
                    </div>

                    {msg.analysis.howToOvercome && (
                      <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-800/40 text-[11px] text-blue-200">
                        <strong className="text-blue-300 block mb-0.5">How to Overcome:</strong>
                        {msg.analysis.howToOvercome}
                      </div>
                    )}

                    {msg.analysis.precautions && msg.analysis.precautions.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60 text-[11px]">
                        <strong className="text-slate-300 block mb-1">Precautions Checklist:</strong>
                        <ul className="list-disc list-inside space-y-1 text-slate-300">
                          {msg.analysis.precautions.map((p, pIdx) => (
                            <li key={pIdx}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 1-Click File Scam Report */}
                    {msg.analysis.canReport && msg.analysis.incidentDraft && (
                      <div className="pt-1 flex items-center justify-between">
                        {filedReports[msg.id] ? (
                          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Incident Filed: {filedReports[msg.id]}</span>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              handleFileIncidentFromChat(msg.id, msg.analysis?.incidentDraft)
                            }
                            disabled={isFilingReport === msg.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[11px] font-semibold transition-all cursor-pointer shadow-md disabled:opacity-60"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>
                              {isFilingReport === msg.id
                                ? 'Filing Incident...'
                                : 'Log as Confirmed Incident Report'}
                            </span>
                          </button>
                        )}

                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <PhoneCall className="w-3 h-3 text-amber-400" />
                          <span>Cyber Helpline: 1930</span>
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2 px-3">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
              <span>AI is evaluating threat vector &amp; preparing reassurance...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 md:p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type what happened or paste suspicious SMS/email/script..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
