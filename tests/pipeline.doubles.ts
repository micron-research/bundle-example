import { Middleware, Context, Interrupt } from '../src/pipeline'

export class DummyMiddleware implements Middleware {
  #content: string

  constructor(content: string) {
    this.#content = content
  }

  process(context: Context): Context {
    context['content'] += this.#content

    return context
  }
}

export class InterruptedMiddleware implements Middleware {
  process(context: Context): Context {
    context.content += 'interrupted'
    throw new Interrupt(context)
  }
}

export class ThrowingMiddleware implements Middleware {
  process(context: Context): Context {
    context.content += 'interrupted'
    throw new Error()
  }
}

export interface DummyContext extends Context {
  mushroom: string
  badger: string
}
