import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { ProductForm } from "@/components/admin/product-form";
import { smallButton } from "@/components/admin/ui";

export default async function NewProductPage() {
  await requireAdmin();
  return (
    <div className="container-x flex max-w-2xl flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-medium tracking-[-0.03em]">Add a product</h1>
        <Link href="/admin" className={smallButton}>
          ← Back to list
        </Link>
      </div>
      <ProductForm />
    </div>
  );
}
