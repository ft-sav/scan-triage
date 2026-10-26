/**
 * Pure Deterministic Triage Engine & Client-Side PII Redactor
 * Implements redactor, rule hits engine, and verdict calculators.
 */

export interface ReportedIncident {
  id: string;
  refCode: string;
  timestamp: string;
  category: string;
  sourcePlatform: string;
  summary: string;
  demandedAmount?: string;
  senderIdentifier: string;
  severity: string;
  status: string;
  evidenceNotes: string;
  upvotes: number;
}

export interface RedactionResult {
  redactedText: string;
  maskedCount: number;
  maskedTypes: {
    aadhaar: number;
    card: number;
    pan: number;
    otp: number;
  };
}

export interface RuleHit {
  id: string;
  category: string;
  label: string;
  weight: number;
  evidence: string;
  why: string;
}

export interface RuleEngineResult {
  rule_hits: RuleHit[];
  deterministic_score: number;
  inferred_scam_type: string;
  is_control_message: boolean;
}

export type ScamType =
  | 'DIGITAL_ARREST_IMPERSONATION'
  | 'UPI_COLLECT_OR_REFUND'
  | 'FAKE_JOB_OR_INTERNSHIP'
  | 'KYC_OR_BANK_PHISHING'
  | 'PARCEL_OR_CUSTOMS'
  | 'INVESTMENT_OR_TRADING'
  | 'LOTTERY_OR_PRIZE'
  | 'TECH_SUPPORT_REMOTE_ACCESS'
  | 'SEXTORTION_BLACKMAIL'
  | 'LOAN_APP_HARASSMENT'
  | 'OTHER'
  | 'NONE';

export interface RedFlag {
  label: string;
  evidence: string;
  why: string;
}

export interface TriageEvaluation {
  risk_score: number; // 0-100
  scam_type: ScamType;
  confidence: 'low' | 'medium' | 'high';
  verdict_label: string; // "NO RED FLAGS FOUND - still verify" | "SUSPICIOUS" | "SCAM LIKELY"
  summary: string;
  red_flags: RedFlag[];
  scammer_goal: string;
  next_10_minutes: string[];
  if_already_paid: string[];
  do_not: string[];
  safe_reply: string;
  rule_hits?: RuleHit[];
  scam_triangle?: {
    pressure_urgency: string;
    fake_authority: string;
    financial_extraction: string;
  };
  investigator_feedback?: string;
  source: 'gemini' | 'rules-fallback' | 'sample-cache';
  maskedCount?: number;
}

/**
 * Client-Side PII Redaction
 * Masks Aadhaar, credit/debit cards, PAN cards, and OTP codes before scanning.
 */
export function redactSensitiveData(input: string): RedactionResult {
  let text = input;
  let aadhaarCount = 0;
  let cardCount = 0;
  let panCount = 0;
  let otpCount = 0;

  // 1. PAN-like pattern (5 letters + 4 digits + 1 letter, e.g. ABCDE1234F)
  text = text.replace(/\b[A-Za-z]{5}[0-9]{4}[A-Za-z]\b/g, () => {
    panCount++;
    return '[PAN-MASKED]';
  });

  // 2. Card-like numbers (13 to 19 digits, with optional spaces/hyphens)
  text = text.replace(/\b(?:\d{4}[-\s]?){3}\d{1,7}\b|\b\d{13,19}\b/g, () => {
    cardCount++;
    return '[CARD-MASKED]';
  });

  // 3. Aadhaar-like numbers (12 digits, often 4-4-4)
  text = text.replace(/\b(?:\d{4}[-\s]?){2}\d{4}\b|\b\d{12}\b/g, () => {
    aadhaarCount++;
    return '[AADHAAR-MASKED]';
  });

  // 4. OTP / PIN / Code numbers (4-8 digits right after trigger words)
  text = text.replace(
    /(\b(?:OTP|PIN|code|verification\s*code|passcode)\b[:\s\-—=]*)([0-9]{4,8})\b/gi,
    (_match, prefix) => {
      otpCount++;
      return `${prefix}[OTP-MASKED]`;
    }
  );

  const totalMasked = aadhaarCount + cardCount + panCount + otpCount;

  return {
    redactedText: text,
    maskedCount: totalMasked,
    maskedTypes: {
      aadhaar: aadhaarCount,
      card: cardCount,
      pan: panCount,
      otp: otpCount,
    },
  };
}

