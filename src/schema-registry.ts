export interface Record {
  readonly type: 'openapi' | 'asyncapi' | 'json-schema'
  readonly source: string
  readonly target: string
  readonly schema: object
  readonly bundled: object

  withSchema: (schema: string) => Record
  withBundled: (bundled: object) => Record
}

export interface RegistryOptions {
  source: string
  target: string
}

export interface BundlerAdapter {
  addSchema(schema: Record): void
  bundle(source_path: string): Boolean
}

export class SchemaRecord implements Record {
  #type: 'openapi' | 'asyncapi' | 'json-schema'
  #source: string
  #target: string
  #schema: object
  #bundled: object

  static fromSource(source: string) {

  }

  withSchema (schema: string): Record {

  }

  withBundled (bundled: object): Record {
    return this
  }
}

export class SchemaRegistry {
  #options: SchemaRegistryOptions
  #sourceMap: Map<string, SchemaRecord> = new Map()
  #idMap: Map<string, SchemaRecord> = new Map()

  constructor(options: SchemaRegistryOptions) {
    this.#options = options
  }

  addSchemaFromPath(path: string): void {

  }

  bundleSchemas(bundler: BundlerAdapter) {

  }

  findBySourcePath(path: string): SchemaRecord {
    return {} as SchemaRecord
  }

  findById(id: string): SchemaRecord {
    return {} as SchemaRecord
  }

  gatherSchemasByType(type: 'openapi' | 'asyncapi' | 'json-schema'): Array<SchemaRecord> {
    return new Array()
  }
}
