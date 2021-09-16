import { Injectable } from '@nestjs/common'
import * as request from 'request'
import * as cheerio from 'cheerio'

export interface ICategory {
  id?: number
  link?: string
  logo?: string
  title?: string
  description?: string
  img?: string
}

export interface IItem {
  id?: number
  link?: string
  img?: string
  article?: string
  title?: string
  description?: string
  v?: number
  p?: number
}

@Injectable()
export class AppService {
  private readonly URI: string = 'https://greenwaystart.com'

  async getCategories(): Promise<ICategory[]> {
    return new Promise<ICategory[]>((resolve) => {
      request(`${this.URI}rus/`, (err, res, body) => {
        const categories: ICategory[] = []
        if (err) throw err
        const $ = cheerio.load(body)
        $('.product-item').each((i) => {
          const link = `https://greenwaystart.com${$('.product-item>a')
            .eq(i)
            .attr('href')}`
          const logo = `https://greenwaystart.com${$('.brand-logo')
            .eq(i)
            .attr('src')}`
          const title = $('.product-title').eq(i).text()
          const description = $('.product-info>p').eq(i).text()
          const img = `https://greenwaystart.com${$('.product-img')
            .eq(i)
            .attr('src')}`
          categories.push({
            link,
            logo,
            title,
            description,
            img,
          })
        })
        resolve(categories)
      })
    })
  }

  async getItems(url: string): Promise<IItem[]> {
    return new Promise<IItem[]>((resolve) => {
      const items: IItem[] = []
      request(url, (err, res, body) => {
        if (err) throw err
        const $ = cheerio.load(body)
        $('.catalog-item').each((i) => {
          const link = `${this.URI}${$('.wrap-catalog-img>a')
            .eq(i)
            .attr('href')}`
          const img = `${this.URI}${$('.catalog-item-img>img')
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
            link,
            img,
            article,
            title,
            description,
            v,
            p,
          })
        })
        resolve(items)
      })
    })
  }

  async getItemInfo(url: string): Promise<any> {
    return new Promise((resolve) => {
      const items = []
      request(url, (err, res, body) => {
        if (err) throw err
        const $ = cheerio.load(body)
        const img = []
        $('.gallery-thumb').each((i) => {
          img.push(`${this.URI}${$('.img-responsive').eq(i).attr('src')}`)
        })
        const title = $('h1').text()
        const description = $('#description')
          .html()
          .replace(/[\n\t]/g, '')
          .trim()

        items.push({
          img,
          title,
          description,
        })
        resolve(items)
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
