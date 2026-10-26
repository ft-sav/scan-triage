import { useState } from 'react';
import { ThumbsUp, Filter, Copy, Check, PlusCircle, AlertTriangle } from 'lucide-react';
import { ReportedIncident } from '../../server';
import { ScrollReveal } from './ScrollRevealText';

interface CommunityThreatFeedProps {
  reports: ReportedIncident[];
  onOpenReportModal: () => void;
  onUpvoteReport: (id: string) => void;
}

export function CommunityThreatFeed({
  reports,
  onOpenReportModal,
  onUpvoteReport,
}: CommunityThreatFeedProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { label: 'All Reports', value: 'ALL' },
    { label: 'Digital Arrest', value: 'Digital Arrest' },
    { label: 'FedEx / Customs', value: 'FedEx' },
    { label: 'APK & KYC', value: 'APK' },
    { label: 'Telegram Tasks', value: 'Task' },
  ];

  const filteredReports = reports.filter((r) => {
    if (selectedFilter === 'ALL') return true;
    return r.category.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  const handleCopyRef = (refCode: string) => {
    navigator.clipboard.writeText(refCode);
    setCopiedId(refCode);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="community-reports" className="w-full max-w-6xl mx-auto px-4 py-16 border-t border-slate-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <ScrollReveal delay={0.1} direction="down">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Community Incident Feed
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.15} direction="up">
            <h2 className="font-grotesk text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-3 mb-1">
              Confirmed Phishing &amp; Scam Reports
            </h2>
          </ScrollReveal>

          <p className="text-slate-600 text-sm max-w-xl">
            Real incident reports submitted by citizens and volunteers to track active scam syndicates.
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report an Incident</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-semibold text-slate-500 mr-1">Filter by:</span>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedFilter(cat.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              selectedFilter === cat.value
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredReports.map((report, idx) => (
          <ScrollReveal key={report.id} delay={0.08 + (idx % 2) * 0.08} direction="up" duration={0.6}>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full hover:border-slate-300 transition-all">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700">
                      {report.refCode}
                    </span>
                    <button
                      onClick={() => handleCopyRef(report.refCode)}
                      title="Copy incident reference code"
                      className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                      {copiedId === report.refCode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">
                      {report.timestamp}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        report.severity === 'CRITICAL'
                          ? 'bg-red-100 text-red-700'
                          : report.severity === 'HIGH'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {report.severity}
                    </span>
                  </div>
                </div>

                <h3 className="font-grotesk font-bold text-base text-slate-900 mb-1">
                  {report.category}
                </h3>

                <div className="text-xs text-slate-500 mb-3 flex flex-wrap items-center gap-2">
                  <span>Channel: <strong className="text-slate-700">{report.sourcePlatform}</strong></span>
                  <span>•</span>
                  <span>Sender: <strong className="text-slate-700">{report.senderIdentifier}</strong></span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 mb-3">
                  {report.summary}
                </p>

                {report.evidenceNotes && (
                  <div className="text-xs text-slate-600 mb-3 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Notes:</strong> {report.evidenceNotes}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-3 mt-auto flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">
                  {report.demandedAmount ? `Demand: ${report.demandedAmount}` : 'No funds lost'}
                </span>

                <button
                  onClick={() => onUpvoteReport(report.id)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Verify ({report.upvotes})</span>
                </button>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
