import { CloudProvider } from './common'

export interface Console {
  url: string
}

export interface CreateEndpointData {
  name: string
  cloud: CloudProvider
  type: AliEndpointType | AWSEndpointType
  accountId: string
  accesskey: string
  secretkey: string
}

export interface Endpoint extends CreateEndpointData {
  id: string
  currency: string
  regions: EndpointRegion[]
  balance: string
  created_at: string
}

export interface EndpointRegion {
  countryName: string
  countryRegion: string
  regionId: string
  regionName: string
}

export enum AliEndpointType {
  Own = 1,
  Proxy,
  Trust,
}

export enum AWSEndpointType {
  China = 1,
  Global,
}
