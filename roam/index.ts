import 'isomorphic-fetch';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import type { RoamPage, RoamBlock } from '@roam-research/roam-api-sdk';
import { PageJSON, Frontmatter, BlockInfo } from '../types/types';

const graphEditToken = process.env.ROAM_BACKEND_TOKEN || '';
const graphName = 'MattVogel';
const pages = process.env.PAGES ? process.env.PAGES.split(',') : [];
const start = process.env.START ? process.env.START : '';
const privateTags = process.env.PRIVATE ? process.env.PRIVATE.split(',') : [];

console.log(pages, start, privateTags);


function timestampToYYYYMMDD(timestamp:string) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function sanitizeRoamString(blockText:String, blockLocations: Map<string, BlockInfo>){
  const roamSpecificMarkup = ['POMO', 'word-count', 'date', 'slider', 'encrypt', 'TaoOfRoam', 'orphans', 'count', 'character-count', 'comment-button', 'query', 'streak', 'attr-table', 'mentions', 'search', 'roam\/render', 'calc'];
  const roamSpecificMarkupRe = new RegExp(`\\{\\{(\\[\\[)?(${roamSpecificMarkup.join('|')})(\\]\\])?.*?\\}\\}(\\})?`, 'g');
  blockText = blockText.replace(roamSpecificMarkupRe, '');

  // regular block alias
  blockText = blockText.replace(/\[(.+?)\]\((\(.+?\)\))\)/g, '$1');


  // block embeds reference
  // blockText = blockText.replace(/{{\[{0,2}embed.*?(\(\(.*?\)\)).*?}}/g, '$1');

  // pure block ref
  blockText = blockText.replace(/(\(\(\b.*?\b\)\)(?![^{]*}}))/g, function(match, group1) {
      return resolveBlockRef(blockLocations, group1);
    });

  // page alias
  blockText = blockText.replace(/\[(.+?)\]\(\[\[(.+?)\]\]\)/g, '[[$2|$1]]');

  // formatting 
  blockText = blockText.replace(/\_\_(.+?)\_\_/g, '*$1*'); // __ __ itallic
  blockText = blockText.replace(/\^\^(.+?)\^\^/g, '==$1=='); // ^^ ^^ highlight
  blockText = blockText.replace(/\n/g, '<br>');

  return blockText;
}

function generateFrontmatter(frontmatter: Frontmatter): string {
  // generate markdown frontmatter from a key:value object
  let yamlFrontmatter = '---\n';

  for (const key in frontmatter) {
      if (frontmatter.hasOwnProperty(key)) {
        const value = frontmatter[key];
        if (key === 'tags') {
          const tagsArray = value.split(' ').map(tag => tag.replace('#', ''));
          yamlFrontmatter += `${key}:\n`;
          tagsArray.forEach(tag => {
            yamlFrontmatter += `  - ${tag}\n`;
          });
        } else if (key === 'status') {
          const cleanedStatus = value.replace(/[#\[\]]/g, ''); // Remove #, [, and ]
          yamlFrontmatter += `${key}: ${cleanedStatus}\n`
        } else {
          yamlFrontmatter += `${key}: ${value}\n`;
        }
      }
    }

  yamlFrontmatter += '---\n\n';      
  return yamlFrontmatter;
}

function jsonToMarkdown(pageJSON: PageJSON, blockLocations: Map<string, BlockInfo>): string {
  const title = pageJSON[':node/title'];
  const frontmatter: Frontmatter = {};
  let markdown = '';

  function parseNode(
    node: PageJSON,
    isNumbered = false,
    indentLevel = 0
  ) {
    if (node[':block/string']) {
      node[':block/string'] = sanitizeRoamString(node[':block/string'], blockLocations);
      const match = node[':block/string'].match(/(.+)::(.+)/); //attributes
      if (match && (indentLevel === 0 || indentLevel === 1)) {
        // only add top level attributes as frontmatter
        const key = match[1].trim().toLowerCase();
        const value = match[2].trim();
        frontmatter[key] = value;
      } else {
        if (node[':block/heading']) {
          const headingLevel = node[':block/heading'];
          markdown += `${'#'.repeat(headingLevel)} ${node[':block/string']}\n\n`;
        } else if (node[':block/string'].includes("---")) {
          // Handle other cases if needed
        } else {
          markdown += `${
            indentLevel === 1 || isNumbered
              ? ''
              : indentLevel === 2
              ? '-'
              : ' '.repeat((indentLevel - 2) * 4) + '-'
          } ${node[':block/string']}\n\n`;
        }
      }
    }
    if (node[':node/title']) {
      frontmatter['title'] = node[':node/title'];
      if (node[':create/time']) {
        frontmatter['date'] = timestampToYYYYMMDD(node[':create/time']);
      } else {
        frontmatter['date'] = timestampToYYYYMMDD(node[':edit/time']);
      }
    }
    if (node[':block/children'] && node[':block/children'].length > 0) {
      node[':block/children'].sort((a: { order: number }, b: { order: number }) => a.order - b.order);

      if (node[':children/view-type'] === 'numbered') {
        isNumbered = true;
        node[':block/children'].forEach((child:any, index:number) => {

          markdown += `${isNumbered ? `${index + 1}. ` : ''}`;
          parseNode(child, true, indentLevel + 1);
        });
        markdown += '\n';
      } else {
        markdown += '\n';
        node[':block/children'].forEach((child:any) =>
          parseNode(child, false, indentLevel + 1)
        );
        markdown += '\n';
      }
    }
  }

  // Call the parseNode function with your input pageJSON
  parseNode(pageJSON);

  // You can now access the generated markdown and frontmatter
  markdown = generateFrontmatter(frontmatter) + markdown
  return markdown;
}


function resolveBlockRef(blockLocations: Map<string, BlockInfo>, sourceBlockUID:string):string {
  
  
  const sourceBlock = blockLocations.get(sourceBlockUID.replace(/[()]/g, ''));
  // console.log("resolveBLockRef", sourceBlock);
  if (!sourceBlock) {
      // no block with that uid exists
      // most likely just double ((WITH_REGULAR_TEXT))
      return sourceBlockUID;
  }
  let strippedSourceBlockString = sourceBlock.blockString;
  console.log(strippedSourceBlockString);
  
  const regex = new RegExp(/(\(\(\b.*?\b\)\)(?![^{]*}}))/g, 'g');
  if (regex.test(strippedSourceBlockString)) {
      // callback();
      strippedSourceBlockString = strippedSourceBlockString.replace(/(\(\(\b.*?\b\)\)(?![^{]*}}))/g, function(match, group1) {
          return resolveBlockRef(blockLocations, group1);
        });
  }
  return strippedSourceBlockString
}

