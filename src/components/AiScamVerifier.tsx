import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  PhoneCall,
  FileText,
  CheckCircle,
  XCircle,
  HelpCircle,
  ArrowRight,
  Shield,
  Send,
  Copy,
  Check,
} from 'lucide-react';
import { ScamEvaluation } from '../utils/scam-analyzer';
import { ScrollReveal } from './ScrollRevealText';

interface AiScamVerifierProps {
  initialText?: string;
  onOpenReportModalWithData: (data: { category: string; summary: string }) => void;
  onOpenPanicModal: () => void;
}

const SAMPLE_PRESETS = [
  {
    label: 'Digital Arrest Call',
    category: 'Digital Arrest',
    platform: 'Skype Video Call',
    sender: 'Mumbai Police Cyber Cell / Skype: CyberDesk_HQ',
    amount: '₹14,50,000 security deposit',
    text: 'CBI & Mumbai Police Cyber Crime Branch: Your Aadhaar card has been linked to 16 illegal SIM cards and international money laundering. An arrest warrant has been issued in Supreme Court. You are placed under Digital Arrest. You must remain on this Skype video call without disconnecting or informing your family until verification funds are deposited in the RBI clearance escrow.',
  },
  {
    label: 'FedEx Narcotics Parcel',
    category: 'Customs Extortion',
    platform: 'Phone Call',
    sender: '+91 88001-XXXXX (Spoofed IVR)',
    amount: '₹3,00,000 clearance fee',
    text: 'Urgent notice from FedEx India: Parcel #TX-9902 seized by Customs in Taiwan. Contraband containing 140 grams of MDMA narcotics and 4 fake passports found registered to your name and Aadhaar. Press 1 immediately to speak to Narcotics Control Bureau officer or face non-bailable arrest warrant.',
  },
  {
    label: 'Electricity Meter .APK',
    category: 'Malware APK',
    platform: 'WhatsApp',
    sender: '+91 74289-XXXXX',
    amount: 'Install APK / credential theft',
    text: 'Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM by electricity office because your previous month bill was not updated. Please immediately contact our electricity officer and install BSES_Bill_Update.apk from the link below to resolve immediately.',
  },
  {
    label: 'Telegram Hotel Review Job',
    category: 'Task Fraud',
    platform: 'Telegram',
    sender: '@GlobalRating_TaskVIP',
    amount: '₹10,000 VIP task deposit',
    text: 'Hello! I am HR manager from Global Media Ltd. Earn ₹3,000 to ₹8,000 per day by giving 5-star ratings to hotels on Google Maps. We will send ₹150 trial bonus right now to your UPI. Complete 3 trial tasks to unlock VIP prepaid earnings.',
  },
  {
    label: 'Legitimate Order Receipt',
    category: 'Normal Notification',
    platform: 'SMS',
    sender: 'Amazon.in',
    amount: 'None',
    text: 'Your Amazon.in order #402-99210-112 has shipped via Delhivery tracking #992109281. Expected delivery: Tuesday by 8 PM. You can track your package directly inside the official Amazon app. Thank you for shopping with us.',
  },
];

