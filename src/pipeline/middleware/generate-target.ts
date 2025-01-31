import { Middleware, Context } from '../../pipeline'
import DocumentContext from '../context/document-context'

export class GenerateTarget implements Middleware {
  #source: string
  #target: string

  constructor(source: string, target: string) {
    this.#source = source
    this.#target = target
  }

  process(context: DocumentContext): DocumentContext {

    context.target = context.source.replace(this.#source, this.#target)

    return context
  }
}
