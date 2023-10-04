import { QuartzTransformerPlugin } from "../types"
import { Root } from "mdast"
import { visit } from "unist-util-visit"
import { toString } from "mdast-util-to-string"
import Slugger from "github-slugger"
import { Replace, findAndReplace as mdastFindReplace } from "mdast-util-find-and-replace"
import { PluggableList } from "unified"
import { promises as fsPromises } from 'fs';
import type { Parent } from "unist";
import { VFile } from 'vfile';

interface TextNode extends Node {
  value: string;
}

interface ParagraphNode extends Node {
  children: TextNode[];
}

interface ListItemNode extends Node {
  children: ParagraphNode[];
}

interface ListNode extends Node {
  children: ListItemNode[];
}

// Recursive function to extract table data
function generateTableMarkdown(headers: string[], rows: string[]): string {
  let markdown = '| ' + headers.join(' | ') + ' |\n';
  markdown += '| ' + headers.map(() => '---').join(' | ') + ' |\n';

  for (let i = 0; i < rows.length; i += headers.length) {
    markdown += '| ' + rows.slice(i, i + headers.length).join(' | ') + ' |\n';
  }

  return markdown;
}

  export const RoamTables: QuartzTransformerPlugin<undefined> = () => {
    return {
      name: "RoamTables",
      markdownPlugins() {
        const plugins: PluggableList = []
        const tableRegex = new RegExp(/({{\[\[\btable\b\]\]}})/, "g");
        return plugins
        plugins.push(() => {
          return (tree: Node, file: VFile) => {
            visit<ListNode>(tree, 'list', (node, index, parent) => {
              if (node.children[0].children[0].children[0].value.startsWith('{{[[table]]}}')) {
                console.log();
                
                const headers: string[] = [];
                const rows: string[] = [];
        
                node.children[0].children.forEach((child, i) => {
                  if (i === 0) return; // Skip the first child as it's the table marker
        
                  child.children.forEach((subChild, j) => {
                    console.log(subChild.children);
                    
                    if (j === 0) {
                      headers.push(subChild.children[0].value);
                    } else {
                      rows.push(subChild.children[0].value);
                    }
                  });
                });
        
                const tableNode: Node = {
                  type: 'html',
                  value: generateTableMarkdown(headers, rows),
                };
        
                if (parent) {
                  parent.children.splice(index, 1, tableNode);
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

  function transformer() {
    
    return (tree: Parent) => {
      visit<Parent>(tree, 'listItem', (listItemNode) => {
        if (listItemNode.children[0].value === '{{[[table]]}}') {
          const tableRows = listItemNode.children.slice(1).map((rowNode) => rowNode.children.slice(1).map((cellNode) => cellNode.children[0].value));
          const headers = tableRows.shift();
          const markdownTable = `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n${tableRows.map((row) => `| ${row.join(' | ')} |`).join('\n')}\n`;
          const newTableNode = { type: 'table', children: [{ type: 'tableRow', children: headers.map((header) => ({ type: 'tableCell', children: [{ type: 'text', value: header }] })) }, ...tableRows.map((row) => ({ type: 'tableRow', children: row.map((cell) => ({ type: 'tableCell', children: [{ type: 'text', value: cell }] })) }))]};
          const index = tree.children.indexOf(listItemNode);
          tree.children.splice(index, 1, newTableNode);
        }
      });
    };
  }
  

  
