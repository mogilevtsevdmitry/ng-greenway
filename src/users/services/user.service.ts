import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserEntity } from '../user.entity'
import { UserInput } from '../inputs/user.input'

/**
 * Сервис для работы с пользователями
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  /**
   * Метод для получения всех пользователей
   */
  async getAllUsers(): Promise<UserEntity[]> {
    return await this.repo.find()
  }

  /**
   * Метод возвращающий одного пользователя по его id
   */
  async getUserById(id: number): Promise<UserEntity> {
    return await this.repo.findOne({ id })
  }

  /**
   * Возвращаем пользователя по его email
   */
  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.repo.findOne({ email })
  }

  /**
   * Возвращаем пользователя по уникальному хэшу, сгенерированному для активации пользователя
   */
  async getUserByHash(activateHash: string): Promise<UserEntity> {
    return await this.repo.findOne({ activateHash })
  }

  /**
   * Создаем пользователя
   */
  async createUser(user: UserInput | Partial<UserEntity>): Promise<UserEntity> {
    return await this.repo.save(user)
  }

  /**
   * Удаление пользователя
   */
  async removeUser(id: number): Promise<UserEntity> {
    const _user = await this.repo.findOne({ id })
    await this.repo.remove(_user)
    return _user
  }

  /**
   * Обновление пользователя
   */
  async updateUser(user: Partial<UserEntity>): Promise<UserEntity> {
    await this.repo.update({ id: user.id }, user)
    return await this.getUserById(user.id)
  }
}
