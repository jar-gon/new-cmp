import { BaseInvoice } from './invoice'
import { BaseOrder } from './order'

export interface Bill extends BaseInvoice {
  id: string
  bill_amount: number
  bill_save: number
  bill_total: number
  current_month: boolean
  created_at: string
  name: string
  status: BillStatus
  description: string
}

export interface BillOrder extends BaseOrder {
  billing_cycle: string
  product_detail: string
}

export type BillStatus = 'Unissue' | 'Issued' | 'Verify'
