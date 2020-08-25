import { NextComponentType, NextPageContext } from 'next/dist/next-server/lib/utils'
import { ConfigProvider } from 'antd/es/index'
import { Provider } from 'react-redux/es'
import locale from 'antd/es/locale/zh_CN'
import Modal, { ModalProps } from '@billyunq/react-utils/modal'

import { store } from '~/utils/redux'

import { Endpoint } from '~/models/endpoint'

import EndpointDetail from './endpoint-detail'

function createModal<T>(props: ModalProps) {
  const Component = props.content as NextComponentType<NextPageContext, { }, { modal: Modal }>
  props.content = null
  props.width = 1040
  props.zIndex = 900
  props.wrapClassName = 'modal-page'
  props.footer = null
  props.mask = false
  props.centered = true
  props.closable = false
  const modal = new Modal<T>(props)
  props.content = (
    <ConfigProvider locale={ locale } autoInsertSpaceInButton={ false }>
      <Provider store={ store.default }>
        <Component { ...props.componentProps } modal={ modal } />
      </Provider>
    </ConfigProvider>
  )
  modal.open()
  return modal
}

export function endpointDetail(endpoint: Endpoint, props?: ModalProps) {
  return createModal<void>({
    content: EndpointDetail,
    componentProps: {
      endpoint,
    },
    ...props,
  })
}
