import { Context, Middleware } from '../../pipeline.js'

export class BundleJsonSchema implements Middleware {
  process(context: Context): Context {
    return context
  }
}
