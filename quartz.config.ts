import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "The Rooftop Garden",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    //baseUrl: "quartz.jzhao.xyz",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    theme: {
      typography: {
        
        // body: "Oswald Regular",
        // header: "Abril Fatface",
        // body: "Lato",
        // header: "Homemade Apple",
        // header: "Montserrat Alternates",
        // body: "Raleway",
        header: "Cabin",
        body: "Cabin",
        code: "IBM Plex Mono",
      },
      colors: {
        // lightMode: {
        //   light: "#faf8f8",//background
        //   lightgray: "#e5e5e5",
        //   gray: "#b8b8b8", //accents metadata & DONE text
        //   darkgray: "#4e4e4e",//text and icons
        //   dark: "#2b2b2b", //page title and heading
        //   secondary: "#284b63",//#tag & [[page]] hover text
        //   tertiary: "#84a59d",//#tag & [[page]] hover text
        //   highlight: "rgba(143, 159, 169, 0.15)", //#tag & [[page]] bg
        // },
        lightMode: {
          light: "#ffffff",//background
          lightgray: "#e5e5e5",
          gray: "#757575", //accents metadata & DONE text
          darkgray: "#4e4e4e",//text and icons
          dark: "#2b2b2b", //page title and heading
          secondary: "#5f9b65",//#tag & [[page]] hover text
          tertiary: "#5f9b6550",//#tag & [[page]] hover text
          highlight: "rgba(143, 159, 169, 0.15)", //#tag & [[page]] bg
        },
        darkMode: {
          light: "#161618",
          lightgray: "#393639",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#7b97aa",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.TableOfContents(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"], // you can add 'git' here for last modified from Git but this makes the build slower
      }),
      Plugin.SyntaxHighlighting(),
      Plugin.RoamTables(),
      Plugin.RoamFlavoredMarkdown(),
      Plugin.TufteComponents(),
      // add footnote plugin here
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.Description(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources({ fontOrigin: "googleFonts" }),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
