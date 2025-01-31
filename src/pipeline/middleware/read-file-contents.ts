import { readFileSync } from 'node:fs'
import { Middleware, Context } from '../../pipeline'
import DocumentContext from '../context/document-context'

export class ReadFileContents implements Middleware {
  process(context: DocumentContext): DocumentContext {
    context.contents = (readFileSync(context.source, {
      encoding: 'utf-8',
    })).toString()

    return context
  }
}
