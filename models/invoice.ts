import { AuditStatus } from './common'

export interface Invoice {
  address: string
  bank_account: string
  created_at: Date
  id: string
  invoice_title: string
  invoice_type: InvoiceType
  open_bank: string
  phone: string
  province: string
  receiver: string
  registered_address: string
  registered_phone: string
  tax_number: string
  status: AuditStatus
  description: string
  imageurl: string
}

export type InvoiceType = 'general' | 'vat'
