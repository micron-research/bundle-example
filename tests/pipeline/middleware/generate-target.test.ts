import path from 'node:path'
import { beforeEach, describe, expect, expectTypeOf, test } from 'vitest'
import { GenerateTarget } from '../../../src/pipeline/middleware/generate-target'
import DocumentContext from '../../../src/pipeline/context/document-context'

test('Test that target path is generated', () => {
  const context: DocumentContext = {
    source: path.join(import.meta.dirname, 'badger', 'mushroom'),
    target: '',
    type: 'index',
    schema: {}
  }

  let expected = path.join(import.meta.dirname, 'snaaake', 'mushroom')
  let middleware = new GenerateTarget('badger', 'snaaake')

  middleware.process(context)

  expect(context.target).toBe(expected)
})
