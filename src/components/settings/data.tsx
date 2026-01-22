import { useCallback, useRef, useState } from 'react'
import { useAtom } from 'jotai'
import { DownloadIcon, UploadIcon } from 'lucide-react'

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
import { exportSettings, importSettings, type Settings } from '@/lib/settings'

export function DataManagement() {
  const [categories, setCategories] = useAtom(Categories.atom)
  const [methods, setMethods] = useAtom(PaymentMethods.atom)

  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    setImportDialogOpen(true)
  }

  const processFile = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string
          const parsed = JSON.parse(text) as unknown
          const settings = importSettings(parsed)
          applySettings(settings)
        } catch (err) {
          setImportError(
            err instanceof Error
              ? err.message
              : 'Failed to parse settings file',
          )
        }
      }
      reader.readAsText(file)
    },
    [applySettings],
  )

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    processFile(file)
    event.target.value = ''
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files[0]
    if (file && file.type === 'application/json') {
      processFile(file)
    } else {
      setImportError('Please drop a JSON file')
    }
  }

  const handleImportDialogChange = (open: boolean) => {
    setImportDialogOpen(open)
    if (!open) {
      setImportError(null)
      setIsDragging(false)
    }
  }

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
              Download a JSON file to backup your settings.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Your data stays local. The JSON file can be re-imported later.
            </p>
          </DialogBody>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Close</Button>} />
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
              Select a JSON file exported from PayWith.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                w-full h-32 border-2 border-dashed rounded-lg
                flex flex-col items-center justify-center gap-2
                cursor-pointer transition-colors
                ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }
              `}
            >
              <UploadIcon className="size-8 text-muted-foreground" />
              <div className="text-sm text-center">
                <span className="text-muted-foreground">
                  Drop a JSON file here or{' '}
                </span>
                <span className="text-primary font-medium">browse</span>
              </div>
            </div>
            {importError && (
              <p className="text-sm text-destructive text-center">
                {importError}
              </p>
            )}
          </DialogBody>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
