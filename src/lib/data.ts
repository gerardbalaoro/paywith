import { v4 as uuid } from 'uuid'
import type { Category, PaymentMethod } from '@/lib/schema'

enum PresetCategory {
  Groceries = 'groceries',
  Drugstore = 'drugstore',
  Utilities = 'utilities',
  Retail = 'retail',
}

export const CategoriesData: Category[] = [
  { id: PresetCategory.Groceries, label: 'Groceries' },
  { id: PresetCategory.Drugstore, label: 'Drugstore' },
  { id: PresetCategory.Utilities, label: 'Utilities' },
  { id: PresetCategory.Retail, label: 'Retail' },
]

export const PaymentMethodsData: PaymentMethod[] = [
  {
    id: 'BPI_AMORE_CASHBACK',
    name: 'BPI Amore Cashback',
    rewards: [
      {
        id: uuid(),
        type: 'cashback',
        value: 0.04,
        isFixed: false,
        minSpend: 0,
        categories: [PresetCategory.Groceries],
      },
      {
        id: uuid(),
        type: 'cashback',
        value: 0.01,
        isFixed: false,
        minSpend: 0,
        categories: [PresetCategory.Drugstore],
      },
      {
        id: uuid(),
        type: 'cashback',
        value: 0.01,
        isFixed: false,
        minSpend: 0,
        categories: [PresetCategory.Utilities],
      },
      {
        id: uuid(),
        type: 'cashback',
        value: 0.003,
        isFixed: false,
        minSpend: 0,
        categories: [PresetCategory.Retail],
      },
    ],
  },
  {
    id: 'UB_REWARDS_VISA',
    name: 'UB Rewards Visa',
    rewards: [
      {
        id: uuid(),
        type: 'points',
        value: 0,
        isFixed: false,
        minSpend: 0,
        categories: [],
        earnRate: 30,
        redemptionRate: 17,
      },
    ],
  },
  {
    id: 'MARIBANK_CARD',
    name: 'MariBank Card',
    rewards: [
      {
        id: uuid(),
        type: 'cashback',
        value: 0.01,
        isFixed: false,
        minSpend: 0,
        categories: [],
      },
    ],
  },
  {
    id: 'MARIBANK_QR',
    name: 'MariBank QR',
    rewards: [
      {
        id: uuid(),
        type: 'cashback',
        value: 2,
        isFixed: true,
        minSpend: 100,
        categories: [],
      },
    ],
  },
]
