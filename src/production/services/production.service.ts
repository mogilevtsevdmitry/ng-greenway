import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import * as request from 'request'
import * as cheerio from 'cheerio'
import { Not, Repository } from 'typeorm'

import { ICategory } from '../interfaces/category.interface'
import { IProduction } from '../interfaces/production.interface'
import { CategoryEntity } from '../entities/category.entity'
import { ProductionEntity } from '../entities/production.entity'

interface IProductionInfo {
  images?: string[]
  instructions?: string
}

@Injectable()
export class ProductionService {
  private readonly URL: string
  private readonly delay: number = 3600000 // 60 мин

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repoCategory: Repository<CategoryEntity>,
    @InjectRepository(ProductionEntity)
    private readonly repoProduction: Repository<ProductionEntity>,
    private readonly configService: ConfigService,
  ) {
    this.URL = this.configService.get<string>('URL_GREENWAY')
  }

  async updateData(): Promise<void> {
    try {
      setInterval(async () => {
        // обновляем или вставляем категории
        await this.insertOrUpdateCategories_()
        // обновлем или вставляем продукцию
        await this.insertOrUpdateProductions_()
      }, this.delay)
    } catch (e) {
      throw new HttpException(
        `Ошибка парсинга: ${e}`,
        HttpStatus.GATEWAY_TIMEOUT,
      )
    }
  }

  async getAllProductions(options: any = {}): Promise<ProductionEntity[]> {
    return await this.repoProduction.find({
      relations: ['category'],
      where: options,
    })
  }

  async getAllCategories(options: any = {}): Promise<CategoryEntity[]> {
    return await this.repoCategory.find({
      relations: ['productions'],
      where: options,
    })
  }

  private async insertOrUpdateCategories_(): Promise<void> {
    try {
      // получаем категории с бд
      const categoriesFromDb = await this.repoCategory.find()
      // получаем категории путем парсинга с сайта
      const categories = await this.getCategories()
      // получаем новые категории
      const newCategories = categories.filter(
        (cat) => !categoriesFromDb.map((c) => c.title).includes(cat.title),
      )
      // фильтруем данные для обновления
      const categoriesToUpdate = categories.filter((cat) =>
        categoriesFromDb.map((c) => c.title).includes(cat.title),
      )
      // Категории к удалению
      const categoriesToDelete = categoriesFromDb.filter(
        (cat) => !categories.map((c) => c.title).includes(cat.title),
      )
      // если появились новые категории - выполняем их вставку в бд
      if (newCategories.length > 0) {
        await this.repoCategory.save(newCategories)
      }
      // обновляем данные в бд
      if (categoriesToUpdate.length > 0) {
        for (const category of categoriesToUpdate) {
          await this.repoCategory.update(
            { title: category.title },
            { ...category },
          )
        }
      }
      // удаляем категории
      await this.repoCategory.remove(categoriesToDelete)
    } catch (e) {
      throw new Error(`insertOrUpdateCategories_ error: ${e}`)
    }
  }

  private async insertOrUpdateProductions_(): Promise<void> {
    try {
      // Получаем все категории с БД, т.к. будем итерироваться по ссылке на продукцию
      const categories = await this.repoCategory.find()
      for (const category of categories) {
        // Продукция по переданной ссылке категории
        const productions = await this.getItems(category.link)

        // массив продукции к удалению, которых больше нет на сайте
        const productionToDelete = await this.repoProduction.find({
          where: {
            // фильтруем по продукции которая есть в БД, но нет на сайте
            title: Not([...new Set(productions.map((p) => p.title))]),
            category,
          },
        })
        // если массив не пустой - удаляем
        if (productionToDelete.length > 0) {
          await this.repoProduction.remove(productionToDelete)
        }

        for (const production of productions) {
          const productionInfo = await this.getItemInfo(production.link)
          const newProd = Object.assign(production, productionInfo, {
            category,
          })
          console.log('newProd', newProd)
          const candidate = await this.repoProduction.findOne({
            where: { article: production.article },
          })
          if (candidate) {
            // Обновляем поля
            await this.repoProduction.update(candidate.id, { ...newProd })
          } else {
            // Сохраняем
            await this.repoProduction.save(newProd)
          }
        }
      }
    } catch (e) {
      throw new Error(`insertOrUpdateProductions_ error: ${e}`)
    }
  }

  async getCategories(): Promise<ICategory[]> {
    return new Promise<ICategory[]>((resolve) => {
      request(`${this.URL}/rus/`, (err, res, body) => {
        const categories: ICategory[] = []
        if (err) throw err
        const $ = cheerio.load(body)
        console.log('$', $)
        $('.product-item').each((i) => {
          const link = `${this.URL}${$('.product-item>a').eq(i).attr('href')}`
          const logo = `${this.URL}${$('.brand-logo').eq(i).attr('src')}`
          const title = $('.product-title').eq(i).text()
          const description = $('.product-info>p').eq(i).text()
          const img = `${this.URL}${$('.product-img').eq(i).attr('src')}`
          categories.push({
            link,
            logo,
            title,
            description,
            img,
          })
        })
        console.log('categories', categories)
        resolve(categories)
      })
    })
  }

  private async getItems(url: string): Promise<IProduction[]> {
    return new Promise<IProduction[]>((resolve) => {
      const items: IProduction[] = []
      request(url, (err, res, body) => {
        if (err) throw err
        const $ = cheerio.load(body)
        $('.catalog-item').each((i) => {
          const link = `${this.URL}${$('.wrap-catalog-img>a')
            .eq(i)
            .attr('href')}`
          const image = `${this.URL}${$('.catalog-item-img>img')
            .eq(i)
            .attr('src')}`
          const article = $('.catalog-item-code').eq(i).text()
          const title = $('.catalog-item-title')
            .eq(i)[0]
            .children[0]['data'].trim()
          const description = $('.catalog-item-title>span').eq(i).text()
          const itemInfo = $('.catalog-item-info')
            .eq(i)
            .children('p')
            .text()
            .split(' ')
          const v = this.getValFromItemInfo(itemInfo, 'объём')
          const p = this.getValFromItemInfo(itemInfo, 'цена')
          items.push({
            article,
            title,
            image,
            link,
            p,
            v,
            description,
          })
        })
        resolve(items)
      })
    })
  }

  private async getItemInfo(url: string): Promise<IProductionInfo> {
    return new Promise((resolve) => {
      request(url, (err, res, body) => {
        if (err) throw err
        const $ = cheerio.load(body)
        const images: string[] = []
        $('.gallery-thumb').each((i) => {
          images.push(`${this.URL}${$('.img-responsive').eq(i).attr('src')}`)
        })
        const instructions = $('#description')
          .html()
          .replace(/[\n\t]/g, '')
          .trim()
        resolve({ images, instructions })
      })
    })
  }

  private getValFromItemInfo(arr: string[], col: string): number {
    return (
      arr
        .map((el) =>
          el.toLowerCase().includes(col) ? +el.replace(/\D/g, '') : 0,
        )
        .filter((e) => e !== 0)[0] || 0
    )
  }
}
