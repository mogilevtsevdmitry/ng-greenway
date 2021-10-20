import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class Token {
  @Field() token: string
  @Field() exp: number
}

@ObjectType()
export class TokensInput {
  @Field() accessToken: Token
  @Field() refreshToken: Token
}
