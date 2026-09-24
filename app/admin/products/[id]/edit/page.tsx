import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { getProduct } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";
import { smallButton } from "@/components/admin/ui";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const product = getProduct(Number((await params).id));
  if (!product) notFound();
  return (
    <div className="container-x flex max-w-2xl flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-medium tracking-[-0.03em]">Edit {product.model}</h1>
        <Link href="/admin" className={smallButton}>
          ← Back to list
        </Link>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
