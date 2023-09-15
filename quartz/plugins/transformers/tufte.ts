import { QuartzTransformerPlugin } from "../types"

export interface Options {
  /** Replace {{ or:ONE|TWO|THREE }} with html select */
  sidenoteComponent: boolean
  
}

const defaultOptions: Options = {
  sidenoteComponent: true,
}

const sidenoterRegex = new RegExp(/\[\^(.*?)\](?!:)(.*?)/, "g")
// const sidenoterContentRegex = new RegExp(/\[\^1\]:\s*(.*)/, "g")

export const TufteComponents: QuartzTransformerPlugin<Partial<Options> | undefined> = (
  userOpts,
) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "TufteComponents",
    textTransform(_ctx, src: string | Buffer) {
      if (opts.sidenoteComponent) {
        let newSRC: string;
        if (Buffer.isBuffer(src)) {
          newSRC = src.toString();
        } else{
          newSRC = src;
        }

        src = newSRC.replaceAll(sidenoterRegex, (value: string, ...capture: string[]) => {
            const [match, text] = capture;

            const sidenoterContentRegex = new RegExp(`\\[\\^${match}\\]:\\s*(.*)`, "g")
            const sidenoteContentMatches = [...newSRC.matchAll(sidenoterContentRegex)];
            const sidenote = `<label for="sn-${match}" class="margin-toggle sidenote-number"><sup>${match}</sup></label>
                                <input type="checkbox" id="sn-${match}" class="margin-toggle"/>
                                <span class="sidenote">${sidenoteContentMatches[0][1]}</span>`;
            return sidenote;
        //   for (const match of matches) {
        //     const foundMatch = match[0]; // The whole match
        //     const capturedText = match[1]; // The captured text inside the brackets

        //     console.log(`Found match: ${foundMatch}`);
        //     console.log(`Captured text: ${capturedText}`);
        // }
        //   const options = match.split("|")
        //   const dropdown = `<select class="roam-or-component">${options.map((option: string) => `<option>${option}</option>`).join("")}</select>`;
        //   return dropdown;
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
