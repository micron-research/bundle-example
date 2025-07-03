import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { Middleware, Context } from '../../pipeline'
import DocumentContext from '../context/document-context'

export class WriteBundleToTarget implements Middleware {

  async process(context: DocumentContext): Promise<DocumentContext> {

    if (context.bundled) {
      try {
        let filePath = path.dirname(context.target)
        mkdirSync(filePath)
        writeFileSync(context.target, context.bundled as string, { flag: 'w+' })
      } catch (_) {}
    }

    return context
  }
}
