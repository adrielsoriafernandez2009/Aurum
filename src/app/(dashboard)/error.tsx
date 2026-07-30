'use client'

import { useEffect } from 'react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Opcionalmente registrar el error en algún servicio
    console.error("ERROR CAPTURADO POR BOUNDARY:", error)
  }, [error])

  return (
    <div className="p-8 max-w-3xl mx-auto mt-12 bg-red-50 dark:bg-red-950/30 rounded-2xl border border-red-200 dark:border-red-900 text-red-900 dark:text-red-200 font-mono text-sm shadow-xl animate-in fade-in zoom-in duration-300">
      <h3 className="font-bold text-xl mb-4 text-red-600 dark:text-red-400 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Error Crítico Capturado
      </h3>
      <p className="mb-4 text-base">Por favor, copia todo este texto y pásaselo a Adriel/Asistente:</p>
      
      <div className="space-y-4">
        <div className="p-4 bg-white/50 dark:bg-black/50 rounded-xl overflow-x-auto whitespace-pre-wrap shadow-inner border border-red-100 dark:border-red-900/50">
          <span className="font-bold text-red-700 dark:text-red-300">Name:</span> {error.name}
        </div>
        
        <div className="p-4 bg-white/50 dark:bg-black/50 rounded-xl overflow-x-auto whitespace-pre-wrap shadow-inner border border-red-100 dark:border-red-900/50">
          <span className="font-bold text-red-700 dark:text-red-300">Message:</span> {error.message}
        </div>

        {error.digest && (
          <div className="p-4 bg-white/50 dark:bg-black/50 rounded-xl overflow-x-auto whitespace-pre-wrap shadow-inner border border-red-100 dark:border-red-900/50">
            <span className="font-bold text-red-700 dark:text-red-300">Digest:</span> {error.digest}
          </div>
        )}
        
        <div className="p-4 bg-white/50 dark:bg-black/50 rounded-xl overflow-x-auto whitespace-pre-wrap shadow-inner border border-red-100 dark:border-red-900/50">
          <span className="font-bold text-red-700 dark:text-red-300">Stack Trace:</span>
          <br/>
          <span className="text-xs">{error.stack}</span>
        </div>
      </div>

      <button
        onClick={() => reset()}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-sans font-medium"
      >
        Intentar de nuevo
      </button>
    </div>
  )
}