export function AiScamVerifier({
  initialText = '',
  onOpenReportModalWithData,
  onOpenPanicModal,
}: AiScamVerifierProps) {
  const [formData, setFormData] = useState({
    messageText: initialText,
    platform: 'WhatsApp',
    sender: '',
    demandedAmount: '',
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [evaluation, setEvaluation] = useState<ScamEvaluation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedDossier, setCopiedDossier] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialText) {
      setFormData((prev) => ({ ...prev, messageText: initialText }));
    }
  }, [initialText]);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.messageText || formData.messageText.trim().length < 5) {
      setErrorMessage('Please enter or paste suspicious message text (at least 5 characters).');
      return;
    }

    setErrorMessage(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze-scam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: formData.messageText,
          platform: formData.platform,
          sender: formData.sender,
          amount: formData.demandedAmount,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze text.');
      }

      setEvaluation(data.evaluation);

      // Smooth scroll down to feedback
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with analysis service.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setFormData({
      messageText: preset.text,
      platform: preset.platform,
      sender: preset.sender,
      demandedAmount: preset.amount,
    });
    setEvaluation(null);
    setErrorMessage(null);
  };

  const handleCopyDossier = () => {
    if (!evaluation) return;
    const summary = `=== THE SCAM TRIANGLE FORENSIC ADVISORY ===
Scam Type: ${evaluation.categoryTitle}
Confidence: ${evaluation.confidence}%
Platform: ${formData.platform}
Sender: ${formData.sender || 'Not provided'}
Demand: ${formData.demandedAmount || 'Not provided'}

[HOW TO OVERCOME]
${evaluation.howToOvercome}

[PRECAUTIONS TO TAKE]
${evaluation.precautions.map((p, i) => `${i + 1}. ${p}`).join('\n')}

[LEGAL REALITY]
${evaluation.debunkingFact}

Helpline: 1930 / cybercrime.gov.in`;

    navigator.clipboard.writeText(summary);
    setCopiedDossier(true);
    setTimeout(() => setCopiedDossier(false), 2000);
  };

  return (
    <section id="verifier" className="w-full max-w-5xl mx-auto px-4 py-16">
      {/* Section Header */}
      <div className="text-center mb-10">
        <ScrollReveal delay={0.1} direction="down">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Verification &amp; Safety Assistant</span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15} direction="up">
          <h2 className="font-grotesk text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-2">
            Check Suspicious Messages &amp; Get AI Guidance
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2} direction="none">
          <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
            Fill in the details below. Our forensic AI assistant will analyze what type of scam it is, explain how to overcome it, and list all precautions you need to take right now.
          </p>
        </ScrollReveal>
      </div>

      {/* Main Interactive Form Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
        {/* Presets Bar */}
        <div className="mb-6">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            Load a sample scenario:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-xs font-medium rounded border border-slate-200 transition-colors cursor-pointer"
              >
                + {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleAnalyze} className="space-y-5">
          {/* Main message text */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
              Suspicious Message, Call Script, or Email Content *
            </label>
            <textarea
              value={formData.messageText}
              onChange={(e) => setFormData({ ...formData, messageText: e.target.value })}
              rows={5}
              placeholder="Paste the message, WhatsApp text, email, or describe what the caller said..."
              className="w-full p-3.5 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-slate-900 bg-slate-50/50 leading-relaxed font-sans"
              required
            />
          </div>

          {/* Optional context fields (Platform, Sender, Demanded Amount) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Communication Channel
              </label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:border-blue-600 outline-none"
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Skype Video Call">Skype / Video Call</option>
                <option value="Phone Call">Phone Call / Automated IVR</option>
                <option value="SMS">SMS / Text Message</option>
                <option value="Telegram">Telegram Channel / DM</option>
                <option value="Email">Phishing Email</option>
                <option value="Web Link / APK">Sideloaded APK / Web Link</option>
                <option value="Other">Other Channel</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sender Identifier (Optional)
              </label>
              <input
                type="text"
                value={formData.sender}
                onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                placeholder="e.g. +91 98210-XXXXX or Skype ID"
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Demanded Amount / Action (Optional)
              </label>
              <input
                type="text"
                value={formData.demandedAmount}
                onChange={(e) => setFormData({ ...formData, demandedAmount: e.target.value })}
                placeholder="e.g. ₹5,00,000 or APK download"
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:border-blue-600 outline-none"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit / Analysis Button */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              Powered by advanced cyber-forensic safety evaluation.
            </span>

            <div className="flex items-center gap-3">
              {formData.messageText && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      messageText: '',
                      platform: 'WhatsApp',
                      sender: '',
                      demandedAmount: '',
                    });
                    setEvaluation(null);
                  }}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Clear Form
                </button>
              )}

              <button
                type="submit"
                disabled={isAnalyzing}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer disabled:opacity-75"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing with AI Assistant...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Get AI Feedback on this Form</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* AI Feedback Display */}
      {evaluation && (
        <div ref={resultsRef} className="mt-8 space-y-6">
          <div
            className={`rounded-xl border p-6 sm:p-8 shadow-sm bg-white ${
              evaluation.isScam ? 'border-red-200 ring-1 ring-red-100' : 'border-emerald-200'
            }`}
          >
            {/* 1. Header & Threat Category */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-5 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      evaluation.isScam
                        ? 'bg-red-100 text-red-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {evaluation.badgeText}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Confidence: {evaluation.confidence}%
                  </span>
                </div>

                <h3 className="font-grotesk text-2xl font-bold text-slate-900">
                  {evaluation.categoryTitle}
                </h3>
              </div>

              {/* Copy / Export advice button */}
              <button
                onClick={handleCopyDossier}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {copiedDossier ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied Guidance</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>Copy AI Guidance</span>
                  </>
                )}
              </button>
            </div>

            {/* Reassurance & De-escalation Message */}
            <div className="bg-slate-50 border-l-4 border-blue-600 p-4 rounded-r-lg mb-6">
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                {evaluation.calmingMessage}
              </p>
            </div>

            {/* 2. How to Overcome It Section */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-2 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>How to Overcome This Scam</span>
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                {evaluation.howToOvercome}
              </p>
            </div>

            {/* 3. All Precautions You Have to Take */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Precautions You Must Take Right Now</span>
              </h4>
              <div className="space-y-2">
                {evaluation.precautions.map((precaution, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-white"
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-slate-800 leading-relaxed">
                      {precaution}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal / Reality Fact */}
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed mb-6">
              <strong>Institutional Reality:</strong> {evaluation.debunkingFact}
            </div>

            {/* 4. Action bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <a
                  href="tel:1930"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call 1930 Helpline</span>
                </a>

                <button
                  onClick={onOpenPanicModal}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium transition-colors cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  <span>I Already Sent Money</span>
                </button>
              </div>

              <button
                onClick={() =>
                  onOpenReportModalWithData({
                    category: evaluation.categoryTitle,
                    summary: formData.messageText,
                  })
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Save &amp; Report to Community Feed</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
