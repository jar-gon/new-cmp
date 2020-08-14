export type CloudProvider = 'aliyun' | 'aws' | 'tencent' | 'huawei' | 'ucloud' | 'azure'
export type PayType = 'PostPaid' | 'PrePaid'

export enum AuditStatus {
  Audit = 1,
  Auditing,
  Audited,
  Reject,
}

export enum BindStatus {
  Unbound = 1,
  Binding,
  Bound,
}

export interface CreateSimpleObject {
  name: string
  desc?: string
}

export enum EnabledStatus {
  Enabled = 1,
  Disabled,
}

export interface JsonFormat<T> {
  json_format: T
}

export enum NormalStatus {
  Normal = 1,
  Disabled,
}

export interface SimpleObject {
  id: string
  name: string
  desc: string
}
