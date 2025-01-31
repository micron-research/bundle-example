import { Context } from '../../pipeline'

export type DocumentType = 'openapi' | 'asyncapi' | 'json-schema' | 'manifest'

export default interface DocumentContext extends Context {
  source: string
  target: string
  type: DocumentType
  contents: string
  schema: object
}
