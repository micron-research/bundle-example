import { registerSchema as registerOpenApiSchema } from '@hyperjump/json-schema/openapi-3-1'
import { registerSchema as registerJsonSchema } from '@hyperjump/json-schema/draft-2020-12'
import { registerSchema } from '@hyperjump/json-schema'
import { bundle } from '@hyperjump/json-schema/bundle'


// Utilities
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'yaml'
import { globSync } from 'glob'
//import { existsSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs'
import Mustache from 'mustache'



// -----------------------------------------------------------------------------
// Constants

// '.' is from the package.json context, not this file's path
const BASE = path.resolve('.')
const SOURCE = 'src/schema'
const TARGET = 'bundled'
const DOMAIN = 'https://badgers.io'

const MustacheTags = {
  BASE,
  SOURCE,
  TARGET,
  DOMAIN,
}

console.log('Constants: ', MustacheTags)


// -----------------------------------------------------------------------------
// Helpers

const prepFilesystem = () => {
  console.log('prepFilesystem: ' + TARGET)

  fs.rmSync(TARGET, { force: true, recursive: true })
  fs.mkdirSync(TARGET)
}

const withGlobbedFiles = (files, callbacks) => {
  console.log('withGlobbedFiles:', files)

  callbacks.forEach(callback => {
    files.forEach((file) => {
      callback(file)
    })
  })
}

const readActualFile = (filePath) => fs.readFileSync(filePath, {
  encoding: 'utf-8',
})

const getDetailsFromParsedSchema = (schema) => [schema['$id'], schema['$schema']]

const generateTargetFilePath = sourcePath => sourcePath.replace(SOURCE, TARGET)
const ensureTargetPath = (path) => {
  console.log('ensureTargetPath: ' + path)
  fs.existsSync(path) || fs.mkdirSync(path, { recursive: true })
}


// -----------------------------------------------------------------------------
// Registering Schemas

const replaceTagsWithValues = (fileContents, tags) => Mustache.render(fileContents, tags)
const prepareAndRegisterFile = (filePath) => {
  console.log('prepareAndRegisterFile: ' + filePath)

  try {
    let contents = replaceTagsWithValues(readActualFile(filePath), MustacheTags)
    let parsed = yaml.parse(contents)
    let [$id, $schema] = getDetailsFromParsedSchema(parsed)

    registerSchema(parsed, $id, $schema)
  } catch (error) {
    throw error
  }
}


// -----------------------------------------------------------------------------
// Bundle Json Schema

const schemaIdentifierFromSourceFilePath = (filePath) => filePath.replace(path.join(BASE, SOURCE), DOMAIN).replace('.yml', '')

const reportFailedBundle = (error) => console.error('Bundle Failed: ', error)
const writeBundledFile = (bundled, filePath) => fs.writeFileSync(filePath, yaml.stringify(bundled), { encoding: 'utf-8', flag: 'w' })

const bundleSchemaToFile = (schema, targetFilePath) => {
  console.log('bundleSchemaToFile: ' + schema + ', ' + targetFilePath)

  bundle(schema, { alwaysIncludeDialect: false }).then((bundled) => writeBundledFile(bundled, targetFilePath), reportFailedBundle)
}

const bundleFileAndSaveIt = (filePath) => {
  console.log('bundleFileAndSaveIt: ' + filePath)

  try {
    let targetFilePath = generateTargetFilePath(filePath)
    ensureTargetPath(path.parse(targetFilePath).dir)
    bundleSchemaToFile(schemaIdentifierFromSourceFilePath(filePath), targetFilePath)
  } catch (error) {
    throw error
  }
}


// -----------------------------------------------------------------------------
// Runtime

prepFilesystem()

withGlobbedFiles(
  globSync(path.join(BASE, SOURCE, '**', '*.yml'), {
    ignore: [
      path.join(BASE, SOURCE, '**', '*asyncapi.yml'),
      // path.join(BASE, SOURCE, '**', '*openapi.yml'),
    ]
  }),
  [prepareAndRegisterFile, bundleFileAndSaveIt]
)
