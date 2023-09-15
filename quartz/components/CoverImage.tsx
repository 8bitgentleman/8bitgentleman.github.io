import { pathToRoot, slugTag } from "../util/path"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function CoverImage({ fileData }: QuartzComponentProps) {
  const cover = fileData.frontmatter?.Cover
  const baseDir = pathToRoot(fileData.slug!)
  if (cover) {
    return (
    <img class="cover-image" src={cover} alt="cover"></img>
    )
  } else {
    return null
  }
}

CoverImage.css = `
img.cover-image {
    height: 170px !important;
    float: left !important;
    margin-right: 20px !important;
}
`

export default (() => CoverImage) satisfies QuartzComponentConstructor
