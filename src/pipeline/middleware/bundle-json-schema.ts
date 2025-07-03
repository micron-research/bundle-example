import { bundle as hyperJumpBundle } from '@hyperjump/json-schema/bundle'
import { Context, Middleware } from '../../pipeline.js'
import DocumentContext from '../context/document-context.js'
import deasync from 'deasync'
import { SchemaObject } from '@hyperjump/json-schema'

type Schema = {
  $id: string
}

export class BundleJsonSchema implements Middleware {
  #bundle: typeof hyperJumpBundle

  constructor(bundle: typeof hyperJumpBundle) {
    this.#bundle = bundle
  }

  async process(context: DocumentContext): Promise<DocumentContext> {

    if (context.type === 'json-schema' || context.type == 'manifest') {
      await this.#bundle(context.identifier, { alwaysIncludeDialect: false }).then((bundled) => {
        context.bundled = bundled
      })
    }

    return context
  }

  #getIdFromParsedSchema = (schema: Schema) => schema['$id']
}
