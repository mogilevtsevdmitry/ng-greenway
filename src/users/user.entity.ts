import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '../base/base.entity'
import { Field, ObjectType } from '@nestjs/graphql'
import { RefreshTokenEntity } from '../auth/refresh-token.entity'
import { SOCIAL_NETWORKS } from '../auth/interfaces'

@ObjectType()
@Entity('users')
export class UserEntity extends BaseEntity {
  @Field({ nullable: false })
  @Column()
  email: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  password: string

  @Field({ defaultValue: false })
  @Column({ default: false })
  isActivated: boolean

  @Field({ nullable: true })
  @Column({ nullable: true })
  activateHash: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  firstName: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastName: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  photo: string

  @Field({ nullable: true, defaultValue: false })
  @Column('enum', { nullable: true, name: 'created_by', enum: SOCIAL_NETWORKS })
  createdBy: string

  @Field(() => [RefreshTokenEntity], { nullable: true })
  @OneToMany(() => RefreshTokenEntity, token => token.token)
  token: RefreshTokenEntity[]
}