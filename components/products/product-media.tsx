import Image from "next/image";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "./category-icon";

type ProductMediaProps = {
  photo: string | null;
  category: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** Product photo on a white stage (the photos are shot on white), or the category glyph. */
export function ProductMedia({ photo, category, alt, sizes, priority, className }: ProductMediaProps) {
  return (
    <div className={cn("grid place-items-center overflow-hidden bg-white", className)}>
      {photo ? (
        <Image
          src={`/uploads/${photo}`}
          alt={alt}
          fill
          unoptimized
          priority={priority}
          sizes={sizes}
          className="object-contain p-[8%] transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]"
        />
      ) : (
        <CategoryIcon category={category} className="size-[34%] max-w-24 text-neutral-400" />
      )}
    </div>
  );
}
