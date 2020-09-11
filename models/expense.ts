import { CloudProvider } from './common'

export interface Expense {
  id: string
  cloud: CloudProvider
  name: string
  data: ExpenseData[]
}

export interface ExpenseData {
  x: string
  value: number
}

export interface ExpenseParams {
  dimension: string
  cost: string
  pay: string
  mode: string
  start?: string
  end?: string
}
