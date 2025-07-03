import { beforeEach, describe, expect, expectTypeOf, test } from 'vitest'
import { Context, Middleware, Pipeline, MiddlewarePipeline, Interrupt } from '@/pipeline'
import * as doubles from '@/pipeline.doubles'

let pipeline: Pipeline
let context: ContentContext

beforeEach(() => {
  pipeline = new MiddlewarePipeline()
  context = { content: '' } as ContentContext
})

test('passes empty context through empty pipeline', async () => {
  let passthrough = await pipeline.process(context)

  expect(passthrough.content).toBe('')
})

test('applies middleware to a context', async () => {
  let middleware = new doubles.DummyMiddleware('badger')
  pipeline.push(middleware)

  let passthrough = await pipeline.process(context)

  expectTypeOf(passthrough).toEqualTypeOf(context)
  expect(passthrough.content).toBe('badger')
})

test('applies multiple middlewares to a context', async () => {
  let middlewares = [
    new doubles.DummyMiddleware('badger'),
    new doubles.DummyMiddleware('mushroom')
  ]
  pipeline.push(...middlewares)

  let passthrough = await pipeline.process(context)

  expect(passthrough.content).toBe('badgermushroom')
})

test('middleware can be interrupted', async () => {
  let middlewares = [
    new doubles.DummyMiddleware('badger'),
    new doubles.InterruptedMiddleware(),
    new doubles.DummyMiddleware('mushroom')
  ]
  pipeline.push(...middlewares)

  let passthrough = await pipeline.process(context)

  expect(passthrough.content).toBe('badgerinterrupted')
})

test('middleware can be added to beginning of list', async () => {
  let middlewares = [
    new doubles.DummyMiddleware('badger'),
  ]
  pipeline.push(...middlewares)
  pipeline.unshift(new doubles.DummyMiddleware('mushroom'))

  let passthrough = await pipeline.process(context)

  expect(passthrough.content).toBe('mushroombadger')
})

test('middleware can be inserted into list', async () => {
  let middlewares = [
    new doubles.DummyMiddleware('badger'),
    new doubles.DummyMiddleware('mushroom'),
    new doubles.DummyMiddleware('snaaake'),
  ]
  pipeline.push(...middlewares)
  pipeline.insert(2, new doubles.DummyMiddleware('inserted'))

  let passthrough = await pipeline.process(context)

  expect(passthrough.content).toBe('badgermushroominsertedsnaaake')
})

test('that middleware throws errors', async () => {
  let middlewares = [
    new doubles.ThrowingMiddleware(),
  ]
  pipeline.push(...middlewares)

  await expect((async () => {
    await pipeline.process(context)
  })()).rejects.toThrowError();
})
