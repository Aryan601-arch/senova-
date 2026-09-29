import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">Page not found</p>
      <h1 className="mt-3 text-heading">This page has drifted away</h1>
      <p className="mt-4 max-w-md text-cocoa-muted">The page you are looking for doesn&apos;t exist or has moved.</p>
      <Link href="/shop" className="btn btn-rose mt-8">Shop all products</Link>
    </section>
  );
}
