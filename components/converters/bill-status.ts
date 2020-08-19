import { BillStatus } from '~/models/bill'

export const BILL_STATUS = {
  Unissue: '未开票',
  Verify: '待审核',
  Issued: '已开票',
}

export function ConvertBillStatus(props: { status: BillStatus }) {
  return BILL_STATUS[props.status] || props.status
}
