import { useAtom } from 'jotai'
import { Trash2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Categories, PaymentMethods } from '@/lib/store'

export function CategoryItem({ id, label }: { id: string; label: string }) {
  const [categories, setCategories] = useAtom(Categories.atom)
  const [methods, setMethods] = useAtom(PaymentMethods.atom)

  const handleUpdate = (newLabel: string) => {
    setCategories(Categories.update(categories, id, newLabel))
  }

  const handleRemove = () => {
    const result = Categories.remove(categories, methods, id)
    setCategories(result.categories)
    setMethods(result.methods)
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        value={label}
        className="flex-1"
        onChange={(event) => handleUpdate(event.target.value)}
      />
      <Button variant="destructive" size="icon-sm" onClick={handleRemove}>
        <Trash2Icon className="size-3.5" />
      </Button>
    </div>
  )
}
