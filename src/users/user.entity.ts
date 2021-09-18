import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../base/base.entity'

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column()
  email: string

  @Column()
  password: string
}