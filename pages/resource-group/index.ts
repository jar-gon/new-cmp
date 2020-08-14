import { connect } from 'react-redux/es'
import { ListState } from '@billyunq/react-utils/table'
import { autobind } from '@billypon/react-decorator'

import { ListComponent } from '~/components/utils/list'
import { mapState, ConnectedProps } from '~/utils/redux'
import { formatDate } from '~/utils/common'
import { createResourceGroup, relateMember } from '~/modals/index'

import ResourceGroupApi from '~/apis/resource-group'
import { ResourceGroup } from '~/models/resource-group'

import { ConvertCloudIcon } from '~/components/converters/cloud-icon'

import Document from '~/components/document'
import ShortName from '~/components/short-name'
import template from './index.pug'

@connect(mapState)
class ResourceGroupList extends ListComponent<ConnectedProps, ListState<ResourceGroup>> {
  resourceGroupApi: ResourceGroupApi

  componentDoInit() {
    this.resourceGroupApi = new ResourceGroupApi()
  }

  onLoadItems() {
    return this.resourceGroupApi.listResourceGroup({
      pagenumber: this.pageNumber,
      pagesize: this.pageSize,
    }).pipe(this.syncPaging)
  }

  @autobind()
  createResourceGroup(): void {
    createResourceGroup().afterClose.subscribe(() => this.loadItems())
  }

  @autobind()
  relate(resourceGroup: ResourceGroup): void {
    relateMember(resourceGroup).afterClose.subscribe(() => this.loadItems())
  }

  render() {
    return template.call(this, { ...this, Document, ShortName, formatDate, ConvertCloudIcon })
  }
}

export default ResourceGroupList
