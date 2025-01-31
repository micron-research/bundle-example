import Mustache from 'mustache'

import { Middleware, Context } from '../../pipeline'
import DocumentContext from '../context/document-context.js'

type Mustache = typeof Mustache

export class RenderMustacheTags implements Middleware {
  #tags: Object

  constructor(tags: Object, mustache: Mustache) {
    this.#tags = tags
  }

  process(context: DocumentContext): DocumentContext {
    context.contents = Mustache.render(context.contents, this.#tags)

    return context
  }
}
