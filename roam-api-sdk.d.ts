// roam-api-sdk.d.ts
declare module "@roam-research/roam-api-sdk" {
  export interface GraphOptions {
    token: string
    graph: string
  }

  export interface RoamBlock {
    ":block/string"?: string
    ":block/heading"?: 0 | 1 | 2 | 3
    ":block/uid": string
    ":block/open"?: boolean
    ":block/parents"?: { ":db/id": number }[] // You can define a more specific type for parents
    ":block/order"?: number
    ":block/page"?: {
      ":node/title": string
      ":block/uid": string
    }
    ":block/props"?: any // If needed, define a specific type for props
    ":block/view-type"?: string
    ":block/text-align"?: "left" | "center" | "right" | "justify"
    ":block/children"?: RoamBlock[]
    ":edit/time"?: number
    ":create/time"?: number
    // Add any other properties specific to RoamBlock if needed
  }

  export interface RoamPage {
    ":node/title": string
    ":block/children"?: RoamBlock[]
    ":create/time"?: number
    ":edit/time"?: number
    ":block/uid": string
  }

  export function initializeGraph(options: GraphOptions): any // Adjust the return type as needed

  export function q(
    graph: (options: GraphOptions) => any,
    query: string,
    args?: string[],
  ): Promise<RoamPage[]>

  export function pull(
    graph: (options: GraphOptions) => any,
    pattern: string,
    eid: number | string | [string, string],
  ): Promise<RoamPage[]>
}
