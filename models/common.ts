export type CloudProvider = 'aliyun' | 'aws'
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

export interface SimpleObject {
  id: string
  name: string
  desc: string
}

export enum EnabledStatus {
  Enabled = 1,
  Disabled,
}

export enum NormalStatus {
  Normal = 1,
  Disabled,
}

export interface JsonFormat<T> {
  json_format: T
}
