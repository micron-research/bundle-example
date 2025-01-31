import { beforeEach, describe, expect, expectTypeOf, test } from 'vitest'
import { Context, Middleware, Pipeline, MiddlewarePipeline, Interrupt } from '@/pipeline'
import * as doubles from '@/pipeline.doubles'

interface ContentContext extends Context {
  content: any
}

let pipeline: Pipeline
let context: ContentContext

beforeEach(() => {
  pipeline = new MiddlewarePipeline()
  context = { content: '' }
})

test('passes empty context through empty pipeline', () => {
  let passthrough = pipeline.process(context)

  expect(passthrough.content).toBe('')
})

test('applies middleware to a context', () => {
  let middleware = new doubles.DummyMiddleware('badger')
  pipeline.push(middleware)

  let passthrough = pipeline.process(context)

  expectTypeOf(passthrough).toEqualTypeOf(context)
  expect(passthrough.content).toBe('badger')
})

test('applies multiple middlewares to a context', () => {
  let middlewares = [
    new doubles.DummyMiddleware('badger'),
    new doubles.DummyMiddleware('mushroom')
  ]
  pipeline.push(...middlewares)

  let passthrough = pipeline.process(context)

  expect(passthrough.content).toBe('badgermushroom')
})

test('middleware can be interrupted', () => {
  let middlewares = [
    new doubles.DummyMiddleware('badger'),
    new doubles.InterruptedMiddleware(),
    new doubles.DummyMiddleware('mushroom')
  ]
  pipeline.push(...middlewares)

  let passthrough = pipeline.process(context)

  expect(passthrough.content).toBe('badgerinterrupted')
})

test('middleware can be added to beginning of list', () => {
  let middlewares = [
    new doubles.DummyMiddleware('badger'),
  ]
  pipeline.push(...middlewares)
  pipeline.unshift(new doubles.DummyMiddleware('mushroom'))

  let passthrough = pipeline.process(context)

  expect(passthrough.content).toBe('mushroombadger')
})

test('middleware can be inserted into list', () => {
  let middlewares = [
    new doubles.DummyMiddleware('badger'),
    new doubles.DummyMiddleware('mushroom'),
    new doubles.DummyMiddleware('snaaake'),
  ]
  pipeline.push(...middlewares)
  pipeline.insert(2, new doubles.DummyMiddleware('inserted'))

  let passthrough = pipeline.process(context)

  expect(passthrough.content).toBe('badgermushroominsertedsnaaake')
})

test('that middleware throws errors', () => {
  let middlewares = [
    new doubles.ThrowingMiddleware(),
  ]
  pipeline.push(...middlewares)

  expect(() => {pipeline.process(context)}).toThrowError()
})
