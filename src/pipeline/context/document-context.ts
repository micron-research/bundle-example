import { SchemaObject } from '@hyperjump/json-schema'
import { Context } from '../../pipeline'

export type DocumentType = 'openapi' | 'asyncapi' | 'json-schema' | 'manifest'

export default interface DocumentContext extends Context {
  identifier: string
  source: string
  target: string
  type: DocumentType
  contents: string
  bundled: string|SchemaObject
  schema: object
}
