import type { PaymentMethod, Reward } from '@/lib/schema'

/** Result of calculating the best reward for a payment method */
export type RewardResult = {
  methodId: string
  methodName: string
  value: number
  rewardId?: string
  rewardType?: Reward['type']
  rewardLabel?: string
}

/**
 * Calculate the reward value for a given amount and reward configuration
 */
export const calculate = (amount: number, reward: Reward): number => {
  if (amount < reward.minSpend) {
    return 0
  }

  if (reward.type === 'cashback') {
    if (reward.isFixed) {
      return reward.value
    }
    return amount * reward.value
  }

  if (!reward.earnRate || !reward.redemptionRate) {
    return 0
  }

  const points = amount / reward.earnRate
  const cashValue = points * (1 / reward.redemptionRate)
  return cashValue
}

/**
 * Generate a human-readable description of the reward
 */
export const describe = (reward: Reward): string => {
  if (reward.type === 'cashback') {
    if (reward.isFixed) {
      return `${reward.value.toFixed(2)} cashback`
    }
    return `${(reward.value * 100).toFixed(2)}% cashback`
  }

  return `1 point per ${(reward.earnRate ?? 0).toFixed(2)} spent`
}

/**
 * Find the best reward for a given amount, category, and list of payment methods.
 * Returns sorted results with the best option first.
 */
export const best = (
  amount: number,
  categoryId: string,
  methods: PaymentMethod[],
): RewardResult[] => {
  return methods
    .map((method) => {
      // Find rewards matching the category
      const specificRewards = method.rewards.filter((reward) =>
        reward.categories.includes(categoryId),
      )
      // Global rewards: empty categories array applies to all
      const globalRewards = method.rewards.filter(
        (reward) => reward.categories.length === 0,
      )

      const applicableRewards =
        specificRewards.length > 0 ? specificRewards : globalRewards

      const bestReward = applicableRewards.reduce<Reward | undefined>(
        (currentBest, reward) => {
          if (!currentBest) {
            return reward
          }

          const currentValue = calculate(amount, reward)
          const bestValue = calculate(amount, currentBest)
          return currentValue > bestValue ? reward : currentBest
        },
        undefined,
      )

      const value = bestReward ? calculate(amount, bestReward) : 0

      return {
        methodId: method.id,
        methodName: method.name,
        value,
        rewardId: bestReward?.id,
        rewardType: bestReward?.type,
        rewardLabel: bestReward ? describe(bestReward) : undefined,
      }
    })
    .filter((result) => result.rewardId !== undefined)
    .sort((a, b) => b.value - a.value)
}
