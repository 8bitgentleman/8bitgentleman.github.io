import { pathToRoot, slugTag } from "../util/path"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function Status({ fileData }: QuartzComponentProps) {
  const status = fileData.frontmatter?.Status
  const baseDir = pathToRoot(fileData.slug!)
  
  if (status) {
    const display = `#${status}`
    const linkDest = baseDir + `/tags/${slugTag(status)}`
    return <p class="essay-status">
        <strong>Status:</strong>{
        <a href={linkDest} class="internal essay-status" data-tag={status}>
                 {display}
               </a>
        }</p>
  } else {
    return null
  }
}
Status.css = `
.essay-status {
  margin: 0 0 0 0;
  margin-top: -1em;
    color: var(--gray);
}
`

export default (() => Status) satisfies QuartzComponentConstructor
