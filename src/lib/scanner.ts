import Tesseract from 'tesseract.js';

export interface ScannedData {
  amount: number | null;
  date: Date | null;
  merchant: string | null;
  categoryId: string | null;
  rawText: string;
}

// Helper: Levenshtein distance for fuzzy string matching
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return matrix[a.length][b.length];
}

// Calculate similarity percentage (0 to 100)
function similarity(str1: string, str2: string): number {
  const s1 = str1.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const s2 = str2.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!s1 || !s2) return 0;
  const maxLen = Math.max(s1.length, s2.length);
  const distance = levenshteinDistance(s1, s2);
  return ((maxLen - distance) / maxLen) * 100;
}

// Database of known merchants and their associated keywords for auto-categorization
const KNOWN_MERCHANTS = [
  { name: 'Mercadona', categoryHint: 'Alimentación' },
  { name: 'Carrefour', categoryHint: 'Alimentación' },
  { name: 'Lidl', categoryHint: 'Alimentación' },
  { name: 'Aldi', categoryHint: 'Alimentación' },
  { name: 'Dia', categoryHint: 'Alimentación' },
  { name: 'Consum', categoryHint: 'Alimentación' },
  { name: 'Alcampo', categoryHint: 'Alimentación' },
  { name: 'Eroski', categoryHint: 'Alimentación' },
  { name: 'Repsol', categoryHint: 'Transporte' },
  { name: 'BP', categoryHint: 'Transporte' },
  { name: 'Cepsa', categoryHint: 'Transporte' },
  { name: 'Galp', categoryHint: 'Transporte' },
  { name: 'Zara', categoryHint: 'Ropa' },
  { name: 'Primark', categoryHint: 'Ropa' },
  { name: 'H&M', categoryHint: 'Ropa' },
  { name: 'IKEA', categoryHint: 'Hogar' },
  { name: 'Leroy Merlin', categoryHint: 'Hogar' },
];

export async function scanReceipt(
  imageFile: File | Blob | string, 
  onProgress?: (msg: string, progress: number) => void,
  categories?: any[]
): Promise<ScannedData> {
  
  if (onProgress) onProgress('Iniciando motor OCR...', 0.1);

  const worker = await Tesseract.createWorker('spa', 1, {
    logger: m => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress('Leyendo textos del ticket...', 0.2 + (m.progress * 0.5));
      }
    }
  });
  
  const { data } = await worker.recognize(imageFile as any);
  await worker.terminate();

  if (onProgress) onProgress('Analizando inteligencia...', 0.8);

  const lines = data.text.split('\n').map(l => l.trim()).filter(l => l.length > 2);
  const words = (data as any).words || [];

  // --- 1. EXTRACT MERCHANT (Fuzzy Matching) ---
  let merchant: string | null = null;
  let categoryHint: string | null = null;
  let categoryId: string | null = null;

  // Check first 10 lines for known merchants
  const searchLines = lines.slice(0, 10);
  for (const line of searchLines) {
    for (const known of KNOWN_MERCHANTS) {
      // If line is somewhat long, compare word by word or whole line
      const lineWords = line.split(' ');
      for (const w of lineWords) {
        if (w.length < 3) continue;
        if (similarity(w, known.name) > 80) {
          merchant = known.name;
          categoryHint = known.categoryHint;
          break;
        }
      }
      if (merchant) break;
    }
    if (merchant) break;
  }

  // Fallback: Use the first clean line
  if (!merchant) {
    for (const line of searchLines) {
      const upper = line.toUpperCase();
      if (
        !upper.includes('CIF') && !upper.includes('NIF') && 
        !upper.includes('FACTURA') && !upper.includes('TEL') &&
        !/\d/.test(line) && // Avoid lines with numbers
        line.length > 3
      ) {
        merchant = line.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '').trim().substring(0, 50);
        break;
      }
    }
  }

  // Auto-Categorization based on hint
  if (categoryHint && categories) {
    // Try to find a matching category by fuzzy matching names
    for (const cat of categories) {
      if (similarity(cat.name, categoryHint) > 70 || similarity(cat.name, 'Comida') > 70 || similarity(cat.name, 'Supermercado') > 70) {
        categoryId = cat.id;
        break;
      }
    }
  }

  if (onProgress) onProgress('Calculando importes...', 0.9);

  // --- 2. EXTRACT TOTAL (Bounding Boxes & Heuristics) ---
  let amount: number | null = null;
  
  // Find the word "TOTAL" or variations (e.g. T0TAL, TQTAL) using fuzzy matching
  let totalWordBox: any = null;
  for (const w of words) {
    if (similarity(w.text, 'TOTAL') > 80 || similarity(w.text, 'IMPORTE') > 80) {
      totalWordBox = w.bbox;
      break;
    }
  }

  if (totalWordBox) {
    // We found TOTAL. Look for numbers strictly to the right (x > totalX) and roughly on the same Y axis
    const yMargin = 30; // Acceptable vertical drift
    const potentialNumbers = words.filter((w: any) => {
      // Must be to the right
      if (w.bbox.x0 < totalWordBox.x1) return false;
      // Must be on similar Y axis
      if (Math.abs(w.bbox.y0 - totalWordBox.y0) > yMargin) return false;
      // Must look like a number
      return /\d+[\.,]\d{2}/.test(w.text);
    });

    if (potentialNumbers.length > 0) {
      // Take the right-most number on that line
      const rightMost = potentialNumbers.reduce((prev: any, curr: any) => (curr.bbox.x0 > prev.bbox.x0) ? curr : prev);
      const match = rightMost.text.match(/(\d+[\.,]\d{2})/);
      if (match) {
        amount = parseFloat(match[1].replace(',', '.'));
      }
    }
  }

  // Fallback: If Bounding Box approach failed, use Sanity-Checked Heuristics
  if (!amount) {
    const bottomLines = lines.slice(Math.max(0, lines.length - 20));
    let maxAmount = 0;
    const numRegex = /(\d+[\.,]\d{2})/g;
    
    for (const line of bottomLines) {
      const upper = line.toUpperCase();
      // Sanity Checks: Skip tax lines, cash given, base, etc.
      if (upper.includes('%') || upper.includes('IVA') || upper.includes('BASE') || 
          upper.includes('ENTREGADO') || upper.includes('CAMBIO') || upper.includes('EFECTIVO')) {
        continue;
      }

      let m;
      while ((m = numRegex.exec(line)) !== null) {
        const val = parseFloat(m[1].replace(',', '.'));
        if (val > maxAmount && val < 5000) { // sanity max value
          maxAmount = val;
        }
      }
    }
    if (maxAmount > 0) amount = maxAmount;
  }

  // --- 3. EXTRACT DATE (Strict Verification) ---
  let date: Date | null = null;
  const dateRegex = /(\d{2})[\/\-\.](\d{2})[\/\-\.](\d{2,4})/;
  
  for (const line of lines) {
    const dateMatch = line.match(dateRegex);
    if (dateMatch) {
      const day = parseInt(dateMatch[1], 10);
      const month = parseInt(dateMatch[2], 10) - 1;
      let year = parseInt(dateMatch[3], 10);
      if (year < 100) year += 2000;
      
      // Strict mathematical verification
      if (month >= 0 && month <= 11 && day >= 1 && day <= 31 && year >= 2000 && year <= 2100) {
        const testDate = new Date(year, month, day);
        if (!isNaN(testDate.getTime()) && testDate <= new Date()) {
          date = testDate;
          break;
        }
      }
    }
  }

  if (onProgress) onProgress('¡Hecho!', 1.0);

  return { amount, date, merchant, categoryId, rawText: data.text };
}
