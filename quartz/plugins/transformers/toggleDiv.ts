import { QuartzTransformerPlugin } from "../types"
import { PluggableList } from "unified"
import { Root } from "mdast"
import { visit } from "unist-util-visit"

export const togglableTables: QuartzTransformerPlugin<undefined> = () => {
    return {
    name: "togglableTables",
    markdownPlugins() {
        const plugins: PluggableList = []

        plugins.push(() => {
            return (tree: Root, _file) => {
                
                visit(tree, 'paragraph', (node, index, parent) => {
                    if (parent && typeof index === 'number') {
                        const firstChild = node.children[0];
                        if (firstChild && firstChild.type === 'text' && firstChild.value.startsWith('???')) {
                            // Remove '???' and '!!!' from the first child's value.
                            const content = firstChild.value.slice(3, -3).trim();

                            // Split the content into visible and hidden based on the '<<<'.
                            const splitIndex = content.indexOf('<<<');
                            const visibleContent = content.slice(0, splitIndex !== -1 ? splitIndex : content.length).trim();
                            const hiddenContent = splitIndex !== -1 ? content.slice(splitIndex + 3).trim() : '';

                            // Split the visible content into lines and wrap each line in a span.
                            const visibleLines = visibleContent.split('\n').map(line => `<span>${line.trim()}</span>`).join('');

                            // Transform the node into the appropriate HTML.
                            // This is a simplified example and may not cover all cases.
                            const html = `
                            <div class="parent-div">
                                <input type="checkbox" id="toggle${index}" class="toggle-checkbox">
                                <label for="toggle${index}" class="visible-div relative-container">
                                ${visibleLines}
                                ${hiddenContent ? `<span class="carrot-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><polyline fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="5.5,23.5 18.5,12 5.5,0.5" id="Outline_Icons"></polyline><rect fill="none" width="24" height="24" id="Frames-24px"></rect></svg></span>` : ''}
                                </label>
                                ${hiddenContent ? `<div class="hidden-div">${hiddenContent}</div>` : ''}
                            </div>
                            `;
                            parent.children[index] = {
                                type: 'html',
                                value: html,
                            };
                            // console.log("");
                            
                            // console.log("~~",visibleContent)
                            // console.log("~~",content)
                        
                        }
                    }
                  });
            }
        })
        
        return plugins
    }
}
}
  