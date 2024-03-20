import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4.0 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "The Rooftop Garden",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    // baseUrl: "quartz.jzhao.xyz",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Poppins",
        body: "Crimson Pro",
        code: "IBM Plex Mono",
        test: "Italiana",
        cursive1: "Delicious Handrawn",
        cursive2: "Patrick Hand SC",
      },
      colors: {
        lightMode: {
          light: "#FFFCF0",//background
          lightgray: "#E6E4D9", //borders
          gray: "#B7B5AC", // graph links, heavier borders, accents metadata & DONE text
          darkgray: "#4e4e4e",//body text and icons
          dark: "#2b2b2b", //page title, header text and icons
          secondary: "#D14D41",//link colour, current [[graph view|graph]] node
          tertiary: "#4385BE",//hover states and visited [[graph view|graph]] nodes
          highlight: "#E6E4D950" //internal link background, highlighted text, [[syntax highlighting|highlighted lines of code]]
        },
        darkMode: {
          light: "#100F0F",
          lightgray: "#282726",
          gray: "#403E3C",
          darkgray: "#CECDC3",
          dark: "#CECDC3",
          secondary: "#D14D41",
          tertiary: "#4385BE",
          highlight: "#403E3C15"
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.TableOfContents(),
      Plugin.CreatedModifiedDate({
        priority: ["git","frontmatter", "filesystem"], // you can add 'git' here for last modified from Git but this makes the build slower
      }),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      // Plugin.RoamTables(),
      Plugin.togglableTables(),
      // Plugin.RoamFlavoredMarkdown(),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TufteComponents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
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
