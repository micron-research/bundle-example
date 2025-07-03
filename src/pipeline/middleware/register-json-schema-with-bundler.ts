import { SchemaObject, registerSchema } from '@hyperjump/json-schema'

import { Middleware, Context } from '../../pipeline'
import DocumentContext from '../context/document-context'

type Schema = {
  $id: string
  $schema: string
}

export class RegisterJsonSchemaWithBundler implements Middleware {
  #register: typeof registerSchema

  constructor(register: typeof registerSchema) {
    this.#register = register
  }

  async process(context: DocumentContext): Promise<DocumentContext> {
    if (context.type === 'json-schema' || context.type === 'manifest') {
      let [$id, $schema] = this.#getDetailsFromParsedSchema(context.schema as Schema)

      this.#register(context.schema as SchemaObject, $id, $schema)
    }

    return context
  }

  #getDetailsFromParsedSchema = (schema: Schema) => [schema['$id'], schema['$schema']]
}
