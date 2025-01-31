import Yaml from 'yaml'

import { Middleware, Context } from '../../pipeline'
import DocumentContext from '../context/document-context'

type Yaml = typeof Yaml

export class ParseYaml implements Middleware {
  #yaml: Yaml

  constructor(yaml: Yaml) {
    this.#yaml = yaml
  }

  process(context: DocumentContext): DocumentContext {
    context.schema = this.#yaml.parse(context.contents)

    return context
  }
}
