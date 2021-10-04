import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AuthService } from './services/auth.service'
import { AuthResolver } from './auth.resolver'
import { UserModule } from '../users/user.module'
import { JwtStrategy } from './jwt.strategy'
import { TokenService } from './services/token.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RefreshTokenEntity } from './refresh-token.entity'

@Module({
  imports: [
    UserModule,
    PassportModule,
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('JWT_ACCESS_EXPIRES_IN'),
        },
      }),
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, TokenService],
})
export class AuthModule {
}
