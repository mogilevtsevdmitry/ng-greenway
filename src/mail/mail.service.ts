import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class MailService {
  host: string
  port: number

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.host = configService.get<string>('MAIN_HOST')
    this.port = configService.get<number>('API_PORT')
  }

  async sendUserConfirmation(email: string, token: string) {
    const url = `${this.host}${this.port}/auth/confirm?token=${token}`
    const options = {
      to: email,
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation',
      context: {
        name: email,
        url,
      },
    }
    await this.mailerService.sendMail(options)
  }
}
