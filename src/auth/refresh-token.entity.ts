import { Field, ObjectType } from '@nestjs/graphql'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity } from '../users/user.entity'

@ObjectType()
@Entity('refresh_tokens')
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field({ nullable: false })
  token: string

  @Column('bigint')
  @Field()
  exp: number

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.token)
  user: UserEntity
}
