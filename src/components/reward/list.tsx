import { Label } from '@/components/ui/label'
import type { Reward } from '@/lib/schema'
import { RewardEditor } from './editor'
import { RewardForm } from './form'

type RewardListProps = {
  rewards: Reward[]
  onUpdate: (rewardId: string, patch: Partial<Reward>) => void
  onRemove: (rewardId: string) => void
  onAdd: (reward: Reward) => void
}

export function RewardList({
  rewards,
  onUpdate,
  onRemove,
  onAdd,
}: RewardListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Rewards</Label>
        <span className="text-xs text-muted-foreground">
          {rewards.length} reward{rewards.length !== 1 ? 's' : ''}
        </span>
      </div>

      {rewards.map((reward) => (
        <RewardEditor
          key={reward.id}
          reward={reward}
          onUpdate={(patch) => onUpdate(reward.id, patch)}
          onRemove={() => onRemove(reward.id)}
        />
      ))}

      <RewardForm onAdd={onAdd} />
    </div>
  )
}
