import { InvoiceType } from './invoice'

export interface Bill {
  id: string
  bill_amount: number
  // bill_save: number
  // bill_total: number
  current_month: boolean
  created_at: string
  invoice_title: string
  // tax_number: number
  // registered_address: string
  // registered_phone: string
  // open_bank: string
  // bank_account: string
  receiver: string
  // phone: string
  // province: string
  // address: string
  invoice_type: InvoiceType
  name: string
  status: BillStatus
  description: string
}

export type BillStatus = 'Unissue' | 'Issued' | 'Verify'
