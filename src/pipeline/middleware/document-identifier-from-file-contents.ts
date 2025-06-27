import { Middleware, Context } from '../../pipeline'
import DocumentContext from '../context/document-context'

type Schema = {
  $id: string
}

export class DocumentIdentifierFromFileContents implements Middleware {
  process(context: DocumentContext): DocumentContext {
    context.identifier = this.#getIdFromParsedSchema(context.schema as Schema)

    return context
  }

  #getIdFromParsedSchema = (schema: Schema) => schema['$id']
}
