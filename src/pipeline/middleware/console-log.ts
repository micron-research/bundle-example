import { Middleware, Context } from '../../pipeline'
import DocumentContext from '../context/document-context'

export class ConsoleLog implements Middleware {
  #console: Console

  constructor(console: Console) {
    this.#console = console
  }

  process(context: DocumentContext): DocumentContext {

    this.#console.log(context);

    return context
  }
}
