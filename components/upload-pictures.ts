import { UploadFile, ShowUploadListInterface } from 'antd/es/upload/interface'
import { Component } from '@billyunq/react-utils/react'
import { autobind } from '@billypon/react-decorator'

import template from './upload-pictures.pug'

interface UploadPicturesProps {
  files: UploadFile[]
  disabled: boolean
  onChange: (files: UploadFile[]) => void
}

interface UploadPicturesState {
  files: UploadFile[]
  disabled: boolean
}

class UploadPictures extends Component<UploadPicturesProps, UploadPicturesState> {
  limit = 3
  size = 3 * 1024 * 1024
  hideRemoveIcon: ShowUploadListInterface = { showPreviewIcon: true, showRemoveIcon: false }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { files: filesState } = prevState
    const { disabled, files: filesProps } = nextProps
    const files = filesProps || filesState
    return { files, disabled }
  }

  getInitialState() {
    return {
      files: [ ],
    }
  }

  @autobind()
  beforeUpload(file: UploadFile, files: UploadFile[]): boolean {
    if (file === files[0] && this.state.files.length + files.length > this.limit) {
      files.splice(this.limit - this.state.files.length)
    }
    if (file.size > this.size) {
      return false
    }
    const { onChange } = this.props
    this.state.files.push(file)
    if (onChange) {
      onChange(this.state.files)
    }
    const reader = new FileReader()
    reader.readAsDataURL(file as unknown as File)
    reader.onload = ({ target: { result } }) => {
      file.thumbUrl = result as string
      file.status = 'done'
      this.triggerUpdate()
    }
    return false
  }

  @autobind()
  previewFile(file: UploadFile): void {
    const image = new Image
    image.src = file.thumbUrl
    window.open('').document.write(image.outerHTML)
  }

  @autobind()
  removeFile(file: UploadFile): boolean {
    const { onChange } = this.props
    // eslint-disable-next-line react/no-access-state-in-setstate
    const files = this.state.files.filter(x => x !== file)
    this.setState({ files })
    if (onChange) {
      onChange(files)
    }
    return true
  }

  render() {
    return template.call(this, { ...this })
  }
}

export default UploadPictures
