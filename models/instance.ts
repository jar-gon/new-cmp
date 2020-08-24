export interface Instance {
  InstanceId?: string
  InternetMaxBandwidthOut: number
  InstanceName: string
  InstanceChargeType: string
  Cpu: number
  Memory: number
  Disksize: number
  OSName: string
  PublicIpAddress: string[]
  PrivateIpAddress: string[]
  Status: InstanceStatus
  ExpiredTime: string
}

export interface InstanceSummary {
  totalCount: number
  runningCount: number
  expirationCount: number
  expiratedCount: number
}

export interface InstanceSummaryData {
  cloud?: string
  endpoint_id?: string
  region_id?: string
}

export type InstanceStatus = 'Starting' | 'Running' | 'Stopping' | 'Stopped'

export type PowerAction = 'start' | 'stop' | 'reboot'
