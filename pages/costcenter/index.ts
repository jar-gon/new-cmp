import { connect } from 'react-redux/es'
import { ListState } from '@billyunq/react-utils/table'
import { autobind } from '@billypon/react-decorator'

import { ListComponent } from '~/components/utils/list'
import { mapState, ConnectedProps } from '~/utils/redux'
import { formatDate } from '~/utils/common'
import { createCostcenter, deleteCostcenter, relateResourceGroup } from '~/modals/index'

import CostcenterApi from '~/apis/costcenter'
import { Costcenter } from '~/models/costcenter'

import Document from '~/components/document'
import ShortName from '~/components/short-name'
import template from './index.pug'

@connect(mapState)
class CostcenterList extends ListComponent<ConnectedProps, ListState<Costcenter>> {
  costcenterApi: CostcenterApi

  componentDoInit() {
    this.costcenterApi = new CostcenterApi()
  }

  onLoadItems() {
    return this.costcenterApi.listCostcenter({
      pagenumber: this.pageNumber,
      pagesize: this.pageSize,
    }).pipe(this.syncPaging)
  }

  @autobind()
  createCostcenter(): void {
    createCostcenter().afterClose.subscribe(() => this.loadItems())
  }

  @autobind()
  deleteCostcenter(costcenter: Costcenter): void {
    deleteCostcenter(costcenter).afterClose.subscribe(() => this.loadItems())
  }

  @autobind()
  relate(costcenter: Costcenter): void {
    relateResourceGroup('costcenter', costcenter).afterClose.subscribe(() => this.loadItems())
  }

  render() {
    return template.call(this, { ...this, Document, ShortName, formatDate })
  }
}

export default CostcenterList
