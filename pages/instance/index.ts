import { withRouter } from 'next/router'
import { connect } from 'react-redux/es'
import { forkJoin } from 'rxjs'
import { isAfter } from 'date-fns'
import { CascaderOptionType } from 'antd/es/cascader'
import { ListState } from '@billyunq/react-utils/table'
import { autobind } from '@billypon/react-decorator'

import { ListComponent } from '~/components/utils/list'
import { mapState, ConnectedProps } from '~/utils/redux'
import { changeInstancePower, resetInstancePassword } from '~/modals/index'

import InstanceApi from '~/apis/instance'
import ResourceApi from '~/apis/resource'
import { CloudProvider } from '~/models/common'
import { Instance, InstanceSummaryData, PowerAction } from '~/models/instance'

import { ConvertExpirationDate } from '~/components/converters/expiration-date'
import { ConvertInstanceIcon } from '~/components/converters/instance-icon'
import { ConvertInstanceStatus } from '~/components/converters/instance-status'
import { ConvertMemorySize } from '~/components/converters/memory-size'

import Document from '~/components/document'
import SiteLayout from '~/components/layout'
import ClickCopy from '~/components/click-copy'
import ClickEdit from '~/components/click-edit'
import ShortName from '~/components/short-name'
import template from './index.pug'

export function canStart(instance: Instance): boolean {
  return instance && instance.Status === 'Stopped' && isAfter(new Date(instance.ExpiredTime), new Date)
}

export function canStop(instance: Instance): boolean {
  return instance && instance.Status === 'Running' && isAfter(new Date(instance.ExpiredTime), new Date)
}

export function canConnect(instance: Instance): boolean {
  return instance && instance.Status !== 'Stopped' && isAfter(new Date(instance.ExpiredTime), new Date)
}

export function canResetPwd(instance: Instance): boolean {
  return instance && isAfter(new Date(instance.ExpiredTime), new Date)
}

export function canShowStart(instance: Instance): boolean {
  return instance && ![ 'Running', 'Stopping' ].includes(instance.Status)
}

interface InstanceListState {
  totalCount: number
  runningCount: number
  expirationCount: number
  expiratedCount: number
  filterRegions: CascaderOptionType[]
}

@withRouter
@connect(mapState)
class InstanceList extends ListComponent<ConnectedProps, ListState<Instance> & InstanceListState> {
  instanceApi: InstanceApi
  resourceApi: ResourceApi

  filterRegionsVal: string[]

  getInitialState() {
    return {
      totalCount: 0,
      runningCount: 0,
      expirationCount: 0,
      expiratedCount: 0,
    }
  }

  componentDoInit() {
    this.instanceApi = new InstanceApi()
    this.resourceApi = new ResourceApi()
    const params: InstanceSummaryData = {
      cloud: this.query.cloud,
      endpoint_id: this.query.endpointId,
      region_id: this.query.regionId,
    }
    forkJoin(
      this.instanceApi.getSummary(params),
      this.resourceApi.getResourceRegion(),
    ).subscribe(([ { totalCount, runningCount, expirationCount, expiratedCount }, filterRegions ]) => {
      this.setState({ totalCount, runningCount, expirationCount, expiratedCount, filterRegions })
      filterRegions.splice(2, (filterRegions.length - 2))
      if (this.query.cloud) {
        this.filterRegionsVal = [ this.query.cloud, this.query.endpointId, this.query.regionId ]
      }
    })
  }

  onLoadItems() {
    const params = {
      endpoint_id: this.query.endpointId,
      region_id: this.query.regionId,
    }
    return this.instanceApi.listInstance({
      pagenumber: this.pageNumber,
      pagesize: this.pageSize,
      ...params,
    }).pipe(this.syncPaging)
  }

  @autobind()
  changeFilterRegions(values: string[]): void {
    const { protocol, host, pathname } = window.location
    if (values[0]) {
      window.location.href = `${ protocol }//${ host }${ pathname }?cloud=${ values[0] }&endpointId=${ values[1] }&regionId=${ values[2] }`
    } else {
      window.location.href = `${ protocol }//${ host }${ pathname }`
    }
  }

  @autobind()
  changePower(instance: Instance, action: PowerAction): void {
    if (action === 'reboot' && !canStop(instance)) {
      return
    }
    const { cloud, endpointId, regionId } = this.query
    changeInstancePower(cloud as CloudProvider, endpointId, regionId, instance, action, this.triggerUpdate.bind(this))
  }

  @autobind()
  openVNC(instance: Instance): void {
    const { protocol, host, pathname } = window.location
    window.open(`${ protocol }//${ host }${ pathname }/vnc?endpointId=${ this.query.endpointId }&regionId=${ this.query.regionId }&instanceId=${ instance.InstanceId }`)
  }

  @autobind()
  resetPassword(instance: Instance): void {
    if (!canResetPwd(instance)) {
      return
    }
    const { cloud, endpointId, regionId } = this.query
    resetInstancePassword(cloud as CloudProvider, endpointId, regionId, instance, this.triggerUpdate.bind(this))
  }

  render() {
    /* eslint-disable object-property-newline */
    return template.call(this, {
      ...this, Document, SiteLayout, ClickCopy, ClickEdit, ShortName,
      ConvertExpirationDate, ConvertInstanceIcon, ConvertInstanceStatus, ConvertMemorySize,
      canStart, canStop, canConnect, canResetPwd, canShowStart,
    })
  }
}

export default InstanceList
