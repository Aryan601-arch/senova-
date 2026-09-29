export type Category = "Face" | "Body" | "Lips";

/** Drives the drawn fallback artwork when a product photo can't load. */
export type ProductKind =
  | "mask"
  | "scrub"
  | "cleanser"
  | "toner"
  | "serum"
  | "spray"
  | "sunscreen"
  | "tube"
  | "gel"
  | "jar"
  | "shower"
  | "handcream"
  | "lotion"
  | "lipoil"
  | "balm";

export type Product = {
  slug: string;
  name: string;
  category: Category;
  kind: ProductKind;
  image: string;
  description: string;
  /** Optional; when set the card shows it using the currency in data/site.ts. */
  price?: number;
  bestSeller?: boolean;
};
