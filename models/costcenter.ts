import { SimpleObject } from './common'

export interface Costcenter extends SimpleObject {
  list: SimpleObject[]
  created_at: string
}
