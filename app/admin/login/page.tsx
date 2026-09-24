import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { Logo } from "@/components/ui/logo";
import { LoginForm } from "@/components/admin/login-form";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="container-x grid min-h-[80vh] place-items-center">
      <div className="w-full max-w-sm rounded-[2rem] border border-line bg-bg-elevated/60 p-8">
        <Logo />
        <h1 className="mb-6 mt-8 text-2xl font-medium tracking-[-0.03em]">Admin login</h1>
        <LoginForm />
        <p className="mt-6 text-sm text-fg-muted">
          <Link href="/" className="hover:text-fg">
            ← Back to the site
          </Link>
        </p>
      </div>
    </div>
  );
}
