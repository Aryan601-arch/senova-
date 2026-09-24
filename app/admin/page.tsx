import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getProducts } from "@/lib/db";
import { logout } from "./actions";
import { Logo } from "@/components/ui/logo";
import { ProductTable } from "@/components/admin/product-table";
import { Flash, primaryButton, smallButton } from "@/components/admin/ui";

type Props = { searchParams: Promise<{ flash?: string }> };

export default async function AdminDashboard({ searchParams }: Props) {
  await requireAdmin();
  const { flash } = await searchParams;
  const products = getProducts();

  return (
    <div className="container-x flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <Logo />
          <h1 className="text-2xl font-medium tracking-[-0.03em]">Products ({products.length})</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/" target="_blank" className={smallButton}>
            View site
          </Link>
          <Link href="/admin/products/new" className={primaryButton}>
            + Add product
          </Link>
          <form action={logout}>
            <button type="submit" className={smallButton}>
              Log out
            </button>
          </form>
        </div>
      </div>
      {flash && <Flash>{flash}</Flash>}
      <ProductTable products={products} />
    </div>
  );
}
