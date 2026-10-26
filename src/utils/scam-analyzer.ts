/**
 * Pure forensic scam analysis and triage utility functions.
 * Designed to provide immediate calming guidance, pattern detection,
 * and incident reference code generation.
 */

export interface ScamEvaluation {
  isScam: boolean;
  confidence: number; // 0 - 100
  scamType: ScamCategory;
  categoryTitle: string;
  badgeText: string;
  badgeColor: 'red' | 'amber' | 'blue' | 'green';
  calmingMessage: string;
  howToOvercome: string;
  precautions: string[];
  debunkingFact: string;
  scamTriangle: {
    pressure: string;
    authorityIsolation: string;
    financialDrain: string;
  };
  immediateActions: string[];
  helpline: {
    number: string;
    portal: string;
    actionNote: string;
  };
}

export type ScamCategory =
  | 'DIGITAL_ARREST'
  | 'FEDEX_CUSTOMS'
  | 'APK_MALWARE'
  | 'WORK_FROM_HOME'
  | 'PIG_BUTCHERING'
  | 'BANK_OTP_SPOOF'
  | 'UTILITY_METER'
  | 'UNKNOWN_SUSPICIOUS'
  | 'LEGITIMATE';

export function sanitizeScamInput(raw: string): string {
  if (!raw) return '';
  return raw
    .trim()
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/[\r\n]{3,}/g, '\n\n'); // normalize repeated breaks
}

