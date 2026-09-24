/** The six product ranges used for filters, the home page and the admin form. */
export const productGroups = ["refrigeration", "cooling", "laundry", "kitchen", "entertainment", "home"] as const;

export type ProductGroup = (typeof productGroups)[number];

export const groupLabels: Record<ProductGroup, string> = {
  refrigeration: "Refrigeration",
  cooling: "Cooling",
  laundry: "Laundry",
  kitchen: "Kitchen",
  entertainment: "Entertainment",
  home: "Home",
};

export const isProductGroup = (value: unknown): value is ProductGroup =>
  typeof value === "string" && (productGroups as readonly string[]).includes(value);

export const priceNote =
  "Official Nexon Corporation Pvt. Ltd. price list for the Webor line. All prices inclusive of VAT and subject to change without prior notice. Call 980-1111669 to confirm current pricing and stock before you buy.";

/** Rs 23,000 — Indian digit grouping, as on the official price list. */
export const formatPrice = (price: number) => `Rs ${price.toLocaleString("en-IN")}`;
