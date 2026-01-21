import { useAtomValue } from 'jotai'
import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PaymentMethods } from '@/lib/store'
import { PaymentMethodItem } from './item'
import { usePaymentMethod } from './context'

export function PaymentMethodList() {
  const methods = useAtomValue(PaymentMethods.atom)
  const { open } = usePaymentMethod()

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground">Payment Methods</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your cards and payment options
          </p>
        </div>
        <Button size="sm" onClick={() => open()}>
          <PlusIcon className="size-3.5" />
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {methods.map((method) => (
          <PaymentMethodItem key={method.id} method={method} />
        ))}
      </div>
    </section>
  )
}
