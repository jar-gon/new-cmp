import { SimpleObject } from './common'

export interface Relation extends SimpleObject {
  rg_list: RelationResourceGroup[]
}

export interface RelationResourceGroup extends SimpleObject {
  users_list: SimpleObject[]
}

export interface RelationSummary {
  project_count: number
  rg_count: number
  user_count: number
}

export type RelationType = 'costcenter' | 'member'
