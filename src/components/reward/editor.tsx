import { Trash2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Reward } from '@/lib/schema'
import { RewardCategories } from './categories'

type RewardEditorProps = {
  reward: Reward
  onUpdate: (patch: Partial<Reward>) => void
  onRemove: () => void
}

export function RewardEditor({
  reward,
  onUpdate,
  onRemove,
}: RewardEditorProps) {
  const handleCategoriesChange = (categories: string[]) => {
    onUpdate({ categories })
  }

  return (
    <div className="rounded-lg border border-border p-3 space-y-3">
      <Tabs
        value={reward.type}
        onValueChange={(value) => {
          if (!value) return
          const nextType = value as Reward['type']
          onUpdate({
            type: nextType,
            earnRate:
              nextType === 'points' ? (reward.earnRate ?? 30) : undefined,
            redemptionRate:
              nextType === 'points' ? (reward.redemptionRate ?? 17) : undefined,
          })
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
        selectedCategories={reward.categories}
        onChange={handleCategoriesChange}
      />

      <div className="space-y-3">
        {reward.type === 'cashback' && (
          <>
            <div className="space-y-1.5">
              <Label className="text-xs">Cashback Type</Label>
              <Tabs
                value={reward.isFixed ? 'fixed' : 'percent'}
                onValueChange={(value) => {
                  if (!value) return
                  onUpdate({ isFixed: value === 'fixed' })
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
                {reward.isFixed ? 'Amount' : 'Rate'}
              </Label>
              <p className="text-xs text-muted-foreground">
                {reward.isFixed
                  ? 'Fixed cashback amount per transaction'
                  : 'Percentage of transaction (e.g. 0.04 = 4%)'}
              </p>
              <Input
                type="number"
                inputMode="decimal"
                className="h-9"
                value={Number.isFinite(reward.value) ? reward.value : 0}
                onChange={(e) =>
                  onUpdate({
                    value: Number.parseFloat(e.target.value || '0'),
                  })
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
            value={Number.isFinite(reward.minSpend) ? reward.minSpend : 0}
            onChange={(e) =>
              onUpdate({
                minSpend: Number.parseFloat(e.target.value || '0'),
              })
            }
          />
        </div>

        {reward.type === 'points' && (
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
                value={reward.earnRate ?? 0}
                onChange={(e) =>
                  onUpdate({
                    earnRate: Number.parseFloat(e.target.value || '0'),
                  })
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
                value={reward.redemptionRate ?? 0}
                onChange={(e) =>
                  onUpdate({
                    redemptionRate: Number.parseFloat(e.target.value || '0'),
                  })
                }
              />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end">
        <Button variant="destructive" size="icon-xs" onClick={onRemove}>
          <Trash2Icon />
        </Button>
      </div>
    </div>
  )
}
