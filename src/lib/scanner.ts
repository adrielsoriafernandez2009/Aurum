import Tesseract from 'tesseract.js';

export interface ScannedData {
  amount: number | null;
  date: Date | null;
  merchant: string | null;
  rawText: string;
}

export async function scanReceipt(imageFile: File, onProgress?: (progress: number) => void): Promise<ScannedData> {
  const worker = await Tesseract.createWorker('spa', 1, {
    logger: m => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(m.progress);
      }
    }
  });
  
  const { data: { text } } = await worker.recognize(imageFile);
  await worker.terminate();

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);
  
  // 1. Merchant: Usually the first non-empty line
  // We clean it up a bit (remove strange characters)
  let merchant = null;
  for (const line of lines) {
    const cleaned = line.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]/g, '').trim();
    if (cleaned.length > 3) {
      merchant = cleaned.substring(0, 50);
      break;
    }
  }

  // 2. Amount: Look for TOTAL, IMPORTE, SUMA
  let amount: number | null = null;
  // This regex looks for keywords, followed by any non-digit chars, then a number like 12.34 or 12,34
  const totalRegex = /(?:TOTAL|IMPORTE|SUMA|PAGAR|VIRTUAL)[^\d]*?(\d+[\.,]\d{2})/i;
  const match = text.match(totalRegex);
  
  if (match) {
    amount = parseFloat(match[1].replace(',', '.'));
  } else {
    // Fallback: look for the largest number with 2 decimals in the bottom half of the lines
    const bottomLines = lines.slice(Math.max(0, lines.length - 15));
    let maxAmount = 0;
    const numRegex = /(\d+[\.,]\d{2})/g;
    bottomLines.forEach(line => {
      let m;
      while ((m = numRegex.exec(line)) !== null) {
        const val = parseFloat(m[1].replace(',', '.'));
        if (val > maxAmount && val < 10000) { // sanity check
          maxAmount = val;
        }
      }
    });
    if (maxAmount > 0) amount = maxAmount;
  }

  // 3. Date: Look for DD/MM/YYYY or DD-MM-YYYY
  let date: Date | null = null;
  const dateRegex = /(\d{2})[\/\-](\d{2})[\/\-](\d{2,4})/;
  const dateMatch = text.match(dateRegex);
  
  if (dateMatch) {
    const day = parseInt(dateMatch[1], 10);
    const month = parseInt(dateMatch[2], 10) - 1;
    let year = parseInt(dateMatch[3], 10);
    if (year < 100) year += 2000;
    
    date = new Date(year, month, day);
    if (isNaN(date.getTime()) || date > new Date()) {
      date = null;
    }
  }

  return { amount, date, merchant, rawText: text };
}
