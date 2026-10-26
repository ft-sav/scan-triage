import { useState } from 'react';
import { ArrowUpRight, Shield, AlertTriangle, Smartphone, ChevronDown, ChevronUp } from 'lucide-react';
import { ScrollReveal } from './ScrollRevealText';

interface CommonFraudMatrixProps {
  onSelectSampleForAnalysis: (sampleText: string) => void;
}

export function CommonFraudMatrix({
  onSelectSampleForAnalysis,
}: CommonFraudMatrixProps) {
  const [showExtended, setShowExtended] = useState(false);

  const primaryCards = [
    {
      index: '01',
      badge: 'High Extortion',
      badgeBg: 'bg-red-100 text-red-800 border-red-200',
      title: 'Digital Arrest / Fake Police',
      body: 'Scammers pose as Mumbai Police, CBI, Cyber Crime Unit, or Supreme Court officials over Skype/WhatsApp video calls. They claim illegal SIM cards or parcels exist in your name and forbid disconnecting under threat of immediate physical arrest.',
      immediateAction:
        'Disconnect immediately. Indian police and courts NEVER conduct interrogations or issue bail demands via video call.',
      sampleSnippet:
        'Notice of Digital Arrest from Mumbai Police Cyber Cell: Your Aadhaar was used in 16 fraudulent bank accounts linked to narcotics laundering. You must remain on continuous Skype video surveillance until clearance deposit is sent to RBI verified escrow.',
    },
    {
      index: '02',
      badge: 'Customs Extortion',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      title: 'FedEx / Customs Narcotics Parcel',
      body: 'Automated robocalls or SMS claim that a parcel sent to Taiwan or Dubai contains illegal drugs, fake passports, or contraband tied to your Aadhaar card, transferring you to fake narcotics officers demanding clearance surety funds.',
      immediateAction:
        'Hang up immediately. FedEx, postal, and customs services never demand "clearance verification fees" to close criminal cases.',
      sampleSnippet:
        'FedEx Automated Dispatch: Your parcel #FX-9921 to Taiwan has been intercepted by customs. Contraband 140g MDMA and 5 passports found tied to your Aadhaar. Press 1 to connect to Narcotics Control Bureau officer.',
    },
    {
      index: '03',
      badge: 'Malware Risk',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
      title: 'APK WhatsApp & Fake KYC',
      body: 'Urgent messages threatening electricity meter disconnection tonight or bank KYC suspension, instructing you to install an ".apk" file sent directly over WhatsApp or SMS.',
      immediateAction:
        'Never install APK files outside official app stores. Turn on Airplane Mode immediately if installed to block SMS OTP interception.',
      sampleSnippet:
        'URGENT ADVISORY: Your electricity bill balance of Rs 148 is unpaid. Meter connection will be disconnected tonight at 9:30 PM. Download and install BSES_Bill_Update.apk from the link below to resolve immediately.',
    },
  ];

  const extendedCards = [
    {
      index: '04',
      badge: 'Advance-Fee Scam',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
      title: 'Telegram Task & Review Fraud',
      body: 'Recruiters promise high daily earnings (₹3,000–₹10,000) for rating Google Maps hotels or liking YouTube videos. Tiny initial payouts build trust before demanding massive "VIP deposits".',
      immediateAction:
        'Never deposit money to unlock salary. Exit the Telegram group immediately; cheering members are automated bots.',
      sampleSnippet:
        'Part-time job offer: Earn Rs 5,000 daily by simply rating 5-star hotels on Google Maps. Complete 3 trial tasks to receive instant Rs 300 via UPI. Join our Telegram VIP channel.',
    },
    {
      index: '05',
      badge: 'Investment Fraud',
      badgeBg: 'bg-pink-100 text-pink-800 border-pink-200',
      title: 'Pig Butchering (Sha Zhu Pan)',
      body: 'Friendly strangers on WhatsApp or dating apps claim insider knowledge on crypto or gold trading platforms. Fabricated trading charts show massive profits, but withdrawals are blocked by high "tax" demands.',
      immediateAction:
        'Never send crypto or money to unverified platforms recommended by online contacts. Cut off communication.',
      sampleSnippet:
        'Hi, sorry to disturb you, is this Mr. David? Oh wrong number! But you seem so polite. By the way, I trade gold futures using my uncle\'s algorithmic signals, making 15% daily profit. Would you like me to guide you?',
    },
    {
      index: '06',
      badge: 'Remote Access Trojan',
      badgeBg: 'bg-teal-100 text-teal-800 border-teal-200',
      title: 'AnyDesk / Screen Share Theft',
      body: 'Impostors claiming to assist with bank refunds, courier delivery, or airline tickets instruct you to install AnyDesk or TeamViewer, monitoring your screen while you enter netbanking passwords.',
      immediateAction:
        'Never grant remote desktop access to unknown callers. Disconnect internet immediately if installed.',
      sampleSnippet:
        'Customer Care Refund Desk: To process your Rs 4,999 refund for cancelled flight, kindly install AnyDesk from Play Store and provide the 9-digit code to allow our technician to authenticate your account.',
    },
  ];

  const allCards = showExtended ? [...primaryCards, ...extendedCards] : primaryCards;

  return (
    <section id="types-of-fraud" className="w-full max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <ScrollReveal delay={0.1} direction="down">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Threat Intelligence &amp; Countermeasures
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.15} direction="up">
          <h2 className="font-grotesk text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-3 mb-2">
            Common Scam Types
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2} direction="none">
          <p className="text-slate-600 text-sm max-w-2xl mx-auto">
            Recognize the standard script before artificial fear dictates your next move.
          </p>
        </ScrollReveal>
      </div>

      {/* Clean 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCards.map((card, i) => (
          <ScrollReveal key={card.index} delay={0.1 + (i % 3) * 0.1} direction="up" duration={0.7}>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between h-full hover:border-slate-300 transition-all">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <span className="font-mono font-bold text-sm text-slate-400">
                    #{card.index}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${card.badgeBg}`}
                  >
                    {card.badge}
                  </span>
                </div>

                <h3 className="font-grotesk font-bold text-lg text-slate-900 mb-2">
                  {card.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {card.body}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-auto space-y-3">
                <div className="text-xs leading-relaxed text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <strong className="text-red-700">Immediate Action:</strong>{' '}
                  {card.immediateAction}
                </div>

                <button
                  onClick={() => onSelectSampleForAnalysis(card.sampleSnippet)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer group"
                >
                  <span>Check this scenario in AI</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => setShowExtended(!showExtended)}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
        >
          <span>{showExtended ? 'Show Fewer Types' : 'Show More Scams (Task, Crypto, Screen Share)'}</span>
          {showExtended ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>
    </section>
  );
}
