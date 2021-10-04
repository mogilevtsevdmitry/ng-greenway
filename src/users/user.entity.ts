import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '../base/base.entity'
import { Field, ObjectType } from '@nestjs/graphql'
import { RefreshTokenEntity } from '../auth/refresh-token.entity'

@ObjectType()
@Entity('users')
export class UserEntity extends BaseEntity {
  @Field({ nullable: false })
  @Column()
  email: string

  @Field({ nullable: false })
  @Column()
  password: string

  @Field(() => [RefreshTokenEntity])
  @OneToMany(() => RefreshTokenEntity, token => token.token)
  token: RefreshTokenEntity[]
}