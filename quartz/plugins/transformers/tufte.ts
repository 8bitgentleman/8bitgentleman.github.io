import { QuartzTransformerPlugin } from "../types"

export interface Options {
  /** Replace {{ or:ONE|TWO|THREE }} with html select */
  sidenoteComponent: boolean
}

const defaultOptions: Options = {
  sidenoteComponent: true,
}

const sidenoterRegex = new RegExp(/\[\^(\d+)\](?!:)(.*?)/, "g")

export const TufteComponents: QuartzTransformerPlugin<Partial<Options> | undefined> = (
  userOpts,
) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "TufteComponents",
    textTransform(_ctx, src: string | Buffer) {
      if (opts.sidenoteComponent) {
        let newSRC: string
        if (Buffer.isBuffer(src)) {
          newSRC = src.toString()
        } else {
          newSRC = src
        }

        src = newSRC.replaceAll(sidenoterRegex, (value: string, ...capture: string[]) => {
          const [match, text] = capture
          const sidenoterContentRegex = new RegExp(`\\[\\^${match}\\]:\\s*(.*)`)
          const sidenoteContentMatch = newSRC.match(sidenoterContentRegex)
          if (!sidenoteContentMatch) {
            console.error(`Sidenote content not found for reference [^${match}]`)
            return value // Return the original markdown if the sidenote content is not found
          }

          const sidenote = `<label for="sn-${match}" class="margin-toggle sidenote-number"><sup>${match}</sup></label>
                                <input type="checkbox" id="sn-${match}" class="margin-toggle"/>
                                <span class="sidenote">${sidenoteContentMatch[1]}</span>`
          return sidenote
        })
      }

      // src = src.toString()
      // const matches = [...src.matchAll(sidenoterContentRegex)];

      // for (const match of matches) {
      //     const foundMatch = match[0]; // The whole match
      //     const capturedText = match[1]; // The captured text inside the brackets

      //     console.log(`Found match: ${foundMatch}`);
      //     console.log(`Captured text: ${capturedText}`);
      // }
      return src
    },
  }
}
