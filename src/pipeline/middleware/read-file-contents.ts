import { readFileSync } from 'node:fs'
import { Middleware, Context } from '../../pipeline'
import DocumentContext from '../context/document-context'

export class ReadFileContents implements Middleware {
  
  async process(context: DocumentContext): Promise<DocumentContext> {
    context.contents = (readFileSync(context.source, {
      encoding: 'utf-8',
    })).toString()

    return context
  }
}
