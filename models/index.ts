import { CloudProvider } from './common'
import { AliEndpointType, AWSEndpointType } from './endpoint'

export interface CostConsume {
  project: string
  percent: number
  total: number
}

export interface Endpoint {
  id: string
  name: string
  cloud: CloudProvider
  currency: string
  type: AliEndpointType | AWSEndpointType
  current_month: number
  last_month: number
}

export interface ProductConsume {
  service: string
  percent: number
  total: number
}

export interface Summary {
  current_month: number
  current_year: number
  end: string
  last_month: number
  last_year: number
  month_ratio: number
  year_ratio: number
}
