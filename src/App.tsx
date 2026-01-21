import { useEffect, useState } from 'react'
import { CalculatorIcon, SettingsIcon } from 'lucide-react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calculator } from '@/components/calculator'
import { Settings } from '@/components/settings/settings'
import { cn } from '@/lib/utils'

export function App() {
  const [activeTab, setActiveTab] = useState('calculator')

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => {
      document.documentElement.classList.toggle('dark', media.matches)
    }
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/30 pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="mx-auto max-w-2xl px-4 py-3 md:py-4">
          <h1 className="text-xl md:text-2xl font-extrabold text-center bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent tracking-tighter">
            Pay<span className="font-bold text-foreground">With</span>
          </h1>
          <p className="mt-1 hidden md:block text-center text-sm text-muted-foreground">
            Pick the best payment method for every purchase
          </p>
        </div>
      </header>

      {/* Desktop Tabs (hidden on mobile) */}
      <nav className="hidden md:block sticky top-16.25 z-30 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="mx-auto max-w-2xl px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList variant="line" className="w-full justify-center gap-8">
              <TabsTrigger value="calculator" className="gap-2 px-4">
                <CalculatorIcon className="size-4" />
                Calculator
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2 px-4">
                <SettingsIcon className="size-4" />
                Settings
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-4 py-6">
        {activeTab === 'calculator' ? <Calculator /> : <Settings />}
      </main>

      {/* Mobile Bottom Dock (hidden on desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-lg border-t border-border/50 safe-area-inset-bottom">
        <div className="flex items-center justify-around py-2">
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={cn(
              'flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors',
              activeTab === 'calculator'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <CalculatorIcon className="size-5" />
            <span className="text-xs font-medium">Calculator</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={cn(
              'flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors',
              activeTab === 'settings'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <SettingsIcon className="size-5" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default App
