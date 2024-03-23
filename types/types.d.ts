// types.ts
// roam-api-sdk.d.ts

export interface PageJSON {
  [key: string]: any
}

interface Frontmatter {
  [key: string]: string
}

export interface BlockInfo {
  pageName: string
  blockString: string
  children?: any
}
