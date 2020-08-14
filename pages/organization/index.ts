import { connect } from 'react-redux/es'
import { Component } from '@billyunq/react-utils/react'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import ORGANIZATION_MENUS from '~/modules/organization'

import CostcenterList from '../costcenter'
import MemberList from '../member'
import RelationList from '../relation'
import ResourceGroupList from '../resource-group'

import SiteLayout from '~/components/layout'
import template from './index.pug'

interface OrganizationStates {
  index: number
}

@connect(mapState)
class OrganizationIndex extends Component<ConnectedProps, OrganizationStates> {
  getInitialState() {
    return {
      index: 0
    }
  }

  @autobind()
  menuChange(e): void {
    this.setState({ index: e.target.value })
  }

  render() {
    return template.call(this, { ...this, SiteLayout, ORGANIZATION_MENUS, CostcenterList, MemberList, RelationList, ResourceGroupList })
  }
}

export default OrganizationIndex
