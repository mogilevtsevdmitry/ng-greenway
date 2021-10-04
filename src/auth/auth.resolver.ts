import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AuthService } from './services/auth.service'
import { TokensInput } from './inputs/tokens.input'
import { UserEntity } from '../users/user.entity'
import { UserInput } from '../users/inputs/user.input'

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly auth: AuthService) {
  }

  @Mutation(() => TokensInput)
  async login(@Args('user') user: UserInput): Promise<TokensInput> {
    return await this.auth.login(user)
  }

  @Mutation(() => UserEntity)
  async register(@Args('user') user: UserInput): Promise<UserEntity> {
    return await this.auth.register(user)
  }

  @Query(() => TokensInput)
  async updateToken(@Context('req') req): Promise<TokensInput> | null {
    const refreshToken = req?.headers?.refreshtoken
    if (!refreshToken) {
      return null
    }
    return await this.auth.updateToken(refreshToken)
  }
}
