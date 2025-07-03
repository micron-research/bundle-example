import { mkdirSync } from 'node:fs'
import { Middleware, Context } from '../../pipeline'
import DocumentContext from '../context/document-context'

export class EnsureTarget implements Middleware {
  #target: string

  constructor (target: string) {
    this.#target = target
  }

  async process(context: DocumentContext): Promise<DocumentContext> {

    try {
      mkdirSync(this.#target)
    } catch (_) {
    }

    return context
  }
}
