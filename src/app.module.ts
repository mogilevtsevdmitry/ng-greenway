import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { ProductionModule } from './production/production.module'
import { DbConfigService } from './config/db-config.service'
import { UserModule } from './users/user.module'
import { AuthModule } from './auth/auth.module'
import { NodemailerModule } from './nodemailer/nodemailer.module'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DbConfigService,
      inject: [DbConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: 'schema.gql',
        sortSchema: true,
        cors: {
          origin: `${configService.get<string>(
            'MAIN_HOST',
          )}${configService.get<string>('API_PORT')}`,
          credentials: true,
        },
        context: ({ req, res }) => ({ req, res }),
        playground: {
          settings: {
            'request.credentials': 'include',
          },
        },
      }),
    }),
    UserModule,
    ProductionModule,
    AuthModule,
    NodemailerModule,
  ],
  providers: [DbConfigService],
})
export class AppModule {}
