import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common'
import { GoogleDto } from './inputs/google.dto'
import { AuthService } from './services/auth.service'
import { GoogleGuard } from './guards/google.guard'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleGuard)
  async googleLogin(@Req() req): Promise<GoogleDto> {
    return this.authService.googleLogin(req)
  }

  @Get('google/redirect')
  @UseGuards(GoogleGuard)
  googleAuthRedirect(@Req() req): Promise<GoogleDto> {
    return this.authService.googleLogin(req)
  }

  @Get('activate/:hash')
  activate(@Param() params) {
    console.log(params.hash)
    return this.authService.activate(params.hash)
  }
}
