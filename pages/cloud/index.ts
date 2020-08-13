import { connect } from 'react-redux/es'
import { ListState } from '@billyunq/react-utils/table'
import { autobind } from '@billypon/react-decorator'

import { ListComponent } from '~/components/utils/list'
import { mapState, ConnectedProps } from '~/utils/redux'
import { formatCurrency, formatDate } from '~/utils/common'
import { createEndpoint, deleteEndpoint } from '~/modals/index'
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

  getAccountInfo(): void {
    this.accountApi.getInfo().subscribe(account => this.props.dispatch({ type: 'account', value: account }))
  }

  @autobind()
  openConsole(endpoint: Endpoint): void {
    const { protocol, host, pathname } = window.location
    window.open(`${ protocol }//${ host }${ pathname }/${ endpoint.id }/console`)
  }

  render() {
    return template.call(this, { ...this, Document, SiteLayout, RegionAz, formatCurrency, formatDate, ConvertCloudType, ConvertCloudIcon, CLOUD_VENDORS })
  }
}

export default EndpointList
