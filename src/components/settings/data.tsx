import { useCallback, useEffect, useRef, useState } from 'react'
import { useAtom } from 'jotai'
import {
  DownloadIcon,
  FileTextIcon,
  QrCodeIcon,
  UploadIcon,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Html5Qrcode } from 'html5-qrcode'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Categories, PaymentMethods } from '@/lib/store'
import { encode, decode } from '@/lib/encoder'
import { exportSettings, importSettings, type Settings } from '@/lib/settings'

type ImportMode = 'select' | 'file' | 'qr'

export function DataManagement() {
  const [categories, setCategories] = useAtom(Categories.atom)
  const [methods, setMethods] = useAtom(PaymentMethods.atom)

  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [importMode, setImportMode] = useState<ImportMode>('select')
  const [importError, setImportError] = useState<string | null>(null)
  const [qrData, setQrData] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const qrScannerRef = useRef<Html5Qrcode | null>(null)
  const qrContainerRef = useRef<HTMLDivElement>(null)

  const applySettings = useCallback(
    (settings: Settings) => {
      setCategories(settings.categories)
      setMethods(settings.methods)
      setImportDialogOpen(false)
      setImportError(null)
    },
    [setCategories, setMethods],
  )

  const handleExport = () => {
    setExportDialogOpen(true)
  }

  const handleDownloadJson = () => {
    const settings = exportSettings(categories, methods)
    const json = JSON.stringify(settings, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'paywith-settings.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    setImportError(null)
    setImportMode('select')
    setImportDialogOpen(true)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const parsed = JSON.parse(text) as unknown
        const settings = importSettings(parsed)
        applySettings(settings)
      } catch (err) {
        setImportError(
          err instanceof Error ? err.message : 'Failed to parse settings file',
        )
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const stopQrScanner = async () => {
    if (qrScannerRef.current) {
      try {
        await qrScannerRef.current.stop()
        qrScannerRef.current.clear()
      } catch {
        // Scanner may already be stopped
      }
      qrScannerRef.current = null
    }
  }

  // Start/stop QR scanner when mode changes
  useEffect(() => {
    if (importMode !== 'qr' || !importDialogOpen) {
      void stopQrScanner()
      return
    }

    let cancelled = false

    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode('qr-reader')
        if (cancelled) {
          scanner.clear()
          return
        }
        qrScannerRef.current = scanner

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText) => {
            try {
              const parsed = await decode(decodedText)
              const settings = importSettings(parsed)
              applySettings(settings)
              void stopQrScanner()
            } catch (err) {
              setImportError(
                err instanceof Error ? err.message : 'Invalid QR code',
              )
            }
          },
          () => {
            // QR code not detected - ignore
          },
        )
      } catch (err) {
        if (!cancelled) {
          setImportError(
            err instanceof Error ? err.message : 'Failed to start camera',
          )
        }
      }
    }

    void startScanner()

    return () => {
      cancelled = true
      void stopQrScanner()
    }
  }, [importMode, importDialogOpen, applySettings])

  // Handle dialog close
  const handleImportDialogChange = (open: boolean) => {
    if (!open) {
      void stopQrScanner()
    }
    setImportDialogOpen(open)
  }

  useEffect(() => {
    let cancelled = false

    const buildQrData = async () => {
      try {
        const settings = exportSettings(categories, methods)
        const encoded = await encode(settings)
        if (!cancelled) {
          setQrData(encoded)
        }
      } catch (err) {
        if (!cancelled) {
          setImportError(
            err instanceof Error ? err.message : 'Failed to encode settings',
          )
        }
      }
    }

    void buildQrData()

    return () => {
      cancelled = true
    }
  }, [categories, methods])

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-semibold text-foreground">Data</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Import or export your settings
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={handleExport}>
          <DownloadIcon className="size-4" />
          Export
        </Button>
        <Button variant="outline" className="flex-1" onClick={handleImport}>
          <UploadIcon className="size-4" />
          Import
        </Button>
      </div>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Settings</DialogTitle>
            <DialogDescription>
              Scan the QR code or download the JSON file to backup your
              settings.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="flex flex-col items-center gap-4">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG value={qrData} size={200} level="L" />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Scan this QR code with another device to import settings
            </p>
          </DialogBody>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button onClick={handleDownloadJson}>
              <DownloadIcon className="size-4" />
              Download JSON
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={handleImportDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Settings</DialogTitle>
            <DialogDescription>
              {importMode === 'select' && 'Choose how to import your settings.'}
              {importMode === 'file' && 'Select a JSON file to import.'}
              {importMode === 'qr' && 'Scan a QR code to import settings.'}
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            {importMode === 'select' && (
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full h-16 justify-start gap-4"
                  onClick={() => setImportMode('file')}
                >
                  <FileTextIcon className="size-6" />
                  <div className="text-left">
                    <div className="font-medium">Import from JSON file</div>
                    <div className="text-xs text-muted-foreground">
                      Select a previously exported settings file
                    </div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-16 justify-start gap-4"
                  onClick={() => setImportMode('qr')}
                >
                  <QrCodeIcon className="size-6" />
                  <div className="text-left">
                    <div className="font-medium">Scan QR code</div>
                    <div className="text-xs text-muted-foreground">
                      Use camera to scan settings QR code
                    </div>
                  </div>
                </Button>
              </div>
            )}

            {importMode === 'file' && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json,application/json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  className="w-full h-24 border-dashed"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadIcon className="size-6" />
                  <span>Select JSON file</span>
                </Button>
              </>
            )}

            {importMode === 'qr' && (
              <div
                id="qr-reader"
                ref={qrContainerRef}
                className="w-full aspect-square bg-muted rounded-lg overflow-hidden"
              />
            )}

            {importError && (
              <p className="text-sm text-destructive text-center">
                {importError}
              </p>
            )}
          </DialogBody>
          <DialogFooter>
            {importMode !== 'select' && (
              <Button
                variant="ghost"
                onClick={() => {
                  void stopQrScanner()
                  setImportMode('select')
                  setImportError(null)
                }}
              >
                Back
              </Button>
            )}
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
