import { QuartzTransformerPlugin } from "../types"
import { Root } from "mdast"
import { visit } from "unist-util-visit"
import { toString } from "mdast-util-to-string"
import Slugger from "github-slugger"
import { Replace, findAndReplace as mdastFindReplace } from "mdast-util-find-and-replace"

export interface Options {
  maxDepth: 1 | 2 | 3 | 4 | 5 | 6
  minEntries: 1
  showByDefault: boolean
}

const defaultOptions: Options = {
  maxDepth: 3,
  minEntries: 1,
  showByDefault: true,
}

interface TocEntry {
  depth: number
  text: string
  slug: string // this is just the anchor (#some-slug), not the canonical slug
}

export const RoamTables: QuartzTransformerPlugin = () => {
    return {
      name: "RoamTables",
      markdownPlugins() {
        return [() => {
          return (tree, file) => {
            // console.log(tree)
            // replace _text_ with the italics version
            const pattern = /({{.*?\btable\b.*?}})/g;
            mdastFindReplace(tree, pattern, (_match, capture) => {
                console.log("")
                console.log("~~ ",capture)
                
              // inner is the text inside of the () of the regex
            //   const [inner] = capture
              // return an mdast node
              // https://github.com/syntax-tree/mdast
            //   return {
            //     type: "emphasis",
            //     children: [{ type: 'text', value: inner }]
            //   }
                 return ""
            })
  
           // remove all links (replace with just the link content)
           // match by 'type' field on an mdast node
           // https://github.com/syntax-tree/mdast#link in this example
            // visit(tree, "link", (link: Link) => {
            //   return {
            //     type: "paragraph"
            //     children: [{ type: 'text', value: link.title }]
            //   }
            // })
          }
        }]
      }
    }
  }

declare module "vfile" {
  interface DataMap {
    toc: TocEntry[]
  }
}
