import { Column, Entity, OneToMany } from 'typeorm'
import { Field, ObjectType } from '@nestjs/graphql'

import { BaseEntity } from '../../base/base.entity'
import { ICategory } from '../interfaces/category.interface'
import { ProductionEntity } from './production.entity'

@ObjectType()
@Entity('category')
export class CategoryEntity extends BaseEntity implements ICategory {
  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  img: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  link: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  logo: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  title: string

  @Field(() => [ProductionEntity])
  @OneToMany(
    () => ProductionEntity,
    production => production.category,
    { cascade: true },
  )
  productions: ProductionEntity[]
}