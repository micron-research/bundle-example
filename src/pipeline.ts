export interface Context {}

export class Interrupt extends Error implements Context {
  #context: Context

  constructor(context: Context) {
    super()
    this.#context = context
  }

  get context(): Context {
    return this.#context
  }
}

export interface Middleware {
  process(context: Context): Context
}

export interface Pipeline {
  push (...middlewares: Middleware[]): Pipeline
  unshift (...middlewares: Middleware[]): Pipeline
  insert (index: number, ...middlewares: Middleware[]): Pipeline
}

export class MiddlewarePipeline implements Middleware, Pipeline
{
  #middlewares: Set<Middleware>

  constructor(...middlewares: Middleware[]) {
    this.#middlewares = new Set();
    this.push(...middlewares)
  }

  push(...middlewares: Middleware[]): Pipeline {
    this.#middlewares = new Set([...this.#middlewares, ...middlewares])

    return this
  }

  unshift(...middlewares: Middleware[]): Pipeline {
    const arr: Middleware[] = Array.from(this.#middlewares)
    arr.unshift(...middlewares)
    this.#middlewares = new Set(arr)

    return this
  }

  insert(index: number, ...middlewares: Middleware[]): Pipeline {
    const arr: Middleware[] = Array.from(this.#middlewares)
    arr.splice(index, 0, ...middlewares)
    this.#middlewares = new Set(arr)

    return this
  }

  async process(context: Context): Promise<Context> {
    try {
      const middlewares: Middleware[] = Array.from(this.#middlewares)

      for await (const middleware of middlewares) {
        context = await middleware.process(context)
      }
    } catch (error) {
      if (!(error instanceof Interrupt)) {
        throw error
      }

      context = error.context
  }

    return context
  }
}
