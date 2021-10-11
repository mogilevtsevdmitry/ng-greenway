import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
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
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
    }),
    UserModule,
    ProductionModule,
    AuthModule,
    NodemailerModule,
  ],
  providers: [DbConfigService],
})
export class AppModule {
}
