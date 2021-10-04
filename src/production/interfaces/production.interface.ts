import { ICategory } from './category.interface'

export interface IProduction {
  id?: number
  link?: string
  image?: string
  article?: string
  title?: string
  description?: string
  instructions?: string
  v?: number
  p?: number
  images?: string[]
  category?: ICategory
}
