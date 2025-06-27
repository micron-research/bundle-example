import Yaml from 'yaml'

import { Middleware, Context } from '../../pipeline'
import DocumentContext from '../context/document-context'

type Yaml = typeof Yaml

export class UnparseYaml implements Middleware {
  #yaml: Yaml

  constructor(yaml: Yaml) {
    this.#yaml = yaml
  }

  process(context: DocumentContext): DocumentContext {
    if ('bundled' in context) {
      context.bundled = this.#yaml.stringify(context.bundled)
    }

    return context
  }
}
