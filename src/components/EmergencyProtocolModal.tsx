import { X, PhoneCall, AlertTriangle, ShieldCheck } from 'lucide-react';

interface EmergencyProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmergencyProtocolModal({
  isOpen,
  onClose,
}: EmergencyProtocolModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-red-50/50 rounded-t-xl">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-grotesk font-bold text-lg text-slate-900">
              Golden Hour Emergency Protocol
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200/50 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-xs text-slate-700 space-y-5">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-900">
            <h4 className="font-grotesk font-bold text-sm text-red-800 mb-1">
              Do not panic. Act methodically within the first 2 hours.
            </h4>
            <p className="leading-relaxed">
              In financial cyber fraud, the first 2 hours are the &quot;Golden Period&quot;. Banking nodal officers and cyber police can freeze the recipient’s mule account before cash is withdrawn.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-lg border border-red-200 bg-red-50/30">
              <span className="font-bold text-red-800 text-xs block mb-1">
                1. Dial 1930 Immediately (National Cyber Helpline - India)
              </span>
              <p className="text-slate-700 leading-relaxed">
                Provide your bank name, account number, transaction reference (UTR / UPI Ref ID), and time of transfer. 1930 enters this into the CFCFRMS system to freeze destination accounts.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-900 text-xs block mb-1">
                2. Call Your Bank’s 24x7 Emergency Fraud Number
              </span>
              <p className="text-slate-700 leading-relaxed">
                Call the number on the back of your card. Request an immediate &quot;Fraudulent Transaction Dispute&quot; and freeze on netbanking and UPI to stop further deductions.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-900 text-xs block mb-1">
                3. If an .APK or AnyDesk Was Installed: Turn on Airplane Mode
              </span>
              <p className="text-slate-700 leading-relaxed">
                Sever cellular and Wi-Fi access immediately so remote trojans cannot forward incoming SMS OTPs. Go to Phone Settings &gt; Apps and uninstall the application.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/30">
              <span className="font-bold text-emerald-800 text-xs block mb-1">
                4. Lodge an Official FIR at cybercrime.gov.in
              </span>
              <p className="text-slate-700 leading-relaxed">
                Filing an online complaint at cybercrime.gov.in generates an acknowledgment receipt required by banks for dispute settlement.
              </p>
            </div>
          </div>

          {/* International Helplines */}
          <div className="border-t border-slate-100 pt-3">
            <span className="font-semibold text-slate-500 uppercase tracking-wider block mb-2 text-[11px]">
              International Fraud Directories:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 rounded border border-slate-200 bg-slate-50">
                <strong>India:</strong> 1930
              </div>
              <div className="p-2 rounded border border-slate-200 bg-slate-50">
                <strong>USA:</strong> IC3.gov / FTC
              </div>
              <div className="p-2 rounded border border-slate-200 bg-slate-50">
                <strong>UK:</strong> 0300 123 2040
              </div>
              <div className="p-2 rounded border border-slate-200 bg-slate-50">
                <strong>Australia:</strong> ReportCyber
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
