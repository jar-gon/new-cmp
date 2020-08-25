export interface Region {
  dbInstancesCount: number
  instancesCount: number
  regionId: string
  regionName: string
}

export interface ResourceCount {
  dbInstancesCount: number
  instancesCount: number
  availableRegions: number
  totalRegions: number
  value: ResourceCountValue[]
}

export interface ResourceCountValue extends Region {
  latitude: number
  longitude: number
}



