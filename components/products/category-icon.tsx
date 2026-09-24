import { categoryIcons } from "@/data/category-icons";
import { cn } from "@/lib/utils";

const fallback =
  '<rect x="6" y="6" width="20" height="20" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 20l6-6 4 4 6-8 4 6"></path>';

/** Line-art glyph for a product category, used when a product has no photo yet. */
export function CategoryIcon({ category, className }: { category: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-12", className)}
      // Glyphs come from the local data file only.
      dangerouslySetInnerHTML={{ __html: categoryIcons[category] ?? fallback }}
    />
  );
}
