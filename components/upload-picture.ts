import { UploadFile } from 'antd/es/upload/interface'
import UploadList from 'antd/es/upload/UploadList'
import { Component } from '@billyunq/react-utils/react'
import { autobind } from '@billypon/react-decorator'

import template from './upload-picture.pug'

const uploadLocale = {
  removeFile: '删除文件',
}

const EXTS = [ 'jpg', 'png', 'gif', 'svg' ]
const MIMES = {
  jpg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  svg: 'image/svg+xml',
}

interface UploadPictureProps {
  value: UploadFile
  accept: string
  onChange: (file: UploadFile) => void
}

interface UploadPictureState {
  accept: string
  types: string[]
  file: UploadFile
}

class UploadPicture extends Component<UploadPictureProps, UploadPictureState> {
  static getDerivedStateFromProps(nextProps) {
    return { file: nextProps.value }
  }

  getInitialState() {
    const types = (this.props.accept || 'jpg,png')
      .split(',')
      .filter(x => EXTS.includes(x))
      .map(x => MIMES[x])
    const accept = types.join(', ')
    return { accept, types }
  }

  @autobind()
  beforeUpload(file: UploadFile): boolean {
    const { onChange } = this.props
    const { types } = this.state
    if (types.includes(file.type)) {
      const reader = new FileReader()
      reader.readAsDataURL(file as unknown as File)
      reader.onload = ({ target: { result } }) => {
        file.thumbUrl = result as string
        file.status = 'done'
        this.setState({ file })
        if (onChange) {
          onChange(file)
        }
      }
    }
    return false
  }

  @autobind()
  removeUpload(): void {
    const { onChange } = this.props
    this.setState({ file: null })
    if (onChange) {
      onChange(null)
    }
  }

  render() {
    return template.call(this, { ...this, UploadList, uploadLocale })
  }
}

export default UploadPicture
