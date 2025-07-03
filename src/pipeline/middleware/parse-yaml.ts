import Yaml from 'yaml'
import { Middleware } from '../../pipeline'
import DocumentContext from '../context/document-context'

type Yaml = typeof Yaml

export class ParseYaml implements Middleware {
  #yaml: Yaml

  constructor(yaml: Yaml) {
    this.#yaml = yaml
  }

  async process(context: DocumentContext): Promise<DocumentContext> {
    context.schema = this.#yaml.parse(context.contents)

    return context
  }
}
