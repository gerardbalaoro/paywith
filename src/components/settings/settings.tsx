import { PaymentMethodList } from '@/components/payment-method/list'
import { PaymentMethodSheet } from '@/components/payment-method/sheet'
import { PaymentMethodProvider } from '@/components/payment-method/context'
import { CategoryList } from '@/components/category/list'
import { DataManagement } from './data'

export function Settings() {
  return (
    <PaymentMethodProvider>
      <div className="space-y-8">
        <PaymentMethodList />
        <CategoryList />
        <DataManagement />
      </div>
      <PaymentMethodSheet />
    </PaymentMethodProvider>
  )
}