function preprocess(pages: RoamPage[]): Map<string, BlockInfo> {
  // preprocess/map the graph so each block can be quickly found 
  const blockLocations: Map<string, BlockInfo> = new Map();

  function processBlock(page: RoamPage, block: RoamBlock) {
      if (block[':block/uid']) {
          // Check for roam DNP and convert to obsidian DNP


          const info: BlockInfo = {
              pageName: page[':node/title'], //sanitizeFileNameKeepPath(page[':node/title']),
              blockString: block[':block/string'] || '', // Ensure block.string is defined
          };

          blockLocations.set(block[':block/uid'], info);
      }

      if (block[':block/children']) {
          for (const child of block[':block/children']) {
              processBlock(page, child);
          }
      }
  }

  for (const page of pages) {
      if (page[':block/children']) {
          for (const block of page[':block/children']) {
              processBlock(page, block);
          }
      }
  }

  return blockLocations;
}

function findPagesByTitles(pages: RoamPage[], titlesToFind: String[]): RoamPage[] {
  return pages.filter(page => titlesToFind.includes(page[':node/title']));
}

const main = async (pages:String[]) => {
  const { initializeGraph, q, pull } = await import('@roam-research/roam-api-sdk');
  const graph = initializeGraph({
    token: graphEditToken,
    graph: graphName,
  });
  console.log(graph);
  
  // pull only a list of pages
  let query = `[:find (pull ?e [:block/string
                          :block/uid
                          :block/children
                          :block/heading
                          :block/props
                          :block/page
                          :block/parents
                          :block/open
                          :block/order
                          :block/view-type
                          :block/text-align
                          :children/view-type
                          :node/title
                          :create/time
                          :edit/time
                          {:block/children ...}
                          {:block/page [
                              :block/uid 
                              :node/title
                          ]}
                          ])
                      :where 
                      [?e :node/title]]`;

  q(graph, query)
    .then((r:any) => {
      const data = r.flat();
      
      const allPages: RoamPage[] = data as RoamPage[];
      console.log("~~pages downloaded");
      console.log("~~~~starting block preprocess");
      // PRE-PROCESS: map the blocks for easy lookup //
      const blockLocations = preprocess(allPages);
      console.log("~~block preprocess finished");

      const filteredPages = findPagesByTitles(allPages, pages)
      const markdownPages: Map<string, string> = new Map();
      for (let index in filteredPages) {
        const pageData = filteredPages[index];
        let pageName = pageData[':node/title'].trim();
        const filename = `${pageName}.md`;
        const markdownOutput = jsonToMarkdown(pageData, blockLocations);
        // const filePath = `content/${pageName}.md`;
        let filePath
        if (pageName== start) {
          console.log("~~START PAGE: ", pageName, start);
          filePath = 'content/index.md'
        } else {
          console.log(pageName, start);
          
          filePath = `content/${pageName}.md`;
        }
        // const filePath = pageName === start ? 'content/index.md' : `content/${pageName}.md`;

        writeFileSync(filePath, markdownOutput);
        console.log(`~~Markdown saved to ${filePath}`);
        markdownPages.set(filename, markdownOutput);
        
    }
      
    });

}

main(pages);
