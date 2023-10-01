import { QuartzTransformerPlugin } from "../types"
import { Root } from "mdast"
import { visit } from "unist-util-visit"
import { toString } from "mdast-util-to-string"
import Slugger from "github-slugger"
import { Replace, findAndReplace as mdastFindReplace } from "mdast-util-find-and-replace"
import { PluggableList } from "unified"
import { promises as fsPromises } from 'fs';

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

// Recursive function to extract table data
function extractTableData(node: any, isHeader: boolean = false): string {
  if (!node.children || node.children.length === 0) {
    return `<td>${node.value || ''}</td>`;
  }

  const row = node.children.map(child => extractTableData(child)).join('');
  return isHeader ? `<tr><th>${row}</th></tr>` : `<tr>${row}</tr>`;
}

export const RoamTables: QuartzTransformerPlugin<Partial<Options> | undefined> = (
  userOpts,
) => {
  const opts = { ...defaultOptions, ...userOpts }
    return {
      name: "RoamTables",
      markdownPlugins() {
        const plugins: PluggableList = []
        const tableRegex = new RegExp(/({{\[\[\btable\b\]\]}})/, "g");

        plugins.push(() => {
          return (tree: Root, _file) => {
            
            visit(tree, 'text', (node, index, parent) => {
              if (tableRegex.test((node as any).value)) {
                let htmlTable = '<table>';
                // Check if the node has children
                if (parent && parent.children && parent.children.length > 0) {
                  // Extract table data
                  htmlTable += extractTableData(parent, true);
                  // console.log(node);
                  htmlTable += '</table>';
                  
                  node.type = "html";
                  node.value = htmlTable;
                }
              }
            });
            
            // console.log(node);
            
            // return htmlTable;
          }
        })
        
        return plugins
      }
    }
  }

declare module "vfile" {
  interface DataMap {
    toc: TocEntry[]
  }
}
