import { useMemo } from 'react'
import { useAtomValue } from 'jotai'

import { Badge } from '@/components/ui/badge'
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox'
import { Label } from '@/components/ui/label'
import { Categories } from '@/lib/store'

type RewardCategoriesProps = {
  selectedCategories: string[]
  onChange: (categories: string[]) => void
}

export function RewardCategories({
  selectedCategories,
  onChange,
}: RewardCategoriesProps) {
  const categories = useAtomValue(Categories.atom)
  const anchor = useComboboxAnchor()

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category.label])),
    [categories],
  )

  const items = useMemo(
    () => categories.map((category) => category.id),
    [categories],
  )

  const isGlobal = selectedCategories.length === 0

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">Categories</Label>
      {isGlobal && (
        <Badge variant="secondary" className="gap-1">
          All Categories
        </Badge>
      )}
      <Combobox
        multiple
        autoHighlight
        items={items}
        value={selectedCategories}
        onValueChange={(value: string[]) => {
          onChange(value)
        }}
      >
        <ComboboxChips ref={anchor} className="w-full">
          <ComboboxValue>
            {(values: string[]) => (
              <>
                {values.map((value: string) => (
                  <ComboboxChip key={value}>
                    {categoryMap.get(value) ?? value}
                  </ComboboxChip>
                ))}
                <ComboboxChipsInput placeholder="Add category..." />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No categories found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {categoryMap.get(item) ?? item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
