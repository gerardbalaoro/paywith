import { useAtom } from 'jotai'
import { PencilIcon, Trash2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PaymentMethods } from '@/lib/store'
import type { PaymentMethod } from '@/lib/schema'
import { usePaymentMethod } from './context'

export function PaymentMethodItem({ method }: { method: PaymentMethod }) {
  const [methods, setMethods] = useAtom(PaymentMethods.atom)
  const { open } = usePaymentMethod()

  const handleRemove = () => {
    setMethods(PaymentMethods.remove(methods, method.id))
  }

  return (
    <div className="flex items-center justify-between rounded-xl bg-card border border-border px-4 py-3 hover:border-muted-foreground/20 transition-colors">
      <div>
        <div className="font-medium">{method.name}</div>
        <div className="text-xs text-muted-foreground">
          {method.rewards.length} reward
          {method.rewards.length !== 1 ? 's' : ''}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" onClick={() => open(method)}>
          <PencilIcon className="size-3.5" />
        </Button>
        <Button variant="destructive" size="icon-sm" onClick={handleRemove}>
          <Trash2Icon className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
