'use client'

import { useState } from 'react'
import { ScannerButton } from './scanner-button'
import { TransactionDialog } from './transaction-dialog'
import { ScannedData } from '@/lib/scanner'

export function ScannerAction({ accounts, categories }: { accounts: any[], categories: any[] }) {
  const [scanData, setScanData] = useState<ScannedData | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleScanComplete = (data: ScannedData) => {
    setScanData(data)
    setDialogOpen(true)
  }

  return (
    <>
      <div className="hidden sm:block">
        <ScannerButton onScanComplete={handleScanComplete} />
      </div>
      
      <TransactionDialog 
        accounts={accounts} 
        categories={categories} 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        prefillData={{
          amount: scanData?.amount,
          description: scanData?.merchant,
          date: scanData?.date
        }}
        trigger={<div className="hidden" />}
      />
    </>
  )
}
