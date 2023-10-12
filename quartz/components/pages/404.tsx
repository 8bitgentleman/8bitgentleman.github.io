import { QuartzComponentConstructor } from "../types"

function NotFound() {
  return (
    <article class="popover-hint">
      <h1 style="font-size:40px; font-family: 'Cinzel', sans-serif !important;">Error 721: Lost in the Weeds</h1>
      <p style="font-family: 'Italiana', sans-serif !important;">Looks like you've ventured further than I've pruned!</p>
      <p style="font-family: 'Italiana', sans-serif !important;">Let's get you back on the <a href="https://8bitgentleman.github.io/matt/">garden path</a></p>

    </article>
  )
}
// font-family: 'Alegreya', serif;
// font-family: 'Cinzel', serif;
// font-family: 'Lora', serif;
// font-family: 'Poiret One', sans-serif;
export default (() => NotFound) satisfies QuartzComponentConstructor
