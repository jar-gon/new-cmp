import { InvoiceType } from '~/models/invoice'

export const INVOICE_TYPES = {
  general: '增值税普通发票',
  vat: '增值税专用发票',
}

export function ConvertInvoiceType(props: { type: InvoiceType }) {
  return INVOICE_TYPES[props.type] || props.type
}
