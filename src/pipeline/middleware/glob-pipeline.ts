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

  async process(context: FileListContext): Promise<FileListContext> {
    const files = globSync(this.#pattern, this.#options)

    for await (let file of files) {
      file = typeof file === 'string' ? file : file.fullpath();
      let document = this.#createContextForFile(file)
      document = await this.#pipeline.process(document)
      context.files.set((document as DocumentContext).identifier, document as DocumentContext)
    }

    return context
  }

  #createContextForFile(file: string): Context {
    return {
      source: file
    } as Context
  }
}
