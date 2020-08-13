import { connect } from 'react-redux/es'
import { ModalComponent } from '@billyunq/react-utils/modal'
import { autobind } from '@billypon/react-decorator'

import { mapState, ConnectedProps } from '~/utils/redux'
import { appendTask } from '~/utils/task'

import EndpointApi from '~/apis/endpoint'
import { Endpoint } from '~/models/endpoint'

import template from './delete-endpoint.pug'

interface DeleteEndpointProps {
  endpoint: Endpoint
}

@connect(mapState)
export class DeleteEndpoint extends ModalComponent<ConnectedProps & DeleteEndpointProps> {
  @autobind()
  onClose() {
    const endpointApi = new EndpointApi()
    return endpointApi.deleteEndpoint(this.props.endpoint.id).pipe(
      appendTask(this.getTitle()),
    )
  }

  render() {
    return template.call(this, { ...this })
  }
}

export default DeleteEndpoint
