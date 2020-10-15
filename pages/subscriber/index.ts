import { connect } from 'react-redux/es'
import { ListState } from '@billyunq/react-utils/table'

import { ListComponent } from '~/components/utils/list'
import { mapState, ConnectedProps } from '~/utils/redux'
import { formatDate } from '~/utils/common'

import SubscriberApi from '~/apis/subscriber'
import { Subscriber } from '~/models/subscriber'

// import { ConvertNormalStatus } from '~/components/converters/normal-status'

import Document from '~/components/document'
import SiteLayout from '~/components/layout'
import ShortName from '~/components/short-name'
import template from './index.pug'

@connect(mapState)
class SubscriberList extends ListComponent<ConnectedProps, ListState<Subscriber>> {
  subscriberApi: SubscriberApi

  componentDoInit() {
    this.subscriberApi = new SubscriberApi()
  }

  onLoadItems() {
    return this.subscriberApi.listSubscriber({
      pagenumber: this.pageNumber,
      pagesize: this.pageSize,
    }).pipe(this.syncPaging)
  }

  render() {
    return template.call(this, { ...this, Document, SiteLayout, ShortName, formatDate })
  }
}

export default SubscriberList
