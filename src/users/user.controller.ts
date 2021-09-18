import { Body, Controller, Get, Post } from '@nestjs/common'
import { UserService } from './user.service'
import { UserEntity } from './user.entity'
import { CreateUserDto } from './dto/create-user.dto'

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {
  }

  @Get('all-users')
  async getAllUsers(): Promise<UserEntity[]> {
    return this.userService.getAllUsers()
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(createUserDto)
  }
}
