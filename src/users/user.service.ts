import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'
import { Repository } from 'typeorm'
import { UserInput } from './inputs/user.input'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.repo.find()
  }

  async getUserById(id: number): Promise<UserEntity> {
    return await this.repo.findOne({ id })
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.repo.findOne({ email })
  }

  async createUser(user: UserInput): Promise<UserEntity> {
    return await this.repo.save(user)
  }

  async removeUser(id: number): Promise<boolean> {
    const userToDelete = await this.repo.findOne({ id })
    const removed = await this.repo.remove(userToDelete)
    return !!removed
  }
}
