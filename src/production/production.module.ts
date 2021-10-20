import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProductionService } from './services/production.service'
import { ProductionEntity } from './entities/production.entity'
import { CategoryEntity } from './entities/category.entity'
import { ProductionResolver } from './production.resolver'
import { ProductionController } from './production.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductionEntity, CategoryEntity])],
  providers: [ProductionService, ProductionResolver],
  exports: [ProductionService],
  controllers: [ProductionController],
})
export class ProductionModule {}
