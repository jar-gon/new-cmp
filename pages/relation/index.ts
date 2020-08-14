import { connect } from 'react-redux/es'
import { ListState } from '@billyunq/react-utils/table'

import { ListComponent } from '~/components/utils/list'
import { mapState, ConnectedProps } from '~/utils/redux'

import RelationApi from '~/apis/relation'
import { Relation, RelationSummary } from '~/models/relation'

import Document from '~/components/document'
import Font10 from '~/components/font-10'
import ShortName from '~/components/short-name'
import template from './index.pug'

interface RelationListState {
  relationSummary: RelationSummary
}

@connect(mapState)
class RelationList extends ListComponent<ConnectedProps, ListState<Relation> & RelationListState> {
  relationApi: RelationApi

  componentDoInit() {
    this.relationApi = new RelationApi()
    this.relationApi.getRelationSummary().subscribe(relationSummary => this.setState({ relationSummary }))
  }

  onLoadItems() {
    return this.relationApi.listRelation({
      pagenumber: this.pageNumber,
      pagesize: this.pageSize,
      ...this.params,
    }).pipe(this.syncPaging)
  }

  render() {
    return template.call(this, { ...this, Document, Font10, ShortName })
  }
}

export default RelationList
