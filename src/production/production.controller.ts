import { Controller, Get } from '@nestjs/common'
import { ProductionService } from './services/production.service'
import { ICategory } from './interfaces/category.interface'

@Controller('')
export class ProductionController {
  constructor(private readonly service: ProductionService) {}

  @Get('/categories')
  async getCategories(): Promise<ICategory[]> {
    return this.service.getCategories()
  }
}
