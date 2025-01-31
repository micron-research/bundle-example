import path from 'node:path';
import figlet from 'figlet'
import Mustache from 'mustache'
import Yaml from 'yaml'

import { GenerateTarget } from './pipeline/middleware/generate-target';
import { GlobPipeline } from './pipeline/middleware/glob-pipeline';
import { ConsoleLog } from './pipeline/middleware/console-log.js';
import { MiddlewarePipeline } from './pipeline.js';
import { FileListContext } from './pipeline/context/file-list-context.js';
import { DocumentTypeLookup } from './pipeline/middleware/document-type-lookup.js';
import { ReadFileContents } from './pipeline/middleware/read-file-contents.js';
import { RenderMustacheTags } from './pipeline/middleware/render-mustache-tags.js';
import { FileListPipeline } from './pipeline/middleware/file-list-pipeline.js';
import { ParseYaml } from './pipeline/middleware/parse-yaml.js';

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

console.log(figlet.textSync("Bundlizer GO!"));

let pipeline = new MiddlewarePipeline(
  new GlobPipeline(
    path.join(BASE, SOURCE, '**', '*.yml'),
    {},
    new GenerateTarget(SOURCE, TARGET),
    new ReadFileContents(),
    new DocumentTypeLookup(),
  ),
  new FileListPipeline(
    new RenderMustacheTags(MustacheTags, Mustache),
    new ParseYaml(Yaml),
  ),
  new ConsoleLog(console),
);

pipeline.process({ files: new Map()} as FileListContext);
