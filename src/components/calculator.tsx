import { useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Categories, PaymentMethods } from '@/lib/store'
import { best, type RewardResult } from '@/lib/reward'
import { cn } from '@/lib/utils'

function AmountInput({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  const [inputValue, setInputValue] = useState(() =>
    value > 0 ? String(value) : '',
  )
  const [isEditing, setIsEditing] = useState(false)

  const displayValue = isEditing ? inputValue : value > 0 ? String(value) : ''

  return (
    <div className="space-y-2">
      <Label htmlFor="amount" className="text-muted-foreground">
        Transaction Amount
      </Label>
      <Input
        id="amount"
        type="number"
        inputMode="decimal"
        placeholder="0"
        value={displayValue}
        className="text-3xl font-bold h-14 md:text-3xl tabular-nums"
        onChange={(event) => {
          const nextValue = event.target.value
          setInputValue(nextValue)
          const parsed = Number.parseFloat(nextValue)
          onChange(Number.isFinite(parsed) ? parsed : 0)
        }}
        onFocus={() => {
          setIsEditing(true)
          setInputValue(value > 0 ? String(value) : '')
        }}
        onBlur={() => {
          setIsEditing(false)
        }}
      />
    </div>
  )
}

function CategorySelector({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const categories = useAtomValue(Categories.atom)

  const categoryLabelById = useMemo(() => {
    return new Map(categories.map((cat) => [cat.id, cat.label] as const))
  }, [categories])

  const formatCategoryLabel = (categoryId: string | null) => {
    if (!categoryId) return 'Choose a category'
    return categoryLabelById.get(categoryId) ?? categoryId
  }

  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground">Category</Label>
      <Select
        value={value}
        onValueChange={(newValue) => {
          if (!newValue) return
          onChange(newValue)
        }}
      >
        <SelectTrigger className="w-full h-12">
          <SelectValue placeholder="Choose a category">
            {(selectValue) => formatCategoryLabel(selectValue as string | null)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function ResultItem({
  result,
  isTop,
}: {
  result: RewardResult
  isTop: boolean
}) {
  const formatValue = (value: number) => {
    if (!Number.isFinite(value)) {
      return '0.00'
    }
    return `${value.toFixed(2)}`
  }

  return (
    <div
      className={cn(
        'rounded-xl px-4 py-3.5 transition-all',
        'bg-card border border-border text-foreground',
        isTop &&
          'bg-primary/85 shadow-md outline-4 outline-primary/30 text-primary-foreground',
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className={cn('font-medium')}>{result.methodName}</div>
          <div className="text-xs opacity-80">
            {result.rewardLabel ?? 'No matching rule'}
          </div>
        </div>
        <div className={cn('text-right font-bold text-lg tabular-nums')}>
          {formatValue(result.value)}
        </div>
      </div>
    </div>
  )
}

function ResultsList({ results }: { results: RewardResult[] }) {
  const methods = useAtomValue(PaymentMethods.atom)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="font-semibold text-foreground">Best Options</h2>
        <span className="text-xs text-muted-foreground">
          {methods.length} payment methods
        </span>
      </div>

      <div className="space-y-2">
        {results.map((result, index) => (
          <ResultItem
            key={result.methodId}
            result={result}
            isTop={index === 0}
          />
        ))}
      </div>
    </div>
  )
}

export function Calculator() {
  const categories = useAtomValue(Categories.atom)
  const methods = useAtomValue(PaymentMethods.atom)

  const [amount, setAmount] = useState(0)
  const [categoryId, setCategoryId] = useState(() => categories[0]?.id ?? '')

  const results = useMemo(
    () => best(amount, categoryId, methods),
    [amount, categoryId, methods],
  )

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-linear-to-br from-card to-card/80">
        <CardContent className="space-y-5">
          <AmountInput value={amount} onChange={setAmount} />
          <CategorySelector value={categoryId} onChange={setCategoryId} />
        </CardContent>
      </Card>
      <ResultsList results={results} />
    </div>
  )
}
