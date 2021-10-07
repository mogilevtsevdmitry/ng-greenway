import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { UserEntity } from './user.entity'
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'
import { UserService } from './user.service'
import { UserInput } from './inputs/user.input'

@Resolver('Users')
export class UserResolver {
  constructor(private readonly userService: UserService) {
  }

  @Mutation(() => UserEntity)
  async createUser(@Args('user') user: UserInput): Promise<UserEntity> {
    return await this.userService.createUser(user)
  }

  @Query(() => [UserEntity])
  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userService.getAllUsers()
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => UserEntity)
  async whoAmI(@CurrentUser() user: UserEntity): Promise<UserEntity> {
    return await this.userService.getUserByEmail(user.email)
  }
}
