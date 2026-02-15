import { CARDS_POSTS } from "@/constants/POSTS";
// import { getCachedBlurData } from "@/lib/image-utils";
import { getBlurData } from "@/lib/image-utils"

export async function processPostImages(postsToProcess: typeof CARDS_POSTS) {
  return Promise.all(
    postsToProcess.map(async (post) => {
      // Determine target image
      const targetImage = post.heroImage || post.heroVideo || "";

      // If no image, return post as is
      if (!targetImage) return { ...post, blurDataURL: undefined };

      try {
        // Heavy operation: Fetch + Resize + Blur
        // const blurDataURL = await getBlurData(targetImage);
        const blurDataURL = await getBlurData(targetImage);
        return { ...post, blurDataURL };
      } catch (error) {
        console.error(`Failed to blur image for ${post.title}`, error);
        // Fallback: No blur, just standard loading
        return { ...post, blurDataURL: undefined };
      }
    })
  );
}