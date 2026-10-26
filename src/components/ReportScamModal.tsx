import { useState, useEffect } from 'react';
import { X, CheckCircle, Copy, AlertCircle, Send, Sparkles } from 'lucide-react';
import { ReportedIncident } from '../../server';

interface ReportScamModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  initialSummary?: string;
  onReportSuccess: (newReport: ReportedIncident) => void;
  onOpenChatbot?: () => void;
}

export function ReportScamModal({
  isOpen,
  onClose,
  initialCategory = '',
  initialSummary = '',
  onReportSuccess,
  onOpenChatbot,
}: ReportScamModalProps) {
  const [category, setCategory] = useState(initialCategory || 'Digital Arrest / Fake Police');
  const [sourcePlatform, setSourcePlatform] = useState<ReportedIncident['sourcePlatform']>('WhatsApp');
  const [senderIdentifier, setSenderIdentifier] = useState('');
  const [demandedAmount, setDemandedAmount] = useState('');
  const [summary, setSummary] = useState(initialSummary || '');
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedReport, setSubmittedReport] = useState<ReportedIncident | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialCategory) setCategory(initialCategory);
    if (initialSummary) setSummary(initialSummary);
  }, [initialCategory, initialSummary]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary || summary.trim().length < 10) {
      setErrorMessage('Please describe the incident (at least 10 characters).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/report-scam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          sourcePlatform,
          summary,
          demandedAmount: demandedAmount || 'None stated / Intercepted',
          senderIdentifier: senderIdentifier || 'Unspecified / Redacted',
          evidenceNotes,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit scam report.');
      }

      setSubmittedReport(data.report);
      onReportSuccess(data.report);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error logging report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyReport = () => {
    if (!submittedReport) return;
    const text = `=== INCIDENT DOSSIER: THE SCAM TRIANGLE ===
Reference ID: ${submittedReport.refCode}
Category: ${submittedReport.category}
Platform: ${submittedReport.sourcePlatform}
Sender Identifier: ${submittedReport.senderIdentifier}
Demanded Amount: ${submittedReport.demandedAmount || 'N/A'}
Summary: ${submittedReport.summary}
Evidence Notes: ${submittedReport.evidenceNotes}
National Helpline: 1930 / cybercrime.gov.in`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-grotesk font-bold text-lg text-slate-900">
              Report Confirmed Scam Incident
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submittedReport ? (
            <div className="text-center space-y-5">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle className="w-6 h-6" />
              </div>

              <div>
                <h4 className="font-grotesk font-bold text-xl text-slate-900 mb-1">
                  Incident Logged Successfully
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your report has been added to the public threat feed to warn other citizens.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-left text-xs space-y-1.5">
                <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-500 uppercase tracking-wider">Reference Code</span>
                  <span className="font-mono font-bold text-blue-700 text-sm">{submittedReport.refCode}</span>
                </div>
                <p><strong>Vector:</strong> {submittedReport.category} via {submittedReport.sourcePlatform}</p>
                <p><strong>Sender:</strong> {submittedReport.senderIdentifier}</p>
                <p><strong>Summary:</strong> {submittedReport.summary}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleCopyReport}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied' : 'Copy Dossier for Police/1930'}</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {errorMessage}
                </div>
              )}

              {onOpenChatbot && (
                <div className="flex items-center justify-between p-3 bg-blue-50/70 border border-blue-200/80 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-700 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-blue-900 block">
                        Want AI to analyze the chat or message first?
                      </span>
                      <span className="text-[11px] text-blue-700">
                        Chat with our forensic AI assistant to classify the threat, overcome it, and draft your report.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenChatbot();
                    }}
                    className="ml-2 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer"
                  >
                    Launch Chatbot
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Scam Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:border-blue-600 outline-none"
                  >
                    <option value="Digital Arrest / Fake Police">Digital Arrest / Fake Police Summons</option>
                    <option value="FedEx / Customs Narcotics Extortion">FedEx / Customs Narcotics Extortion</option>
                    <option value="APK WhatsApp & Fake Electricity KYC">APK WhatsApp &amp; Fake Utility/Bank KYC</option>
                    <option value="Telegram Task & Review Fraud">Telegram Task &amp; Review Fraud</option>
                    <option value="Pig Butchering Crypto Romance">Pig Butchering Crypto Romance</option>
                    <option value="Bank Impersonation & OTP Siphon">Bank Impersonation / OTP Phishing</option>
                    <option value="AnyDesk / Screen Share Fraud">Remote Access (AnyDesk / TeamViewer)</option>
                    <option value="Other Malicious Vector">Other Phishing or Scam</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Channel / Platform
                  </label>
                  <select
                    value={sourcePlatform}
                    onChange={(e) => setSourcePlatform(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:border-blue-600 outline-none"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Skype">Skype Video Call</option>
                    <option value="Phone Call">Phone Call / IVR</option>
                    <option value="SMS">SMS / Text Message</option>
                    <option value="Telegram">Telegram</option>
                    <option value="Email">Phishing Email</option>
                    <option value="Web Link">Malicious Web Link / APK</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Sender Phone / Account ID
                  </label>
                  <input
                    type="text"
                    value={senderIdentifier}
                    onChange={(e) => setSenderIdentifier(e.target.value)}
                    placeholder="e.g. +91 98210-XXXXX or Skype ID"
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:border-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Demanded Amount
                  </label>
                  <input
                    type="text"
                    value={demandedAmount}
                    onChange={(e) => setDemandedAmount(e.target.value)}
                    placeholder="e.g. ₹5,00,000 or APK download"
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Incident Description / Script Used *
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={4}
                  placeholder="Describe what the scammer claimed, what credentials they faked, and what they instructed you to do..."
                  className="w-full p-3 rounded-lg border border-slate-300 bg-white text-slate-800 focus:border-blue-600 outline-none leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Evidence Notes / Technical Details
                </label>
                <input
                  type="text"
                  value={evidenceNotes}
                  onChange={(e) => setEvidenceNotes(e.target.value)}
                  placeholder="e.g. Fake Supreme Court warrant shown, or APK package name"
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:border-blue-600 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold transition-colors cursor-pointer disabled:opacity-75"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Logging...' : 'Submit Incident'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
