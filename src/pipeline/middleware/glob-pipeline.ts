import { GlobOptions, globSync } from 'glob'

import { Context, Middleware, MiddlewarePipeline } from '../../pipeline'
import { FileListContext } from '../context/file-list-context'
import DocumentContext from '../context/document-context'

export class GlobPipeline implements Middleware {
  #pattern: string
  #options: GlobOptions
  #pipeline: MiddlewarePipeline

  constructor(pattern: string, options: GlobOptions = {}, ...middlewares: Middleware[]) {
    this.#pattern = pattern
    this.#options = options
    this.#pipeline = new MiddlewarePipeline(...middlewares)
  }

  process(context: FileListContext): FileListContext {
    const files = globSync(this.#pattern, this.#options)

    files.forEach(file => {
      file = typeof file === 'string' ? file : file.fullpath();
      let document = this.#createContextForFile(file)
      document = this.#pipeline.process(document)
      context.files.set((document as DocumentContext).identifier, document as DocumentContext)
    });

    return context
  }

  #createContextForFile(file: string): Context {
    return {
      source: file
    } as Context
  }
}
