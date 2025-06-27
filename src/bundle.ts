import path from 'node:path';
import figlet from 'figlet'
import Mustache from 'mustache'
import Yaml from 'yaml'
import { registerSchema } from '@hyperjump/json-schema/draft-2020-12';
import { bundle } from '@hyperjump/json-schema/bundle';

import { MiddlewarePipeline } from './pipeline.js';
import { GenerateTarget } from './pipeline/middleware/generate-target';
import { GlobPipeline } from './pipeline/middleware/glob-pipeline';
import { ConsoleLog } from './pipeline/middleware/console-log.js';
import { FileListContext } from './pipeline/context/file-list-context.js';
import { DocumentTypeLookup } from './pipeline/middleware/document-type-lookup.js';
import { ReadFileContents } from './pipeline/middleware/read-file-contents.js';
import { RenderMustacheTags } from './pipeline/middleware/render-mustache-tags.js';
import { FileListPipeline } from './pipeline/middleware/file-list-pipeline.js';
import { ParseYaml } from './pipeline/middleware/parse-yaml.js';
import { RegisterJsonSchemaWithBundler } from './pipeline/middleware/register-json-schema-with-bundler.js';
import { BundleJsonSchema } from './pipeline/middleware/bundle-json-schema.js';
import { DocumentIdentifierFromFileContents } from './pipeline/middleware/document-identifier-from-file-contents.js';
import { UnparseYaml } from './pipeline/middleware/unparse-yaml.js';

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

// console.log(figlet.textSync("Bundlizer GO!"));

let pipeline = new MiddlewarePipeline(
  new GlobPipeline(
    path.join(BASE, SOURCE, '**', '*.yml'),
    {},
    new GenerateTarget(SOURCE, TARGET),
    new ReadFileContents(),
    new DocumentTypeLookup(),
    new RenderMustacheTags(MustacheTags, Mustache),
    new ParseYaml(Yaml),
    new DocumentIdentifierFromFileContents(),
  ),
  new FileListPipeline(
    new RegisterJsonSchemaWithBundler(registerSchema),
  ),
  new FileListPipeline(
    new BundleJsonSchema(bundle),
    new UnparseYaml(Yaml),
    new ConsoleLog(console),
  ),
);

pipeline.process({ files: new Map()} as FileListContext);
