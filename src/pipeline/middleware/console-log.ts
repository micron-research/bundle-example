import { Console } from 'node:console'
import { Middleware, Context } from '../../pipeline'
import DocumentContext from '../context/document-context'
import { FileListContext } from '../context/file-list-context.js';

export class ConsoleLog implements Middleware {
  #console: Console

  constructor(console: Console) {
    this.#console = console
  }

  process(context: FileListContext): FileListContext {

    this.#console.log(context);

    return context
  }
}
