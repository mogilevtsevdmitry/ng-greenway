/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { UserEntity } from './user.entity'
import { Repository } from 'typeorm'
import { UserInput } from './inputs/user.input'

/**
 * Class UserService
 * 
 * Методы для работы с пользователями системы
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  /**
   * method getAllUsers
   * 
   * @returns список всех пользователей
   */
  async getAllUsers(): Promise<UserEntity[]> {
    return await this.repo.find()
  }

  /**
   * method getUserById
   * 
   * @param {id} Поиск пользователя по переданному id
   * @returns Возвращает одного пользователя
   */
  async getUserById(id: number): Promise<UserEntity> {
    return await this.repo.findOne({ id })
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.repo.findOne({ email })
  }

  async getUserByHash(activateHash: string): Promise<UserEntity> {
    return await this.repo.findOne({ activateHash })
  }

  async createUser(user: UserInput | Partial<UserEntity>): Promise<UserEntity> {
    return await this.repo.save(user)
  }

  async removeUser(id: number): Promise<UserEntity> {
    const _user = await this.repo.findOne({ id })
    await this.repo.remove(_user)
    return _user
  }

  async updateUser(user: Partial<UserEntity>): Promise<UserEntity> {
    await this.repo.update({ id: user.id }, user)
    return await this.getUserById(user.id)
  }
}
