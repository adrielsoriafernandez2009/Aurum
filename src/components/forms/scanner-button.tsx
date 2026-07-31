'use client'

import { useRef, useState } from 'react'
import { Scan, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { scanReceipt, ScannedData } from '@/lib/scanner'

export function ScannerButton({ onScanComplete, mobile = false }: { onScanComplete: (data: ScannedData) => void, mobile?: boolean }) {
  const [isScanning, setIsScanning] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    try {
      const data = await scanReceipt(file)
      onScanComplete(data)
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
        <button 
          onClick={() => inputRef.current?.click()}
          disabled={isScanning}
          className="flex items-center justify-center w-12 h-12 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 absolute -top-5 left-1/2 -translate-x-1/2 border-4 border-white dark:border-zinc-950"
        >
          {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scan className="w-5 h-5" />}
        </button>
      ) : (
        <Button 
          variant="outline" 
          onClick={() => inputRef.current?.click()}
          disabled={isScanning}
          className="rounded-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md transition-all hover:bg-white dark:hover:bg-zinc-900"
        >
          {isScanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Scan className="mr-2 h-4 w-4" />}
          {isScanning ? 'Escaneando...' : 'Escanear Ticket'}
        </Button>
      )}
    </>
  )
}
