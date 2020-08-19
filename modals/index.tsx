import { NextComponentType, NextPageContext } from 'next/dist/next-server/lib/utils'
import { Provider } from 'react-redux/es'
import Modal, { ModalProps } from '@billyunq/react-utils/modal'

import { CloudVendor, getCloudVendor } from '~/utils/cloud'
import { store } from '~/utils/redux'

import { Account } from '~/models/account'
import { Bill } from '~/models/bill'
import { CloudProvider } from '~/models/common'
import { Costcenter } from '~/models/costcenter'
import { Endpoint } from '~/models/endpoint'
import { Invoice } from '~/models/invoice'
import { Member } from '~/models/member'
import { RelationType } from '~/models/relation'
import { ResourceGroup } from '~/models/resource-group'

import BalanceThreshold from './balance-threshold'
import CreateCostcenter from './create-costcenter'
import CreateEndpoint from './create-endpoint'
import CreateMember from './create-member'
import CreateResourceGroup from './create-resource-group'
import DeleteCostcenter from './delete-costcenter'
import DeleteEndpoint from './delete-endpoint'
import DeleteInvoice from './delete-invoice'
import DeleteMember from './delete-member'
import OpenInvoice from './open-invoice'
import RelateMember from './relate-member'
import RelateResourceGroup from './relate-resource-group'
import ResetMemberPassword from './reset-member-password'
import UpdateAccount from './update-account'
import UpdateAccountPassword from './update-account-password'
import UpdateMember from './update-member'

function createModal<T>(props: ModalProps) {
  const Component = props.content as NextComponentType<NextPageContext, { }, { modal: Modal }>
  props.content = null
  props.width = 700
  const modal = new Modal<T>(props)
  props.content = (
    <Provider store={ store.default }>
      <Component { ...props.componentProps } modal={ modal } />
    </Provider>
  )
  modal.open()
  return modal
}

export function balanceThreshold(quota: number, props?: ModalProps) {
  return createModal<void>({
    title: '余额阈值',
    content: BalanceThreshold,
    componentProps: {
      quota,
    },
    ...props,
  })
}

export function createCostcenter(props?: ModalProps) {
  return createModal<void>({
    title: '添加成本中心',
    content: CreateCostcenter,
    ...props,
  })
}

export function createEndpoint(cloud: CloudProvider, props?: ModalProps) {
  const cloudVendor: CloudVendor = getCloudVendor(cloud)
  return createModal<void>({
    title: `添加${ cloudVendor.name }账号`,
    content: CreateEndpoint,
    componentProps: {
      cloudVendor,
    },
    ...props,
  })
}

export function createMember(props?: ModalProps) {
  return createModal<void>({
    title: '添加成员',
    content: CreateMember,
    ...props,
  })
}

export function createResourceGroup(props?: ModalProps) {
  return createModal<void>({
    title: '添加资源组',
    content: CreateResourceGroup,
    ...props,
  })
}

export function deleteCostcenter(costcenter: Costcenter, props?: ModalProps) {
  return createModal<void>({
    title: '删除成本中心',
    content: DeleteCostcenter,
    componentProps: {
      costcenter,
    },
    ...props,
  })
}

export function deleteEndpoint(endpoint: Endpoint, props?: ModalProps) {
  return createModal<void>({
    title: '删除账号',
    content: DeleteEndpoint,
    componentProps: {
      endpoint,
    },
    ...props,
  })
}

export function deleteInvoice(invoice: Invoice, props?: ModalProps) {
  return createModal<void>({
    title: '删除发票',
    content: DeleteInvoice,
    componentProps: {
      invoice,
    },
    ...props,
  })
}

export function deleteMember(member: Member, props?: ModalProps) {
  return createModal<void>({
    title: '删除成员',
    content: DeleteMember,
    componentProps: {
      member,
    },
    ...props,
  })
}

export function openInvoice(bill: Bill, props?: ModalProps) {
  return createModal<void>({
    title: '开具发票',
    content: OpenInvoice,
    componentProps: {
      bill,
    },
    ...props,
  })
}

export function relateMember(resourceGroup: ResourceGroup, props?: ModalProps) {
  return createModal<void>({
    title: '关联成员',
    content: RelateMember,
    componentProps: {
      resourceGroup,
    },
    ...props,
  })
}

export function relateResourceGroup(type: RelationType, relation: Costcenter | Member, props?: ModalProps) {
  return createModal<void>({
    title: '关联资源组',
    content: RelateResourceGroup,
    componentProps: {
      type,
      relation,
    },
    ...props,
  })
}

export function resetMemberPassword(member: Member, props?: ModalProps) {
  return createModal<void>({
    title: '重置成员密码',
    content: ResetMemberPassword,
    componentProps: {
      member,
    },
    ...props,
  })
}

export function updateAccount(account: Account, props?: ModalProps) {
  return createModal<void>({
    title: '修改信息',
    content: UpdateAccount,
    componentProps: {
      account,
    },
    ...props,
  })
}

export function updateAccountPassword(account: Account, props?: ModalProps) {
  return createModal<void>({
    title: '修改密码',
    content: UpdateAccountPassword,
    componentProps: {
      account,
    },
    ...props,
  })
}

export function updateMember(member: Member, props?: ModalProps) {
  return createModal<void>({
    title: '修改成员信息',
    content: UpdateMember,
    componentProps: {
      member,
    },
    ...props,
  })
}
