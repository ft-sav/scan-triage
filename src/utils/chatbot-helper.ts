/**
 * Pure helper functions for the Scam Report Chatbot and 3D Cloud dynamics.
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: string;
  analysis?: {
    isScam: boolean;
    confidence: number;
    scamType: string;
    howToOvercome: string;
    precautions: string[];
    canReport: boolean;
    incidentDraft?: {
      category: string;
      platform: string;
      summary: string;
      demandedAmount?: string;
      sender?: string;
    };
  };
}

export function formatTimestamp(date = new Date()): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function extractScamKeySignals(userText: string): {
  detectedCategory: string;
  confidence: number;
  isUrgent: boolean;
} {
  const lower = userText.toLowerCase();

  if (
    lower.includes('digital arrest') ||
    lower.includes('mumbai police') ||
    lower.includes('cbi') ||
    lower.includes('skype') ||
    lower.includes('supreme court')
  ) {
    return {
      detectedCategory: 'Digital Arrest / Fake Police Summons',
      confidence: 99,
      isUrgent: true,
    };
  }

  if (
    lower.includes('fedex') ||
    lower.includes('customs') ||
    lower.includes('narcotics') ||
    lower.includes('contraband') ||
    lower.includes('taiwan') ||
    lower.includes('dubai')
  ) {
    return {
      detectedCategory: 'FedEx / Customs Narcotics Extortion',
      confidence: 98,
      isUrgent: true,
    };
  }

  if (
    lower.includes('.apk') ||
    lower.includes('electricity') ||
    lower.includes('meter') ||
    lower.includes('9:30 pm') ||
    lower.includes('anydesk')
  ) {
    return {
      detectedCategory: 'Malicious APK / Smart Meter Trojan',
      confidence: 97,
      isUrgent: true,
    };
  }

  if (
    lower.includes('telegram') ||
    lower.includes('hotel review') ||
    lower.includes('youtube') ||
    lower.includes('vip task') ||
    lower.includes('daily profit')
  ) {
    return {
      detectedCategory: 'Telegram Task & Prepaid Review Scam',
      confidence: 95,
      isUrgent: false,
    };
  }

  return {
    detectedCategory: 'Suspicious Cold Outreach',
    confidence: 80,
    isUrgent: false,
  };
}

export function calculateCloudPointerDisplacement(
  cloudX: number,
  cloudZ: number,
  pointerX: number,
  pointerZ: number,
  partingStrength: number
): { dx: number; dz: number; distance: number } {
  const diffX = cloudX - pointerX;
  const diffZ = cloudZ - pointerZ;
  const distance = Math.sqrt(diffX * diffX + diffZ * diffZ) || 0.001;
  const radius = 60 * partingStrength;

  if (distance < radius) {
    const force = (1 - distance / radius) * 18 * partingStrength;
    return {
      dx: (diffX / distance) * force,
      dz: (diffZ / distance) * force,
      distance,
    };
  }

  return { dx: 0, dz: 0, distance };
}
