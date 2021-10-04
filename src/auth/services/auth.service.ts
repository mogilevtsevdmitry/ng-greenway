import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

import { UserService } from '../../users/user.service'
import { AuthHelper } from '../auth.helper'
import { UserEntity } from '../../users/user.entity'
import { IPayload } from '../interfaces'
import { TokensInput } from '../inputs/tokens.input'
import { UserInput } from '../../users/inputs/user.input'
import { TokenService } from './token.service'


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {
  }

  async login(userInput: UserInput): Promise<TokensInput> {
    const user = await this.validateUser(userInput)
    if (!user) {
      throw new HttpException('Не верный логин или пароль', HttpStatus.UNAUTHORIZED)
    }
    const payload: IPayload = { email: user.email, userId: user.id }
    return await this.getTokens(payload)
  }

  async register({ email, password }: UserInput): Promise<UserEntity> {
    const user = await this.userService.getUserByEmail(email)
    if (user) {
      throw new HttpException('Пользователь с таким email уже существует', HttpStatus.CONFLICT)
    }
    const hashedPassword = await AuthHelper.hash(password)
    return await this.userService.createUser({ email, password: hashedPassword })
  }

  async validateUser({ email, password }: UserInput): Promise<Partial<UserEntity>> | null {
    const user = await this.userService.getUserByEmail(email)
    if (user) {
      const isMatch = await AuthHelper.compare(password, user.password)
      if (!isMatch) {
        throw new HttpException('Не верный пароль', HttpStatus.UNAUTHORIZED)
      }
      delete user.password
      return user
    }
    return null
  }

  private async getTokens(payload: IPayload): Promise<TokensInput> {
    return await this.generateTokens(payload)
  }

  private async generateTokens(payload: IPayload): Promise<TokensInput> {
    const accessToken = {
      token: 'Bearer ' + this.jwtService.sign(payload),
      exp: new Date(Date.now() + parseInt(this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'))).valueOf(),
    }
    const user = await this.userService.getUserById(payload.userId)
    const refreshToken = await this.tokenService.createToken(user)
    return {
      accessToken, refreshToken: {
        token: refreshToken.token,
        exp: refreshToken.exp,
      },
    }
  }

  async updateToken(refreshToken: string): Promise<TokensInput> | null {
    const _refreshToken = await this.tokenService.getToken(refreshToken)
    if (_refreshToken) {
      return await this.generateTokens({ email: _refreshToken.user.email, userId: _refreshToken.user.id })
    }
    return null
  }
}