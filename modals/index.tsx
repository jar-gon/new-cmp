import { NextComponentType, NextPageContext } from 'next/dist/next-server/lib/utils'
import { Provider } from 'react-redux/es'
import Modal, { ModalProps } from '@billyunq/react-utils/modal'

import { CloudVendor, getCloudVendor } from '~/utils/cloud'
import { store } from '~/utils/redux'

import { Account } from '~/models/account'
import { CloudProvider } from '~/models/common'
import { Endpoint } from '~/models/endpoint'

import CreateEndpoint from './create-endpoint'
import DeleteEndpoint from './delete-endpoint'
import UpdateAccount from './update-account'
import UpdateAccountPassword from './update-account-password'

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
