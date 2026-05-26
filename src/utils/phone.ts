/**
 * Helper to normalize and format a raw phone string into a Brazilian styled phone format: (DDD) XXXXX-XXXX
 */
export function formatPhoneNumber(phoneStr: string): string {
  // Remove non-digit characters
  const cleaned = phoneStr.replace(/\D/g, '');
  
  if (!cleaned) return phoneStr;

  // If starts with 55 (DDI for Brazil) and is 12 or 13 digits long, we can format it
  if (cleaned.startsWith('55') && (cleaned.length === 12 || cleaned.length === 13)) {
    const ddd = cleaned.slice(2, 4);
    const rest = cleaned.slice(4);
    if (rest.length === 9) {
      return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
    } else {
      return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
    }
  }

  // If length is 11 (e.g. 51999172765)
  if (cleaned.length === 11) {
    const ddd = cleaned.slice(0, 2);
    return `(${ddd}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }

  // If length is 10 (e.g. 5130004000)
  if (cleaned.length === 10) {
    const ddd = cleaned.slice(0, 2);
    return `(${ddd}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }

  // Fallback: if it's 9 digits
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }

  return phoneStr;
}

/**
 * Returns a robust WhatsApp URL for the target phone number, ensuring the DDI prefix (55) is included
 * if it's a Brazilian phone format (10 or 11 digits without DDI).
 */
export function getWhatsAppUrl(phoneStr: string, text?: string): string {
  const cleaned = phoneStr.replace(/\D/g, '');
  if (!cleaned) return '';

  // If it doesn't already start with 55 (and length is 10 or 11), prefix with 55 for Brazil
  const hasDdi = cleaned.startsWith('55') && cleaned.length >= 12;
  const finalPhone = hasDdi ? cleaned : `55${cleaned}`;
  
  const baseUrl = `https://api.whatsapp.com/send?phone=${finalPhone}`;
  if (text) {
    return `${baseUrl}&text=${encodeURIComponent(text)}`;
  }
  return baseUrl;
}
