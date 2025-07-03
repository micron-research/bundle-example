import { Console } from 'node:console'
import { Middleware, Context } from '../../pipeline'
import DocumentContext from '../context/document-context'

export class ConsoleLog implements Middleware {
  #console: Console

  constructor(console: Console) {
    this.#console = console
  }

  async process(context: DocumentContext): Promise<DocumentContext> {

    this.#console.log(context.bundled);

    return context
  }
}
