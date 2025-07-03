import { Middleware, Context } from '../../pipeline'
import DocumentContext, { DocumentType } from '../context/document-context'

export class DocumentTypeLookup implements Middleware {
  #types: DocumentType[] = ['openapi', 'asyncapi', 'manifest', 'json-schema']

  async process(context: DocumentContext): Promise<DocumentContext> {
    this.#types.forEach((type) => {
      if (!context.type && context.contents.includes(type)) {
        context.type = type as DocumentType
      }
    })

    return context
  }
}
