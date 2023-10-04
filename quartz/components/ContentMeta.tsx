import { formatDate, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { pathToRoot, slugTag } from "../util/path"

export default (() => {
  function ContentMetadata({ cfg, fileData }: QuartzComponentProps) {
    const text = fileData.text
    const status = fileData.frontmatter?.Status
    const baseDir = pathToRoot(fileData.slug!);
  
    if (text) {
      const segments: (string | JSX.Element)[] = [];
      const { text: timeTaken, words: _words } = readingTime(text)

      if (fileData.dates) {
        segments.push(formatDate(getDate(cfg, fileData)!))
      }

      segments.push(timeTaken)
      if (status) {
        const display = `#${status}`
        const linkDest = baseDir + `/tags/${slugTag(status)}`
        
        segments.push(<span className="essay-status">
          <strong key="statusLabel">Status:</strong>
          <a key="statusLink" href={linkDest} className="internal essay-status" data-tag={status}>{display}</a>
        </span>);
      }

      const content = fileData.frontmatter?.URL
        ? <p className="content-meta">{segments.map((segment, index) => <span key={index}>{segment}</span>)}<a className="external source-url" target="_blank" href={fileData.frontmatter.URL} ></a></p>
        : <p className="content-meta">{segments.map((segment, index) => <span key={index}>{segment}</span>)}</p>;
        // console.log(JSON.stringify(content, null, 2))
      
      return content;
    } else {
      return null
    }
  }

  ContentMetadata.css = `
  .content-meta {
    margin-top: 0;
    color: var(--gray);
  }
  .source-url::after {
    fill: var(--gray);
    padding-left: 2px;
    color: transparent;
    text-shadow: 0 0 0 var(--gray);
    content: "🔗";
  }
  `
  return ContentMetadata
}) as QuartzComponentConstructor