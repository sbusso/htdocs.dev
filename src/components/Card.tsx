import { slugifyStr } from "@utils/slugify";
import type { CollectionEntry } from "astro:content";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"blog">["data"];
  secHeading?: boolean;
}

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, created, description } = frontmatter;

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className: "text-lg font-medium not-italic hover:decoration-solid",
  };

  return (
    <li className=" my-6 min-w-full">
      <a
        href={href}
        className=" inline-block text-lg font-medium text-skin-accent decoration-1 underline-offset-4 hover:decoration-solid"
      >
        {secHeading ? (
          <h2 {...headerProps}>{title}</h2>
        ) : (
          <h3 {...headerProps}>{title}</h3>
        )}
      </a>
      {/* <Datetime datetime={created} /> */}
      <p className="mt-2  ">{description}</p>
    </li>
  );
}
