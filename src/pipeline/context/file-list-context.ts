import { Context } from '../../pipeline.js'
import DocumentContext from './document-context.js'

export interface FileListContext extends Context {
  files: Map<string, DocumentContext>
}
