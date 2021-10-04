import { Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { ProductionService } from './services/production.service'
import { ProductionEntity } from './entities/production.entity'
import { GqlAuthGuard } from '../auth/gql-auth.guard'
import { Void } from '../config/scalar-void'
import { CategoryEntity } from './entities/category.entity'

@Resolver('Production')
export class ProductionResolver {
  constructor(
    private readonly productionService: ProductionService,
  ) {
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [ProductionEntity], { nullable: true })
  async getProduction(): Promise<ProductionEntity[]> {
    return await this.productionService.getAll()
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [CategoryEntity], { nullable: true })
  async getAllCategories(): Promise<CategoryEntity[]> {
    return await this.productionService.getAllCategories()
  }

  @Mutation(() => Void, { nullable: true })
  async parsing(): Promise<void> {
    await this.productionService.updateData()
  }
}
