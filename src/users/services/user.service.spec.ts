import { getRepositoryToken } from '@nestjs/typeorm'
import { Test, TestingModule } from '@nestjs/testing'
// import { Repository } from 'typeorm'

import { UserEntity } from './../user.entity'
import { UserService } from './user.service'

const users = [
  { id: 1, email: 'test1@mail.ru', password: '123456' },
  { id: 2, email: 'test2@mail.ru', password: '1234567' },
]

const user = { id: 1, email: 'test1@mail.ru', password: '123456' }

describe('User service', () => {
  let service: UserService
  // let repository: Repository<UserEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            getAllUsers: jest.fn().mockResolvedValue(users),
            getUserById: jest.fn().mockResolvedValue(user),
          },
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
    // repository = module.get<Repository<UserEntity>>(
    //   getRepositoryToken(UserEntity),
    // )
  })

  it('Service shoud be defined', () => {
    expect(service).toBeDefined()
  })

  // describe('getAllUsers()', () => {
  //   it('shoud return array of users', async () => {
  //     const _users = await service.getAllUsers()
  //     console.log('_users', _users)
  //     expect(_users).toEqual(users)
  //   })
  // })

  describe('getUserById()', () => {
    it('should get a single user', () => {
      const repoSpy = jest.spyOn(service, 'getUserById')
      expect(service.getUserById(1)).resolves.toEqual(user)
      expect(repoSpy).toBeCalledWith(1)
    })
  })
})
