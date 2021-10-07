import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { GoogleDto } from './inputs/google.dto'
import { AuthService } from './services/auth.service'
import { GoogleGuard } from './guards/google.guard'

@Controller('google')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

  @Get()
  @UseGuards(GoogleGuard)
  async googleLogin(@Req() req): Promise<GoogleDto> {
    return this.authService.googleLogin(req)
  }

  @Get('redirect')
  @UseGuards(GoogleGuard)
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req)
  }
}
