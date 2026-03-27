import { slugifyStr } from "@utils/slugify";
import type { CollectionEntry } from "astro:content";
import { LOCALE } from "@config";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"blog">["data"];
  secHeading?: boolean;
}

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, created, description } = frontmatter;

  const formattedDate = new Date(created).toLocaleDateString(LOCALE[0] || "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className: "card-title",
  };

  return (
    <a href={href} className="post-card">
      <div className="card-meta">{formattedDate}</div>
      {secHeading ? (
        <h2 {...headerProps}>{title}</h2>
      ) : (
        <h3 {...headerProps}>{title}</h3>
      )}
      {description && <p className="card-desc">{description}</p>}
      <span className="card-read">Read &rarr;</span>
    </a>
  );
}
