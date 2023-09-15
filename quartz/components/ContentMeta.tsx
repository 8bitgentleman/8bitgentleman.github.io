import { formatDate, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"

export default (() => {
  function ContentMetadata({ cfg, fileData }: QuartzComponentProps) {
    const text = fileData.text
    if (text) {
      const segments: string[] = []
      const { text: timeTaken, words: _words } = readingTime(text)

      if (fileData.dates) {
        segments.push(formatDate(getDate(cfg, fileData)!))
      }

      segments.push(timeTaken)
      const content = fileData.frontmatter?.URL
        ? <p class="content-meta">{segments.join(", ")} <a class="external source-url" target="_blank" href={fileData.frontmatter.URL} ></a></p>
        : <p class="content-meta">{segments.join(", ")}</p>;

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
}) satisfies QuartzComponentConstructor
