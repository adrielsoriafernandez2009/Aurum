'use client'

import { useRef, useState, useEffect } from 'react'
import { Scan, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { scanReceipt, ScannedData } from '@/lib/scanner'

export function ScannerButton({ 
  onScanComplete, 
  mobile = false,
  categories = []
}: { 
  onScanComplete: (data: ScannedData) => void, 
  mobile?: boolean,
  categories?: any[]
}) {
  const [isScanning, setIsScanning] = useState(false)
  const [progressMsg, setProgressMsg] = useState('Escaneando...')
  const inputRef = useRef<HTMLInputElement>(null)

  // Pre-process image via Canvas (Binarization & Contrast)
  const preprocessImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas no soportado'))

        // Scale down large images (e.g., from 12MP cameras) to a reasonable max width
        const MAX_WIDTH = 1200
        let scale = 1
        if (img.width > MAX_WIDTH) {
          scale = MAX_WIDTH / img.width
        }
        
        canvas.width = img.width * scale
        canvas.height = img.height * scale

        // Draw and apply binarization/contrast manually
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        
        // Simple binarization and contrast enhancement
        const threshold = 130
        for (let i = 0; i < data.length; i += 4) {
          // Convert to grayscale
          const brightness = (0.34 * data[i]) + (0.5 * data[i + 1]) + (0.16 * data[i + 2])
          // Binarize
          const color = brightness > threshold ? 255 : 0
          data[i] = color     // R
          data[i+1] = color   // G
          data[i+2] = color   // B
          // Alpha data[i+3] remains untouched
        }
        ctx.putImageData(imageData, 0, 0)
        
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Fallo al convertir a blob'))
        }, 'image/jpeg', 0.9)
      }
      img.onerror = () => reject(new Error('Fallo al cargar la imagen'))
      img.src = URL.createObjectURL(file)
    })
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    setProgressMsg('Limpiando imagen...')
    
    try {
      // 1. Image preprocessing
      const processedBlob = await preprocessImage(file)
      const processedUrl = URL.createObjectURL(processedBlob)

      // 2. Scan with heuristics
      const data = await scanReceipt(
        processedUrl, 
        (msg) => setProgressMsg(msg),
        categories
      )
      
      onScanComplete(data)
      URL.revokeObjectURL(processedUrl)
    } catch (error) {
      console.error('Error scanning receipt:', error)
      alert('Error al escanear el ticket')
    } finally {
      setIsScanning(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <>
      <input 
        type="file" 
        accept="image/*"
        capture="environment"
        className="hidden" 
        ref={inputRef}
        onChange={handleFileChange}
      />
      {mobile ? (
        <div className="relative group">
          <button 
            onClick={() => inputRef.current?.click()}
            disabled={isScanning}
            className="flex items-center justify-center w-12 h-12 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 absolute -top-5 left-1/2 -translate-x-1/2 border-4 border-white dark:border-zinc-950"
          >
            {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scan className="w-5 h-5" />}
          </button>
          {isScanning && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-zinc-900 text-white text-[10px] px-3 py-1 rounded-full shadow-xl">
              {progressMsg}
            </div>
          )}
        </div>
      ) : (
        <Button 
          variant="outline" 
          onClick={() => inputRef.current?.click()}
          disabled={isScanning}
          className="rounded-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md transition-all hover:bg-white dark:hover:bg-zinc-900"
        >
          {isScanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Scan className="mr-2 h-4 w-4" />}
          {isScanning ? progressMsg : 'Escanear Ticket'}
        </Button>
      )}
    </>
  )
}
