const SECRET_SALT = "ARGON_CINEMA_SECURE_HMAC_SALT_2026";

export async function generateTicketSignature(
  ticketId: string,
  showtimeId: string,
  price: number,
  issuedAt: string
): Promise<string> {
  const data = `${ticketId}|${showtimeId}|${price}|${issuedAt}|${SECRET_SALT}`;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex.substring(0, 16);
    } catch {
      // Fallback
    }
  }
  
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

export function formatQrPayload(ticket: {
  id: string;
  showtimeId: string;
  price: number;
  signature: string;
}): string {
  return `ARGON-V1|${ticket.id}|${ticket.showtimeId}|${ticket.price}|${ticket.signature}`;
}

export function parseScannedPayload(raw: string): {
  ticketId: string;
  showtimeId?: string;
  signature?: string;
  raw: string;
} {
  const clean = raw.trim();
  if (clean.startsWith('ARGON-V1|')) {
    const parts = clean.split('|');
    return {
      ticketId: parts[1] || '',
      showtimeId: parts[2] || '',
      signature: parts[4] || '',
      raw: clean,
    };
  }
  return {
    ticketId: clean,
    raw: clean,
  };
}

export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 500);
}
