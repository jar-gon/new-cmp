import Notification, { ArgsProps, IconType } from 'antd/es/notification'
import uuid from 'uuid/v4'

export default class {
  private static create(type: IconType, message: string, description?: string, props?: Partial<ArgsProps>): string {
    const messageId = uuid()
    Notification.open({
      ...props,
      type,
      key: messageId,
      message,
      description,
      className: `ant-notification--${ type }`,
    })
    return messageId
  }

  static success(message: string, description?: string, props?: Partial<ArgsProps>): string {
    return this.create('success', message, description, props)
  }

  static info(message: string, description?: string, props?: Partial<ArgsProps>): string {
    return this.create('info', message, description, { duration: 0, ...props })
  }

  static warning(message: string, description?: string, props?: Partial<ArgsProps>): string {
    return this.create('warning', message, description, { ...props })
  }

  static error(message: string, description?: string, props?: Partial<ArgsProps>): string {
    return this.create('error', message, description, { duration: 0, ...props })
  }

  static close(messageId: string): void {
    Notification.close(messageId)
  }

  static destroy(): void {
    Notification.destroy()
  }
}
