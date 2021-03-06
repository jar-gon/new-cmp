import { connect } from 'react-redux/es'
import { ListState } from '@billyunq/react-utils/table'
import { autobind } from '@billypon/react-decorator'

import { ListComponent } from '~/components/utils/list'
import { mapState, ConnectedProps } from '~/utils/redux'
import Notification from '~/utils/notification'
import { formatCurrency, formatDate } from '~/utils/common'
import { createEndpoint, deleteEndpoint } from '~/modals/index'
import { endpointDetail } from '~/modals/pages/index'
import { CLOUD_VENDORS } from '~/utils/cloud'

import AccountApi from '~/apis/account'
import EndpointApi from '~/apis/endpoint'
import { CloudProvider } from '~/models/common'
import { Endpoint } from '~/models/endpoint'

import { ConvertCloudType } from '~/components/converters/cloud-type'
import { ConvertCloudIcon } from '~/components/converters/cloud-icon'

import Document from '~/components/document'
import SiteLayout from '~/components/layout'
import RegionAz from '~/components/region-az'
import template from './index.pug'

@connect(mapState)
class EndpointList extends ListComponent<ConnectedProps, ListState<Endpoint>> {
  accountApi: AccountApi
  endpointApi: EndpointApi

  componentDoInit() {
    this.accountApi = new AccountApi()
    this.endpointApi = new EndpointApi()
  }

  onLoadItems() {
    return this.endpointApi.listEndpoint({
      pagenumber: this.pageNumber,
      pagesize: this.pageSize,
    }).pipe(this.syncPaging)
  }

  getAccountInfo(): void {
    this.accountApi.getInfo().subscribe(account => this.props.dispatch({ type: 'account', value: account }))
  }

  @autobind()
  createEndpoint(cloud: CloudProvider): void {
    createEndpoint(cloud).afterClose.subscribe(() => {
      this.loadItems()
      this.getAccountInfo()
    })
  }

  @autobind()
  deleteEndpoint(endpoint: Endpoint): void {
    deleteEndpoint(endpoint).afterClose.subscribe(() => {
      this.loadItems()
      this.getAccountInfo()
    })
  }

  @autobind()
  detail(endpoint: Endpoint): void {
    endpointDetail(endpoint).afterCancel.subscribe(cancelUpdate => cancelUpdate ? this.loadItems() : '')
  }

  @autobind()
  openConsole(endpoint: Endpoint): void {
    const { protocol, host, pathname } = window.location
    window.open(`${ protocol }//${ host }${ pathname }/${ endpoint.id }/console`)
  }

  @autobind()
  updateData(): void {
    this.endpointApi.updateData('aliyun').subscribe(
      () => {
        Notification.info('数据更新中', '请10分钟之后重新刷新页面。')
      },
      ({ retMsg }) => {
        Notification.error('操作失败！', retMsg)
      }
    )
  }

  render() {
    return template.call(this, { ...this, Document, SiteLayout, RegionAz, formatCurrency, formatDate, ConvertCloudType, ConvertCloudIcon, CLOUD_VENDORS })
  }
}

export default EndpointList
