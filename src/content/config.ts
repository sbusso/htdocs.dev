import { SITE } from "@config";
import { defineCollection, z } from "astro:content";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Matches "YYYY-MM-DD"
const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/; // Matches "YYYY-MM-DDTHH:MM"
const dateTimeWithSecondsRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/; // Matches "YYYY-MM-DDTHH:MM:SS"

const dateTimeWithTimezoneRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/; // Matches "YYYY-MM-DDTHH:MM:SSZ"

const blogCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),

      title: z.string(),
      postSlug: z.string().optional(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image()
        .refine(img => img.width >= 1200 && img.height >= 630, {
          message: "OpenGraph image must be at least 1200 X 630 pixels!",
        })
        .or(z.string())
        .optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      published: z.boolean().optional(),
      created: z.union([
        z.string().refine(date => dateRegex.test(date)),
        z.string().refine(dateTime => dateTimeRegex.test(dateTime)),
        z
          .string()
          .refine(dateTimeWithSeconds =>
            dateTimeWithSecondsRegex.test(dateTimeWithSeconds)
          ),
        z
          .string()
          .refine(dateTimeWithTimezone =>
            dateTimeWithTimezoneRegex.test(dateTimeWithTimezone)
          ),
        z.date(),
      ]),
      updated: z.string().optional(),
    }),
});

const cookbookCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      title: z.string(),
      postSlug: z.string().optional(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image()
        .refine(img => img.width >= 1200 && img.height >= 630, {
          message: "OpenGraph image must be at least 1200 X 630 pixels!",
        })
        .or(z.string())
        .optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      published: z.boolean().optional(),
      created: z.string().refine(date => {
        return dateRegex.test(date) || dateTimeRegex.test(date);
      }),
      updated: z.string().optional(),
    }),
});

const projectCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),

      title: z.string(),
      postSlug: z.string().optional(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image()
        .refine(img => img.width >= 1200 && img.height >= 630, {
          message: "OpenGraph image must be at least 1200 X 630 pixels!",
        })
        .or(z.string())
        .optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      published: z.boolean().optional(),
      created: z.string().refine(date => {
        return dateRegex.test(date) || dateTimeRegex.test(date);
      }),
      updated: z.string().optional(),
    }),
});

export const collections = {
  blogCollection,
  cookbookCollection,
  projectCollection,
};
