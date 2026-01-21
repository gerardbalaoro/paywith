import { useState } from 'react'
import { useAtom } from 'jotai'
import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Categories } from '@/lib/store'
import type { Category } from '@/lib/schema'
import { CategoryItem } from './item'

export function CategoryList() {
  const [categories, setCategories] = useAtom(Categories.atom)
  const [newCategory, setNewCategory] = useState('')

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories(Categories.add(categories, newCategory))
      setNewCategory('')
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-semibold text-foreground">Categories</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Categories for your transactions
        </p>
      </div>

      <div className="space-y-2">
        {categories.map((cat: Category) => (
          <CategoryItem key={cat.id} id={cat.id} label={cat.label} />
        ))}

        <div className="flex items-center gap-2">
          <Input
            placeholder="Add new category..."
            value={newCategory}
            className="flex-1"
            onChange={(event) => setNewCategory(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleAddCategory()
              }
            }}
          />
          <Button size="icon" variant="secondary" onClick={handleAddCategory}>
            <PlusIcon />
          </Button>
        </div>
      </div>
    </section>
  )
}
