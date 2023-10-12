// @ts-ignore
import clipboardScript from "./scripts/clipboard.inline"
import clipboardStyle from "./styles/clipboard.scss"
import carouselScript from "./scripts/carouselVersion.inline"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function Body({ children }: QuartzComponentProps) {
  return <div id="quartz-body">{children}</div>
}

Body.afterDOMLoaded = `${clipboardScript}\n${carouselScript}`;

export default (() => Body) satisfies QuartzComponentConstructor
