/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useState } from 'react'
import type { PaymentMethod, Reward } from '@/lib/schema'

type PaymentMethodContext = {
  method: PaymentMethod | null
  isOpen: boolean
  name: string
  setName: (name: string) => void
  rewards: Reward[]
  setRewards: React.Dispatch<React.SetStateAction<Reward[]>>
  open: (method?: PaymentMethod) => void
  close: () => void
}

const PaymentMethodContext = createContext<PaymentMethodContext | null>(null)

export function PaymentMethodProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [method, setMethod] = useState<PaymentMethod | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [rewards, setRewards] = useState<Reward[]>([])

  const open = useCallback((method?: PaymentMethod) => {
    setMethod(method ?? null)
    setName(method?.name ?? '')
    setRewards(method?.rewards ?? [])
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <PaymentMethodContext.Provider
      value={{
        method,
        isOpen,
        name,
        setName,
        rewards,
        setRewards,
        open,
        close,
      }}
    >
      {children}
    </PaymentMethodContext.Provider>
  )
}

export function usePaymentMethod() {
  const context = useContext(PaymentMethodContext)
  if (!context) {
    throw new Error(
      'usePaymentMethod must be used within a PaymentMethodProvider',
    )
  }
  return context
}
