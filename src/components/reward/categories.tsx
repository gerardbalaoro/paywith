import { useAtomValue } from 'jotai'
import { XIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { Label } from '@/components/ui/label'
import { Categories } from '@/lib/store'

type RewardCategoriesProps = {
  selectedCategories: string[]
  onToggle: (categoryId: string) => void
  onAdd: (categoryId: string) => void
}

export function RewardCategories({
  selectedCategories,
  onToggle,
  onAdd,
}: RewardCategoriesProps) {
  const categories = useAtomValue(Categories.atom)

  // "Global" is represented by empty array, so we don't list it
  const availableCategories = categories.filter(
    (c) => !selectedCategories.includes(c.id),
  )

  const isGlobal = selectedCategories.length === 0

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">Categories</Label>
      <div className="flex flex-wrap gap-1.5">
        {isGlobal ? (
          <Badge variant="secondary" className="gap-1">
            All Categories
          </Badge>
        ) : (
          selectedCategories.map((catId) => {
            const cat = categories.find((c) => c.id === catId)
            return (
              <Badge key={catId} variant="secondary" className="gap-1 pr-1">
                {cat?.label ?? catId}
                <button
                  type="button"
                  onClick={() => onToggle(catId)}
                  className="hover:bg-muted rounded-full p-0.5"
                >
                  <XIcon className="size-3" />
                </button>
              </Badge>
            )
          })
        )}
      </div>
      <Combobox
        value={null}
        onValueChange={(value) => {
          if (value) {
            onAdd(value)
          }
        }}
      >
        <ComboboxInput placeholder="Add category..." className="h-8 w-full" />
        <ComboboxContent>
          <ComboboxList>
            {availableCategories.map((cat) => (
              <ComboboxItem key={cat.id} value={cat.id}>
                {cat.label}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
