import { readFileSync } from 'node:fs'
import { Middleware, Context } from '../../pipeline'
import DocumentContext, { DocumentType } from '../context/document-context'

export class DocumentTypeLookup implements Middleware {
  #types: string[] = ['openapi', 'asyncapi', 'manifest', 'json-schema']

  process(context: DocumentContext): DocumentContext {
    this.#types.forEach((type) => {
      if (!context.type && context.contents.includes(type)) {
        context.type = type as DocumentType
      }
    })

    return context
  }
}
