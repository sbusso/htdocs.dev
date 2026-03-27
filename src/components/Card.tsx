import { slugifyStr } from "@utils/slugify";
import type { CollectionEntry } from "astro:content";
import { LOCALE } from "@config";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"blog">["data"];
  secHeading?: boolean;
}

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, created, description, tags } = frontmatter;

  const formattedDate = new Date(created).toLocaleDateString(LOCALE[0] || "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className: "card-title",
  };

  return (
    <li className="list-none">
      <a href={href} className="post-card">
        <time className="card-date">{formattedDate}</time>
        {secHeading ? (
          <h2 {...headerProps}>{title}</h2>
        ) : (
          <h3 {...headerProps}>{title}</h3>
        )}
        {description && <p className="card-desc">{description}</p>}
      </a>
    </li>
  );
}
