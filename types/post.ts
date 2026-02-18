export interface POSTS {
  id: string
  title: string
  slug: string
  description?: string
  content?: string
  author: string
  publishedDate: string
  heroImage: string
  heroVideo?: string
  images?: string[]
  videos?: string[]
  media?: Array<{
    type: "image" | "video" | "pdf" | "pptx" | "document";
    url: string
    thumbnail?: string
  }>
  tags: string[]
  backgroundColor: string
  // cardType: "post" | "newsletter" | "social"
  cardType: "post" | "social"
  size: "small" | "large"
  socialHandle?: string
  externalUrl?: string
  socialLinks?: {
    label: string
    url: string
    platform?:
    | "instagram"
    | "facebook"
    | "twitter"
    | "linkedin"
    | "youtube"
    | "tiktok"
    | "behance"
    | "dribbble"
    | "pinterest"
    | "website"
    | "other"
  }[]
  eventInfo?: {
    when: string
    where: string
  }
}