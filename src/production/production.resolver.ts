import { Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { ProductionService } from './services/production.service'
import { ProductionEntity } from './entities/production.entity'
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard'
import { Void } from '../config/scalar-void'
import { CategoryEntity } from './entities/category.entity'

@Resolver('Production')
export class ProductionResolver {
  constructor(private readonly productionService: ProductionService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [ProductionEntity], { nullable: true })
  async getAllProductions(): Promise<ProductionEntity[]> {
    return await this.productionService.getAllProductions()
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [CategoryEntity], { nullable: true })
  async getAllCategories(): Promise<CategoryEntity[]> {
    return await this.productionService.getAllCategories()
  }

  @Query(() => Void, { nullable: true })
  async parsing(): Promise<void> {
    await this.productionService.updateData()
  }
}
