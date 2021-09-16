import { Controller, Get } from '@nestjs/common'
import { AppService, ICategory, IItem } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('items')
  async getItems(): Promise<IItem[]> {
    return await this.appService.getItems(
      'https://greenwaystart.com/products/iGen/',
    )
  }

  @Get('item-info')
  async getItemInfo(): Promise<any[]> {
    return await this.appService.getItemInfo(
      'https://greenwaystart.com/products/iGen/05101/',
    )
  }

  @Get('categories')
  async getCategories(): Promise<ICategory[]> {
    return await this.appService.getCategories()
  }
}
