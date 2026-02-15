// React Icons
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaBehance,
  FaDribbble,
  FaPinterest,
  FaGlobe,
} from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

// Lucide Icon
import { ExternalLink } from "lucide-react"

export type SocialPlatform =
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

export function getSocialIcon(platform: SocialPlatform, className?: string) {
  const iconProps = { className: className || "w-4 h-4" }

  switch (platform) {
    case "instagram":
      return <FaInstagram {...iconProps} />
    case "facebook":
      return <FaFacebook {...iconProps} />
    case "twitter":
      return <FaXTwitter {...iconProps} />
    case "linkedin":
      return <FaLinkedin {...iconProps} />
    case "youtube":
      return <FaYoutube {...iconProps} />
    case "tiktok":
      return <FaTiktok {...iconProps} />
    case "behance":
      return <FaBehance {...iconProps} />
    case "dribbble":
      return <FaDribbble {...iconProps} />
    case "pinterest":
      return <FaPinterest {...iconProps} />
    case "website":
      return <FaGlobe {...iconProps} />
    default:
      return <ExternalLink {...iconProps} />
  }
}

export function detectSocialPlatform(url: string): SocialPlatform {
  const domain = url.toLowerCase()

  if (domain.includes("instagram.com")) return "instagram"
  if (domain.includes("facebook.com")) return "facebook"
  if (domain.includes("twitter.com") || domain.includes("x.com")) return "twitter"
  if (domain.includes("linkedin.com")) return "linkedin"
  if (domain.includes("youtube.com") || domain.includes("youtu.be")) return "youtube"
  if (domain.includes("tiktok.com")) return "tiktok"
  if (domain.includes("behance.net")) return "behance"
  if (domain.includes("dribbble.com")) return "dribbble"
  if (domain.includes("pinterest.com")) return "pinterest"

  return "website"
}
