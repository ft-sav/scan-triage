import React from 'react';

export interface SampleCartridge {
  id: string;
  cartridgeLabel: string;
  cartridgeColor: string;
  tag: string;
  title: string;
  text: string;
}

export const SAMPLE_CARTRIDGES: SampleCartridge[] = [
  {
    id: 'sample-1',
    cartridgeLabel: 'CART-01',
    cartridgeColor: '#FF3EA5', // hot pink
    tag: 'EXTORTION',
    title: 'DIGITAL ARREST CALL',
    text: "Caller claimed to be DCP Cyber Crime Mumbai & CBI officer Vikram Sharma. Said FedEx courier parcel with 5 fake passports and 140g MDMA was intercepted in Taiwan in my name. Demanded I stay on Skype video call in a closed room, don't tell anyone, and transfer Rs 4,80,000 to RBI safe verification escrow account or arrest warrant will be executed today.",
  },
  {
    id: 'sample-2',
    cartridgeLabel: 'CART-02',
    cartridgeColor: '#FFE600', // sunny yellow
    tag: 'JOB FRAUD',
    title: 'FAKE INTERNSHIP OFFER',
    text: "Congratulations! Selected for Web Development Internship at Apex Tech Labs. Stipend: Rs 15,000/month. To finalize your offer letter and ID card, send Rs 2,000 via UPI to hr.clearance@okaxis for Police Clearance Certificate. Mandatory to pay within 2 hours or offer will be cancelled. Regards, Anjali Sharma (careers.interns.hr99@gmail.com)",
  },
  {
    id: 'sample-3',
    cartridgeLabel: 'CART-03',
    cartridgeColor: '#00E5FF', // electric cyan
    tag: 'UPI TRICK',
    title: 'UPI REFUND TRICK',
    text: "Hi brother, by mistake I transferred Rs 4,500 to your Google Pay number instead of my brother's school fee. Please I am sending a payment request on PhonePe, kindly click approve and enter your UPI PIN to receive your refund back immediately.",
  },
  {
    id: 'sample-4',
    cartridgeLabel: 'CART-04',
    cartridgeColor: '#FF3EA5', // hot pink
    tag: 'PHISHING',
    title: 'KYC BLOCK SMS',
    text: "Dear customer, YourBank NetBanking and debit card will be blocked TODAY due to incomplete PAN KYC. Update immediately to avoid Rs 5000 penalty: bit.ly/yrbk-kyc-now Enter card number, expiry, CVV and submit.",
  },
  {
    id: 'sample-5',
    cartridgeLabel: 'CART-05',
    cartridgeColor: '#B6FF00', // acid lime
    tag: 'CONTROL TEST',
    title: 'REAL BANK ALERT',
    text: "YourBank Alert: INR 1,250.00 debited from A/c XX4891 on 24-OCT at POS SUPERMART. Avail bal INR 34,820.50. If not done by you, SMS BLOCK to 56767. Remember: YourBank never asks for OTP, PIN or password.",
  },
];

interface CartridgeBarProps {
  onSelectSample: (text: string) => void;
  isLoading: boolean;
}

export const CartridgeBar: React.FC<CartridgeBarProps> = ({ onSelectSample, isLoading }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[10px] sm:text-[11px] text-[var(--ink)] uppercase tracking-wider leading-relaxed">
            PICK A SAMPLE FRAUD MESSAGE TO TEST OR TYPE A SAMPLE MESSAGE ON SCAN.EXE BELOW
          </span>
          <span className="bg-[#FFE600] border-2 border-[var(--ink)] px-1.5 py-0.5 font-pixel text-[9px] text-[#1A1033] shadow-[2px_2px_0px_var(--ink)]">
            1-CLICK TEST
          </span>
        </div>
        <span className="font-vt text-sm text-[#7B2FFF] dark:text-[#00E5FF] hidden sm:inline">
          [READY FOR JUDGE BENCHMARK]
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
        {SAMPLE_CARTRIDGES.map((cart) => (
          <button
            key={cart.id}
            type="button"
            disabled={isLoading}
            onClick={() => onSelectSample(cart.text)}
            className="cartridge-btn bg-[var(--paper)] text-left p-2.5 flex flex-col justify-between h-[105px] group cursor-pointer"
            style={{ borderTop: `6px solid ${cart.cartridgeColor}` }}
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span
                  className="font-pixel text-[8px] px-1 py-0.5 border border-[var(--ink)] text-[#1A1033] font-bold"
                  style={{ backgroundColor: cart.cartridgeColor }}
                >
                  {cart.cartridgeLabel}
                </span>
                <span className="font-pixel text-[7px] text-[var(--ink)]/70">
                  {cart.tag}
                </span>
              </div>
              <div className="font-pixel text-[9px] text-[var(--ink)] leading-tight line-clamp-2 mt-1">
                {cart.title}
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--ink)]/20 flex items-center justify-between">
              <span className="font-vt text-xs text-[#7B2FFF] dark:text-[#00E5FF] group-hover:text-[#FF3EA5]">
                INSERT &gt;&gt;
              </span>
              <span className="text-[10px] font-pixel text-[var(--ink)]">
                {cart.id === 'sample-5' ? '🟢 0 FLAGS' : '⚠️ FRAUD'}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
