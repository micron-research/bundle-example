import { Middleware, Context, Interrupt } from '../src/pipeline'

export interface ContentContext extends Context {
  content: string
}

export interface DummyContext extends Context {
  mushroom: string
  badger: string
}

export class DummyMiddleware implements Middleware {
  #content: string

  constructor(content: string) {
    this.#content = content
  }

  async process(context: ContentContext): Promise<ContentContext> {
    context.content += this.#content

    return context
  }
}

export class InterruptedMiddleware implements Middleware {
  async process(context: ContentContext): Promise<ContentContext> {
    context.content += 'interrupted'
    throw new Interrupt(context)
  }
}

export class ThrowingMiddleware implements Middleware {
  async process(context: ContentContext): Promise<ContentContext> {
    context.content += 'interrupted'
    throw new Error('error')
  }
}

export class TestPreviousValueMiddleware implements Middleware {
  #previous: string

  constructor(previous: string) {
    this.#previous = previous
  }
  async process(context: ContentContext): Promise<ContentContext> {

    return context
  }
}