export function generateIncidentRef(category: string = 'TRI'): string {
  const prefix = category.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TRI-2026-${prefix}-${timestamp}${random}`;
}

export function classifyScamPattern(text: string): ScamEvaluation {
  const lower = text.toLowerCase();

  // 1. Digital Arrest Pattern
  const hasDigitalArrest =
    (lower.includes('digital arrest') ||
      lower.includes('mumbai police') ||
      lower.includes('cbi') ||
      lower.includes('crime branch') ||
      lower.includes('cyber crime') ||
      lower.includes('supreme court') ||
      lower.includes('arrest warrant') ||
      lower.includes('money laundering')) &&
    (lower.includes('skype') ||
      lower.includes('video call') ||
      lower.includes('disconnect') ||
      lower.includes('stay on call') ||
      lower.includes('confidential') ||
      lower.includes('aadhaar') ||
      lower.includes('sim card') ||
      lower.includes('narcotics'));

  if (hasDigitalArrest || lower.includes('digital arrest')) {
    const precautions = [
      'Disconnect the video call immediately. Do not apologize or negotiate.',
      'Block the callers across WhatsApp, Skype, and phone dialers.',
      'Never transfer money to any "RBI verification account" or "court escrow".',
      'Confide in a family member, neighbor, or lawyer right now.',
      'Call 1930 (Cyber Crime Helpline) or report to cybercrime.gov.in.',
    ];
    return {
      isScam: true,
      confidence: 99,
      scamType: 'DIGITAL_ARREST',
      categoryTitle: 'Digital Arrest / Fake Police Summons',
      badgeText: '100% FRAUD',
      badgeColor: 'red',
      calmingMessage:
        'Take a deep breath and relax. You are completely safe. There is no legal concept of "Digital Arrest" under Indian or international law. Real police and courts NEVER interrogate citizens or issue warrants over video calls.',
      howToOvercome:
        'Sever the artificial panic immediately. Hang up the call without hesitation. The scammers rely entirely on theatrical intimidation and fake uniforms. Once you disconnect and speak to anyone outside the call, their power vanishes completely.',
      precautions,
      debunkingFact:
        'LEGAL FACT: Law enforcement agencies (Police, CBI, ED, NIA) are legally prohibited from conducting interrogations or demanding funds via Skype/WhatsApp video calls.',
      scamTriangle: {
        pressure: 'Threatens immediate arrest, police raid at your residence, and public disgrace.',
        authorityIsolation: 'Impersonates IPS officers/judges in staged police booths and forbids you from calling family.',
        financialDrain: 'Demands transferring your bank balance to a "safe government escrow" for financial clearance.',
      },
      immediateActions: precautions,
      helpline: {
        number: '1930',
        portal: 'cybercrime.gov.in',
        actionNote: 'Call 1930 immediately to report the fraud attempts.',
      },
    };
  }

  // 2. FedEx / Customs Narcotics Extortion
  const hasFedExCustoms =
    (lower.includes('fedex') ||
      lower.includes('customs') ||
      lower.includes('dhl') ||
      lower.includes('narcotics') ||
      lower.includes('contraband') ||
      lower.includes('parcel seized') ||
      lower.includes('taiwan') ||
      lower.includes('dubai') ||
      lower.includes('mdma') ||
      lower.includes('passport seized')) &&
    (lower.includes('aadhaar') ||
      lower.includes('police') ||
      lower.includes('drugs') ||
      lower.includes('transfer') ||
      lower.includes('investigation'));

  if (hasFedExCustoms) {
    const precautions = [
      'Hang up the call immediately. Do not press any IVR keypad numbers.',
      'Do not provide your Aadhaar number, PAN, or bank details.',
      'Verify the tracking number independently on official carrier websites if you sent a parcel.',
      'Block the phone number and report it to cyber authorities.',
    ];
    return {
      isScam: true,
      confidence: 98,
      scamType: 'FEDEX_CUSTOMS',
      categoryTitle: 'FedEx / Customs Narcotics Extortion',
      badgeText: 'EXTORTION',
      badgeColor: 'amber',
      calmingMessage:
        'Do not panic. You have not sent any illegal parcel. This is an automated robocall script broadcast to thousands of numbers daily to scare people into fake police transfers.',
      howToOvercome:
        'Hang up immediately. Courier services cannot transfer you to police or narcotics officers. Recognize this as a mass automated extortion template.',
      precautions,
      debunkingFact:
        'COURIER REALITY: Customs and postal agencies never ask for "clearance bonds" or funds transfers to close investigations over the telephone.',
      scamTriangle: {
        pressure: 'Claims a parcel in Taiwan/Dubai contains narcotics or illegal passports under your identity.',
        authorityIsolation: 'Transfers you to a fake "Narcotics Control Bureau" desk to establish false authority.',
        financialDrain: 'Demands an urgent surety bond to cancel the criminal case.',
      },
      immediateActions: precautions,
      helpline: {
        number: '1930',
        portal: 'cybercrime.gov.in',
        actionNote: 'Report caller details to the Indian Cyber Crime Reporting Portal.',
      },
    };
  }

  // 3. Malicious APK & Fake Utility / KYC
  const hasApkMalware =
    lower.includes('.apk') ||
    lower.includes('sideload') ||
    (lower.includes('electricity') && lower.includes('meter')) ||
    (lower.includes('bill') && (lower.includes('disconnect') || lower.includes('9:30 pm') || lower.includes('tonight'))) ||
    (lower.includes('kyc') && (lower.includes('block') || lower.includes('suspend') || lower.includes('update now'))) ||
    lower.includes('anydesk') ||
    lower.includes('teamviewer') ||
    lower.includes('rustdesk');

  if (hasApkMalware) {
    const precautions = [
      'Do not download or open any file ending in .apk sent via message.',
      'If already installed: TURN ON AIRPLANE MODE IMMEDIATELY to stop OTP theft.',
      'Go to Phone Settings > Apps and uninstall the downloaded application.',
      'Call your bank immediately to freeze UPI, debit cards, and netbanking.',
    ];
    return {
      isScam: true,
      confidence: 97,
      scamType: 'APK_MALWARE',
      categoryTitle: 'Malicious APK / Remote Access Trojan',
      badgeText: 'MALWARE ALERT',
      badgeColor: 'blue',
      calmingMessage:
        'Safety first: Do not click the link or install the file. Utility companies and banks never send .apk installation files over WhatsApp or SMS.',
      howToOvercome:
        'Do not interact with the message. Official utility boards do not cut off power without weeks of physical written notices and billing cycles. The urgency is manufactured.',
      precautions,
      debunkingFact:
        'TECHNICAL FACT: Sideloaded APKs are designed to request SMS permissions and forward banking OTPs directly to cyber criminals.',
      scamTriangle: {
        pressure: 'Urgent threats of power outage or account suspension tonight at 9:30 PM.',
        authorityIsolation: 'Impersonates official power supply managers or bank compliance.',
        financialDrain: 'The APK secretly reads your two-factor authentication codes and drains accounts.',
      },
      immediateActions: precautions,
      helpline: {
        number: '1930',
        portal: 'cybercrime.gov.in',
        actionNote: 'Notify your bank within the "Golden Hour" to reverse fraudulent transactions.',
      },
    };
  }

  // 4. Work-from-home / Telegram Task Fraud
  const hasWorkFraud =
    (lower.includes('telegram') || lower.includes('youtube') || lower.includes('hotel review') || lower.includes('google map review') || lower.includes('like and subscribe')) &&
    (lower.includes('part-time') || lower.includes('earn per day') || lower.includes('commission') || lower.includes('prepaid task') || lower.includes('recharge'));

  if (hasWorkFraud) {
    const precautions = [
      'Never transfer money to "unlock salary" or complete "VIP tasks".',
      'Exit and block the Telegram group immediately.',
      'Do not share personal ID or bank account details with anonymous recruiters.',
      'Keep any initial micro-credits, but cease all communication immediately.',
    ];
    return {
      isScam: true,
      confidence: 96,
      scamType: 'WORK_FROM_HOME',
      categoryTitle: 'Telegram Task & Prepaid Review Scam',
      badgeText: 'TASK FRAUD',
      badgeColor: 'amber',
      calmingMessage:
        'Be cautious: Legitimate companies do not pay thousands per day for simply liking videos. This is an advance-fee scam designed to take your money.',
      howToOvercome:
        'Stop engaging. The initial tiny payouts (Rs 150-500) are bait to gain your trust. Cut your losses and do not deposit any money into their recharge schemes.',
      precautions,
      debunkingFact:
        'EMPLOYMENT FACT: No legitimate corporate employer conducts hiring exclusively through anonymous Telegram channels or asks candidates for deposits.',
      scamTriangle: {
        pressure: 'Creates FOMO by showing fake group members celebrating massive payouts.',
        authorityIsolation: 'Operates in isolated Telegram groups where questions are deleted.',
        financialDrain: 'Requires high-value deposits to unlock previously earned commissions.',
      },
      immediateActions: precautions,
      helpline: {
        number: '1930',
        portal: 'cybercrime.gov.in',
        actionNote: 'File a complaint with Telegram handles and UPI IDs used.',
      },
    };
  }

  // 5. Legitimate / low-risk transactional messages
  const isLikelyLegitimate =
    (lower.includes('order delivered') ||
      lower.includes('receipt') ||
      lower.includes('meeting tomorrow') ||
      lower.includes('flight ticket') ||
      lower.includes('welcome to')) &&
    !lower.includes('urgent') &&
    !lower.includes('otp') &&
    !lower.includes('police');

  if (isLikelyLegitimate) {
    return {
      isScam: false,
      confidence: 15,
      scamType: 'LEGITIMATE',
      categoryTitle: 'Legitimate Transaction / Low Risk',
      badgeText: 'VERIFIED LOW RISK',
      badgeColor: 'green',
      calmingMessage:
        'This message does not present the classic coercion or extortion patterns of known scam vectors.',
      howToOvercome:
        'No defensive action is required. Continue to follow standard digital hygiene.',
      precautions: [
        'Always ensure links match official top-level domains before clicking.',
        'Keep two-factor authentication enabled on all your personal accounts.',
      ],
      debunkingFact:
        'ROUTINE NOTICE: Standard informational or transactional notices do not demand urgent fund transfers or secret calls.',
      scamTriangle: {
        pressure: 'None detected. Normal informational flow.',
        authorityIsolation: 'No isolation tactics or secret directives found.',
        financialDrain: 'No extortionate or suspicious transfer requests.',
      },
      immediateActions: [
        'No emergency action required.',
        'Always ensure links match official domains.',
      ],
      helpline: {
        number: '1930',
        portal: 'cybercrime.gov.in',
        actionNote: 'Keep 1930 saved in your contacts for rapid triage if needed.',
      },
    };
  }

  // 6. Default fallback
  const precautions = [
    'Do not click any hyperlinks in unsolicited messages.',
    'Never share OTP, PIN, or CVV with anyone under any circumstances.',
    'Independently verify sender credentials via official public websites.',
  ];

  return {
    isScam: true,
    confidence: 85,
    scamType: 'UNKNOWN_SUSPICIOUS',
    categoryTitle: 'Suspicious Phishing Outreach',
    badgeText: 'SUSPICIOUS',
    badgeColor: 'amber',
    calmingMessage:
      'Exercise caution. This message shows hallmarks of unsolicited cyber outreach. Take a moment to verify independently before taking any action.',
    howToOvercome:
      'Do not act impulsively. Verify claims directly with official organizations using telephone numbers found on their legitimate websites.',
    precautions,
    debunkingFact:
      'SECURITY PRINCIPLE: Never disclose personal data or transfer money based on unsolicited digital messages.',
    scamTriangle: {
      pressure: 'Unsolicited communication demanding rapid attention.',
      authorityIsolation: 'Unverified source operating outside standard customer channels.',
      financialDrain: 'Potential lead-up to financial extraction.',
    },
    immediateActions: precautions,
    helpline: {
      number: '1930',
      portal: 'cybercrime.gov.in',
      actionNote: 'When in doubt, consult 1930 or your local cyber cell.',
    },
  };
}
