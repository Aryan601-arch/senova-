import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { siteConfig } from "@/data/site";
import { productGroups } from "@/data/catalog";
import { getProducts } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const now = new Date();
  return [
    { url: siteConfig.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...productGroups.map((g) => ({
      url: `${siteConfig.url}/products?group=${g}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...getProducts().map((p) => ({
      url: `${siteConfig.url}/product/${p.id}`,
      lastModified: new Date(`${p.updated_at.replace(" ", "T")}Z`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