/**
 * Server-Side Deterministic Rule Engine
 */
export function evaluateRules(text: string): RuleEngineResult {
  const hits: RuleHit[] = [];
  const lower = text.toLowerCase();

  // Check if it's a legitimate control debit/credit alert:
  // e.g. "YourBank Alert: INR 1,250.00 debited ... never share your OTP"
  const hasDebitCreditAlert =
    (lower.includes('debited from') || lower.includes('credited to') || lower.includes('inr') || lower.includes('a/c xx')) &&
    (lower.includes('never share') || lower.includes('sms block to') || lower.includes('avail bal'));

  const hasMaliciousPayload =
    lower.includes('bit.ly') ||
    lower.includes('enter card number') ||
    lower.includes('cvv') ||
    lower.includes('verification account') ||
    lower.includes('police clearance') ||
    lower.includes('approve') ||
    lower.includes('digital arrest') ||
    lower.includes('illegal items');

  if (hasDebitCreditAlert && !hasMaliciousPayload) {
    return {
      rule_hits: [],
      deterministic_score: 5,
      inferred_scam_type: 'NONE',
      is_control_message: true,
    };
  }

  // 1. Digital Arrest / Fake Police / Supreme Court
  const arrestMatches = [
    'digital arrest',
    'mumbai police',
    'delhi police',
    'cyber crime branch',
    'cbi',
    'customs',
    'narcotics',
    'arrest warrant',
    'mdma',
    'illegal items',
    'supreme court',
    'dcp',
  ].filter((k) => lower.includes(k));

  if (arrestMatches.length > 0) {
    const evidence = findExactSnippet(text, arrestMatches[0]);
    hits.push({
      id: 'THREAT_ARREST_IMPERSONATION',
      category: 'Authority Impersonation & Coercion',
      label: 'Digital Arrest / Agency Impersonation',
      weight: 40,
      evidence,
      why: 'Police and courts NEVER conduct video investigations or arrest citizens digitally.',
    });
  }

  // 2. Video Call / Closed Room / Stay on Call
  const videoMatches = [
    'video call',
    'skype',
    'stay on the call',
    'stay on call',
    'closed room',
    'do not disconnect',
    'whatsapp video',
  ].filter((k) => lower.includes(k));

  if (videoMatches.length > 0) {
    const evidence = findExactSnippet(text, videoMatches[0]);
    hits.push({
      id: 'ISOLATION_VIDEO_CALL',
      category: 'Psychological Isolation',
      label: 'Demanding Video Call & Secrecy',
      weight: 25,
      evidence,
      why: 'Scammers force victims onto video calls in isolation to prevent outside consultation.',
    });
  }

  // 3. Do not tell anyone / Secrecy
  const secrecyMatches = [
    'don\'t tell anyone',
    'dont tell anyone',
    'do not tell anyone',
    'confidential investigation',
    'national security',
    'keep secret',
  ].filter((k) => lower.includes(k));

  if (secrecyMatches.length > 0) {
    const evidence = findExactSnippet(text, secrecyMatches[0]);
    hits.push({
      id: 'COERCION_SECRECY',
      category: 'Secrecy Manipulation',
      label: 'Demanding Strict Secrecy',
      weight: 20,
      evidence,
      why: 'Insisting on secrecy prevents victims from checking with family, friends, or authorities.',
    });
  }

  // 4. Safe Verification Account / Escrow / Move Money
  const safeAccMatches = [
    'verification account',
    'safe account',
    'rbi safe',
    'escrow account',
    'move money',
    'transfer rs',
  ].filter((k) => lower.includes(k));

  if (safeAccMatches.length > 0) {
    const evidence = findExactSnippet(text, safeAccMatches[0]);
    hits.push({
      id: 'DRAIN_SAFE_ACCOUNT',
      category: 'Financial Extortion',
      label: 'Transfer to "Verification Account"',
      weight: 35,
      evidence,
      why: 'No government body or bank operates "safe verification accounts" for funds transfer.',
    });
  }

  // 5. UPI Collect / Approve Request / Mistake Refund
  const upiMatches = [
    'approve',
    'approve payment request',
    'sent by mistake',
    'by mistake',
    'enter your upi pin to receive',
    'upi pin to receive',
    'receive your refund back',
    'collect request',
    'payment request',
  ].filter((k) => lower.includes(k));

  if (upiMatches.length > 0) {
    const evidence = findExactSnippet(text, upiMatches[0]);
    hits.push({
      id: 'UPI_COLLECT_REVERSAL',
      category: 'UPI Protocol Exploitation',
      label: 'UPI Collect / Fake Refund Trap',
      weight: 35,
      evidence,
      why: 'Entering your UPI PIN always DEBITS money. You NEVER need to enter a PIN to receive funds.',
    });
  }

  // 6. Fake Internship / Job / Upfront Clearance Fee
  const jobMatches = [
    'internship',
    'stipend',
    'offer letter',
    'police clearance certificate',
    'clearance fee',
    'security deposit',
    'registration charge',
    'pay within 2 hours',
  ].filter((k) => lower.includes(k));

  if (jobMatches.length >= 2) {
    const evidence = findExactSnippet(text, jobMatches[0]);
    hits.push({
      id: 'JOB_UPFRONT_FEE',
      category: 'Employment Fraud',
      label: 'Upfront Fee for Internship / Job',
      weight: 30,
      evidence,
      why: 'Genuine employers never demand money via UPI for job offers, ID cards, or clearance.',
    });
  }

  // 7. Free Email domain for official offers
  const freemailMatches = [
    '@gmail.com',
    '@yahoo.com',
    '@hotmail.com',
    '@outlook.com',
  ].filter((k) => lower.includes(k));

  if (freemailMatches.length > 0 && (lower.includes('hr') || lower.includes('careers') || lower.includes('intern') || lower.includes('job') || lower.includes('bank'))) {
    const evidence = findExactSnippet(text, freemailMatches[0]);
    hits.push({
      id: 'FREEMAIL_OFFICIAL_IMPERSONATION',
      category: 'Sender Deception',
      label: 'Free Email for Corporate Offer',
      weight: 20,
      evidence,
      why: 'Legitimate corporate recruiters use verified company domain emails, not free webmail.',
    });
  }

  // 8. Urgent Block / KYC Penalty Threat
  const kycMatches = [
    'will be blocked today',
    'blocked today',
    'suspended today',
    'incomplete pan kyc',
    'pan kyc',
    'avoid rs',
    'penalty',
    'update immediately',
  ].filter((k) => lower.includes(k));

  if (kycMatches.length > 0) {
    const evidence = findExactSnippet(text, kycMatches[0]);
    hits.push({
      id: 'KYC_BLOCK_THREAT',
      category: 'Urgency & Intimidation',
      label: 'Urgent KYC Block Threat',
      weight: 30,
      evidence,
      why: 'Banks give weeks of formal notice and never freeze accounts abruptly via single SMS.',
    });
  }

  // 9. Shortened or Lookalike URL
  const linkMatches = [
    'bit.ly',
    'tinyurl.com',
    'is.gd',
    't.co',
    'cutt.ly',
    '.apk',
    'goo.gl',
  ].filter((k) => lower.includes(k));

  if (linkMatches.length > 0) {
    const evidence = findExactSnippet(text, linkMatches[0]);
    hits.push({
      id: 'SHORTENED_URL_PHISHING',
      category: 'Credential Siphoning',
      label: 'Shortened / Masked URL',
      weight: 25,
      evidence,
      why: 'Shortened links hide malicious phishing forms designed to steal banking credentials.',
    });
  }

  // 10. Direct Card / CVV / Expiry request
  const cardReqMatches = [
    'cvv',
    'card number',
    'expiry',
    'atm pin',
    'otp',
  ].filter((k) => lower.includes(k));

  if (cardReqMatches.length >= 2 || (cardReqMatches.includes('cvv') && lower.includes('card'))) {
    const evidence = findExactSnippet(text, cardReqMatches[0]);
    hits.push({
      id: 'CREDENTIAL_HARVEST_CVV',
      category: 'Credential Theft',
      label: 'Demanding CVV / Card Expiry',
      weight: 35,
      evidence,
      why: 'No bank or genuine gateway asks for card number and CVV over an unverified SMS form.',
    });
  }

  // 11. Remote Access Software
  const remoteMatches = [
    'anydesk',
    'teamviewer',
    'quicksupport',
    'rustdesk',
  ].filter((k) => lower.includes(k));

  if (remoteMatches.length > 0) {
    const evidence = findExactSnippet(text, remoteMatches[0]);
    hits.push({
      id: 'REMOTE_ACCESS_MALWARE',
      category: 'Device Compromise',
      label: 'Remote Access App Installation',
      weight: 40,
      evidence,
      why: 'Installing remote tools allows scammers to hijack your phone screen and intercept banking OTPs.',
    });
  }

  // Calculate sum of weights, capped at 100
  const totalWeight = hits.reduce((acc, h) => acc + h.weight, 0);
  const score = Math.min(100, Math.max(0, totalWeight));

  // Determine inferred scam type
  let inferredType: ScamType = 'OTHER';
  if (arrestMatches.length > 0 || videoMatches.length > 0) {
    inferredType = 'DIGITAL_ARREST_IMPERSONATION';
  } else if (upiMatches.length > 0) {
    inferredType = 'UPI_COLLECT_OR_REFUND';
  } else if (jobMatches.length > 0) {
    inferredType = 'FAKE_JOB_OR_INTERNSHIP';
  } else if (kycMatches.length > 0 || linkMatches.length > 0) {
    inferredType = 'KYC_OR_BANK_PHISHING';
  } else if (remoteMatches.length > 0) {
    inferredType = 'TECH_SUPPORT_REMOTE_ACCESS';
  } else if (score < 25) {
    inferredType = 'NONE';
  }

  return {
    rule_hits: hits,
    deterministic_score: score,
    inferred_scam_type: inferredType,
    is_control_message: false,
  };
}

