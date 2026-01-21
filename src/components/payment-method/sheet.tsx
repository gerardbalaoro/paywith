import { useAtom } from 'jotai'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { PaymentMethods, Rewards } from '@/lib/store'
import type { PaymentMethod, Reward } from '@/lib/schema'
import { RewardList } from '@/components/reward/list'
import { usePaymentMethod } from './context'

export function PaymentMethodSheet() {
  const [methods, setMethods] = useAtom(PaymentMethods.atom)
  const { method, isOpen, close, name, setName, rewards, setRewards } =
    usePaymentMethod()

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      close()
    }
  }

  const handleUpdateReward = (rewardId: string, patch: Partial<Reward>) => {
    setRewards((prev) =>
      prev.map((r) => (r.id === rewardId ? { ...r, ...patch } : r)),
    )
  }

  const handleRemoveReward = (rewardId: string) => {
    setRewards((prev) => prev.filter((r) => r.id !== rewardId))
  }

  const handleAddReward = (reward: Reward) => {
    setRewards((prev) => [...prev, reward])
  }

  const handleSave = () => {
    if (!name.trim()) return

    if (method) {
      // Update existing method
      let updatedMethods = PaymentMethods.update(
        methods,
        method.id,
        name.trim(),
      )

      // Get existing reward IDs
      const existingRewardIds = new Set(method.rewards.map((r) => r.id))
      const newRewardIds = new Set(rewards.map((r) => r.id))

      // Remove deleted rewards
      for (const oldReward of method.rewards) {
        if (!newRewardIds.has(oldReward.id)) {
          updatedMethods = Rewards.remove(
            updatedMethods,
            method.id,
            oldReward.id,
          )
        }
      }

      // Update existing rewards and add new ones
      for (const reward of rewards) {
        if (existingRewardIds.has(reward.id)) {
          updatedMethods = Rewards.update(updatedMethods, method.id, reward)
        } else {
          updatedMethods = Rewards.add(updatedMethods, method.id, reward)
        }
      }

      setMethods(updatedMethods)
    } else {
      // Add new method
      let updatedMethods = PaymentMethods.add(methods, name.trim())
      const newMethod = updatedMethods.find(
        (m: PaymentMethod) => m.name === name.trim(),
      )

      if (newMethod) {
        for (const reward of rewards) {
          updatedMethods = Rewards.add(updatedMethods, newMethod.id, reward)
        }
      }

      setMethods(updatedMethods)
    }

    close()
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full! flex h-full min-h-0 flex-col"
      >
        <SheetHeader>
          <SheetTitle>
            {method ? 'Edit Payment Method' : 'Add Payment Method'}
          </SheetTitle>
          <SheetDescription>
            Configure the payment method name and reward rules.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 min-h-0 border-y">
          <div className="space-y-6 p-4">
            <div className="space-y-2">
              <Label htmlFor="pm-name">Name</Label>
              <Input
                id="pm-name"
                placeholder="e.g. BPI Amore"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <RewardList
              rewards={rewards}
              onUpdate={handleUpdateReward}
              onRemove={handleRemoveReward}
              onAdd={handleAddReward}
            />
          </div>
        </ScrollArea>

        <SheetFooter>
          <SheetClose render={<Button variant="outline">Cancel</Button>} />
          <Button onClick={handleSave} disabled={!name.trim()}>
            {method ? 'Save Changes' : 'Add Method'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
