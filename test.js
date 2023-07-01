import { addSchema, addMediaTypePlugin } from "@hyperjump/json-schema/draft-2020-12";
import { bundle } from "@hyperjump/json-schema/bundle";

import * as path from 'path'
import * as yaml from 'yaml'
import { globSync } from 'glob'
import { parse as parseYaml } from 'yaml';
import { readFileSync } from 'node:fs'
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";


// -----------------------------------------------------------------------------
// Prepare Dependencies

addMediaTypePlugin("application/octet-stream", {
  parse: async (response) => [parseYaml(await response.text()), undefined],
  matcher: (path) => path.endsWith(".yml") || path.endsWith(".yaml")
});

// turn of logging here
// console.log = () => {}


// -----------------------------------------------------------------------------
// Constants

const SOURCE = path.resolve('schema')
const TARGET = path.resolve('bundled')


// -----------------------------------------------------------------------------
// Functions

let prepFilesystem = () => {
  try {
    mkdirSync('bundled')
  } catch (error) {
    rmSync('bundled', { force: true, recursive: true })
    prepFilesystem()
  }
}

let withGlobbedFiles = (files) => {
  console.log('File list:', files)

  files.forEach(iterateOverSchemaForAdding)
  files.every(iterateOverFileForBundling)
}

let iterateOverSchemaForAdding = (file) => {
  console.log('Iteration: ' + file)

  try {
    let contents = readFileSync(file, { encoding: 'utf-8' })

    addSchemaForContents(contents, file)
  } catch (error) {
    console.error(error)
  }
}

let addSchemaForContents = (contents, filePath) => {
  let schema = parseYaml(contents)
  let retrievalURI = 'file://' + filePath

  console.log('File Schema:', schema)
  console.log('Retrieval URI:', retrievalURI)

  addSchema(schema, retrievalURI)
}

let iterateOverFileForBundling = (file) => {
  try {
    ensureTargetFilePath(file)
    bundleSchemaToFile(file)
  } catch (error) {
    return false
  }

  return true
}

let ensureTargetFilePath = (file) => {
  let targetPath = path.parse(file).dir.replace(SOURCE, TARGET)

  console.log('Target Path:', targetPath)

  if (!existsSync(targetPath)) {
    mkdirSync(targetPath, { recursive: true })
  }
}

let bundleSchemaToFile = (file) => {
  let sourceFile = 'file://' + file

  console.log('Source File:', sourceFile)

  bundle(sourceFile).then((schema) => { writeBundledFile(schema, file) }, reportFailedBundle)
}

let writeBundledFile = (bundled, file) => {
  let yamlString = yaml.stringify(bundled)
  let targetFile = file.replace(SOURCE, TARGET)

  console.log(bundled)
  console.log(yamlString)
  console.log('Target File:', targetFile)

  try {
    writeFileSync(
      targetFile,
      yamlString,
      { encoding: 'utf-8', flag: 'w' }
    )
  } catch (error) {
    console.error(error)
  }
}

let reportFailedBundle = (error) => {
  console.error(error)
}


// -----------------------------------------------------------------------------
// Runtime

prepFilesystem()

withGlobbedFiles(
  globSync(path.join(SOURCE, '**', '*.yml'))
)
