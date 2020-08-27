import { AuditStatus } from './common'

export interface CreateInvoiceData {
  invoice_type: InvoiceType
  invoice_title: string
  tax_number: string
  registered_address?: string
  registered_phone?: string
  open_bank?: string
  bank_account?: string
  receiver: string
  phone: string
  province: string
  address: string
  imageurl?: string
  opener_type?: string
}

export interface FileData {
  imageurl: string
}

export interface Invoice extends CreateInvoiceData {
  id: string
  created_at: string
  status: AuditStatus
  description: string
}

export type InvoiceType = 'general' | 'vat'
