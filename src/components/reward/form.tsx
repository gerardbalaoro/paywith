import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { v4 as uuid } from 'uuid'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Reward } from '@/lib/schema'
import { RewardCategories } from './categories'

type RewardDraft = {
  type: Reward['type']
  value: string
  isFixed: boolean
  minSpend: string
  categories: string[]
  earnRate: string
  redemptionRate: string
}

const createRewardDraft = (): RewardDraft => ({
  type: 'cashback',
  value: '0',
  isFixed: false,
  minSpend: '0',
  categories: [],
  earnRate: '',
  redemptionRate: '',
})

type RewardFormProps = {
  onAdd: (reward: Reward) => void
}

export function RewardForm({ onAdd }: RewardFormProps) {
  const [draft, setDraft] = useState<RewardDraft>(createRewardDraft())

  const handleAddReward = () => {
    const value = Number.parseFloat(draft.value)
    const minSpend = Number.parseFloat(draft.minSpend)
    const earnRate = Number.parseFloat(draft.earnRate)
    const redemptionRate = Number.parseFloat(draft.redemptionRate)

    const newReward: Reward = {
      id: uuid(),
      type: draft.type,
      value: Number.isFinite(value) ? value : 0,
      isFixed: draft.type === 'cashback' ? draft.isFixed : false,
      minSpend: Number.isFinite(minSpend) ? minSpend : 0,
      categories: draft.categories,
      earnRate:
        draft.type === 'points' && Number.isFinite(earnRate)
          ? earnRate
          : undefined,
      redemptionRate:
        draft.type === 'points' && Number.isFinite(redemptionRate)
          ? redemptionRate
          : undefined,
    }

    onAdd(newReward)
    setDraft(createRewardDraft())
  }

  const handleCategoriesChange = (categories: string[]) => {
    setDraft((d) => ({ ...d, categories }))
  }

  return (
    <div className="rounded-lg border border-dashed border-border p-3 space-y-3">
      <Tabs
        value={draft.type}
        onValueChange={(value) => {
          if (!value) return
          setDraft((d) => ({
            ...d,
            type: value as Reward['type'],
          }))
        }}
      >
        <TabsList className="w-full">
          <TabsTrigger value="cashback" className="flex-1">
            Cashback
          </TabsTrigger>
          <TabsTrigger value="points" className="flex-1">
            Points
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <RewardCategories
        selectedCategories={draft.categories}
        onChange={handleCategoriesChange}
      />

      <div className="space-y-3">
        {draft.type === 'cashback' && (
          <>
            <div className="space-y-1.5">
              <Label className="text-xs">Cashback Type</Label>
              <Tabs
                value={draft.isFixed ? 'fixed' : 'percent'}
                onValueChange={(value) => {
                  if (!value) return
                  setDraft((d) => ({ ...d, isFixed: value === 'fixed' }))
                }}
              >
                <TabsList className="w-full">
                  <TabsTrigger value="percent" className="flex-1">
                    Percentage
                  </TabsTrigger>
                  <TabsTrigger value="fixed" className="flex-1">
                    Fixed Amount
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">
                {draft.isFixed ? 'Amount' : 'Rate'}
              </Label>
              <p className="text-xs text-muted-foreground">
                {draft.isFixed
                  ? 'Fixed cashback amount per transaction'
                  : 'Percentage of transaction (e.g. 0.04 = 4%)'}
              </p>
              <Input
                type="number"
                inputMode="decimal"
                className="h-9"
                value={draft.value}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, value: e.target.value }))
                }
              />
            </div>
          </>
        )}

        <div className="space-y-1">
          <Label className="text-xs">Minimum Spend</Label>
          <p className="text-xs text-muted-foreground">
            Required spend to qualify for this reward
          </p>
          <Input
            type="number"
            inputMode="decimal"
            className="h-9"
            value={draft.minSpend}
            onChange={(e) =>
              setDraft((d) => ({ ...d, minSpend: e.target.value }))
            }
          />
        </div>

        {draft.type === 'points' && (
          <>
            <div className="space-y-1">
              <Label className="text-xs">Earn Rate</Label>
              <p className="text-xs text-muted-foreground">
                Spend this much cash to earn 1 point
              </p>
              <Input
                type="number"
                inputMode="decimal"
                className="h-9"
                value={draft.earnRate}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, earnRate: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Redemption Rate</Label>
              <p className="text-xs text-muted-foreground">
                Points needed to redeem 1 peso
              </p>
              <Input
                type="number"
                inputMode="decimal"
                className="h-9"
                value={draft.redemptionRate}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    redemptionRate: e.target.value,
                  }))
                }
              />
            </div>
          </>
        )}
      </div>

      <Button
        variant="secondary"
        size="sm"
        className="w-full"
        onClick={handleAddReward}
      >
        <PlusIcon className="size-3.5" />
        Add Reward
      </Button>
    </div>
  )
}
