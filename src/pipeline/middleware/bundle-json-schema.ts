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

  process(context: DocumentContext): DocumentContext {

    if (context.type === 'json-schema' || context.type == 'manifest') {
      let done: SchemaObject;

      this.#bundle(context.identifier, { alwaysIncludeDialect: false }).then((bundled) => {
        done = bundled
      })

      let timer = setTimeout(function () {
        if (done) {
          context.bundled = done
          clearTimeout(timer)
          return context
        }
      }, 500)
    }

    return context
  }

  #getIdFromParsedSchema = (schema: Schema) => schema['$id']
}
