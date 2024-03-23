import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { SimpleSlug } from "./quartz/util/path"

// Define the filter function
function filterPages(note: any) {
  // Define a list of titles to skip
  const titlesToSkip = ["test", "about these notes", "uses"]
  const hasStatus = note.frontmatter && "status" in note.frontmatter
  // Convert the title to lowercase for case-insensitive comparison
  const titleLower = note.frontmatter?.title.toLowerCase()
  // Check if the title is not in the list of titles to skip
  const titleNotInSkipList = !titlesToSkip.includes(titleLower)

  // Return true if both conditions are met
  return hasStatus && titleNotInSkipList

  // return !titlesToSkip.includes(titleLower);
  return note.frontmatter && "status" in note.frontmatter
}
// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/8bitgentleman/matt", //,
      //"Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    // Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta({ showComma: false }),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.TableOfContents()),
  ],
  right: [
    Component.DesktopOnly(),
    Component.DesktopOnly(
      Component.Graph({
        localGraph: {
          drag: true, // whether to allow panning the view around
          zoom: true, // whether to allow zooming in and out
          depth: 2, // how many hops of notes to display
          scale: 1.1, // default view scale
          repelForce: 1, // how much nodes should repel each other
          centerForce: 0.3, // how much force to use when trying to center the nodes
          linkDistance: 30, // how long should the links be by default?
          fontSize: 0.4, // what size should the node labels be?
          opacityScale: 1, // how quickly do we fade out the labels when zooming out?
        },
        globalGraph: {
          drag: true,
          zoom: true,
          depth: -1,
          scale: 0.9,
          repelForce: 1,
          centerForce: 0.3,
          linkDistance: 50,
          fontSize: 0.4,
          opacityScale: 0.8,
        },
      }),
    ),
    Component.DesktopOnly(
      Component.RecentNotes({
        linkToMore: "tags/writing" as SimpleSlug,
        title: "Recent Writing",
        filter: filterPages,
        // limit: 5
      }),
    ),
    Component.DesktopOnly(Component.Backlinks()),
    Component.MobileOnly(Component.Backlinks()),
    Component.MobileOnly(
      Component.RecentNotes({
        linkToMore: "tags/writing" as SimpleSlug,
        title: "Recent Writing",
        filter: filterPages,
        // limit: 5
      }),
    ),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.ArticleTitle()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
  ],
  right: [],
}
