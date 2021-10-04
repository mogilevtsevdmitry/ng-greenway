import { Column, Entity, ManyToOne } from 'typeorm'
import { Field, ObjectType } from '@nestjs/graphql'

import { BaseEntity } from '../../base/base.entity'
import { IProduction } from '../interfaces/production.interface'
import { CategoryEntity } from './category.entity'

@ObjectType()
@Entity('production')
export class ProductionEntity extends BaseEntity implements IProduction {
  @Field({ nullable: true })
  @Column({ nullable: true })
  article: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  title: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  image: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  link: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  p: number

  @Field({ nullable: true })
  @Column({ nullable: true })
  v: number

  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  instructions: string

  @Field(() => [String], { nullable: true })
  @Column('simple-array')
  images: string[]

  @Field(() => CategoryEntity)
  @ManyToOne(
    () => CategoryEntity,
    category => category.productions,
  )
  category: CategoryEntity
}