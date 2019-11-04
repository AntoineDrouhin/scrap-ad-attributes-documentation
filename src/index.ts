import * as attributeNames from './attributes.json'
import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import * as fs from 'fs'

const docUrl = 'https://docs.microsoft.com/en-us/windows/win32/adschema/'
const attributeUrlPrefix = 'a-'

interface Attribute {
  name: string
  type: string
  documentationUrl: string
}

const attributes: Array<Attribute> = []

attributeNames.map(attr => {
  attributes.push({
    name: attr,
    // @ts-ignore
    type: objectsList[objectKey][attr].type,
    documentationUrl: docUrl + attributeUrlPrefix + attr
  })
})

const wait = attributes.map(attribute => {
  return fetch(attribute.documentationUrl)
    .then(res => res.text())
    .then(res => {
      const $ = cheerio.load(res)

      const properties: any = {}
      const implementations: Array<any> = []

      // First TBody => abstract definition
      $('tbody').each((i, element) => {
        if (i === 0) {
          const trs = element.children.filter(child => child.type === 'tag' && child.name === 'tr')
          trs.map(tr => {
            const tds = tr.children.filter(item => item.type === 'tag' && item.name === 'td')

            // @ts-ignore
            properties[tds[0].firstChild.data] = tds[1].firstChild.data
              ? { type: 'text', value: tds[1].firstChild.data }
              : {
                  type: 'url',
                  value: tds[1].firstChild.attribs['href'],
                  link: docUrl + tds[1].firstChild.attribs['href']
                }
          })
        }

        // Following TBody => implementation definition
        if (i > 0) {
          const implemProperties = {}
          const trs = element.children.filter(child => child.type === 'tag' && child.name === 'tr')
          trs.map(tr => {
            const tds = tr.children.filter(item => item.type === 'tag' && item.name === 'td')

            // @ts-ignore
            implemProperties[tds[0].firstChild.data] = tds[1].firstChild.data
              ? { type: 'text', value: tds[1].firstChild.data }
              : {
                  type: 'url',
                  value: tds[1].firstChild.attribs['href'],
                  link: docUrl + tds[1].firstChild.attribs['href']
                }
          })

          implementations.push({
            index: i,
            title: element.parent.prev.prev.attribs['id'],
            properties: implemProperties
          })
        }
      })

      return { properties, implementations }
    })
})

Promise.all(wait).then(attributeDocumentations => {
  fs.writeFile(
    './documented_attributes.json',
    JSON.stringify(attributeDocumentations, undefined, 2),
    err => {
      if (err) {
        console.error(err)
        return
      }
      console.log('Updated ./documented_attributes.json')
    }
  )
})
