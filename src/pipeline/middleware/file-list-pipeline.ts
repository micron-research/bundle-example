import { Middleware, MiddlewarePipeline } from '../../pipeline'
import { FileListContext } from '../context/file-list-context.js'
import DocumentContext from '../context/document-context.js'

export class FileListPipeline implements Middleware {
  #pipeline: MiddlewarePipeline

  constructor( ...middlewares: Middleware[]) {
    this.#pipeline = new MiddlewarePipeline(...middlewares)
  }

  process(context: FileListContext): FileListContext {
    context.files.forEach((file) => {
      file = this.#pipeline.process(file) as DocumentContext
    })

    return context
  }
}