/**
 * Finds an exact substring snippet from original text surrounding a match keyword
 */
export function findExactSnippet(originalText: string, keyword: string, maxLen = 100): string {
  const lower = originalText.toLowerCase();
  const idx = lower.indexOf(keyword.toLowerCase());
  if (idx === -1) {
    return originalText.slice(0, maxLen);
  }

  const start = Math.max(0, idx - 15);
  const end = Math.min(originalText.length, idx + keyword.length + 45);
  let snippet = originalText.slice(start, end).trim();

  // If clipped, format cleanly
  if (start > 0) snippet = '...' + snippet;
  if (end < originalText.length) snippet = snippet + '...';

  return snippet.slice(0, maxLen);
}

/**
 * Validate that a red flag's evidence actually exists inside the user's text.
 * Drops hallucinated or unquoted evidence.
 */
export function validateRedFlagsAgainstText(
  redFlags: RedFlag[],
  userText: string
): RedFlag[] {
  const normUserText = userText.toLowerCase().replace(/\s+/g, ' ');

  return redFlags.filter((rf) => {
    if (!rf.evidence || rf.evidence.trim().length === 0) return false;
    // Clean snippet of leading/trailing dots or quotes
    const cleanEvidence = rf.evidence
      .replace(/^\.\.\.|\.\.\.$/g, '')
      .replace(/^["']|["']$/g, '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');

    if (cleanEvidence.length < 3) return false;

    // Check if substring exists in normalized user text
    return normUserText.includes(cleanEvidence);
  });
}

/**
 * Get verdict category label based on thresholds
 */
export function getVerdictLabel(score: number): string {
  if (score < 25) {
    return 'NO RED FLAGS FOUND - still verify';
  }
  if (score <= 59) {
    return 'SUSPICIOUS';
  }
  return 'SCAM LIKELY';
}
