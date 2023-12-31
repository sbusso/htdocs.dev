import type { CollectionEntry } from "astro:content";

const getSortedPosts = (posts: CollectionEntry<"blog" | "cookbooks">[]) =>
  posts
    .filter(({ data }) => !data.draft)
    .sort(
      (a, b) =>
        Math.floor(new Date(b.data.created).getTime() / 1000) -
        Math.floor(new Date(a.data.created).getTime() / 1000)
    );

export default getSortedPosts;
