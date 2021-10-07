import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class GoogleDto {
  @Field({ nullable: true }) user?: any
}