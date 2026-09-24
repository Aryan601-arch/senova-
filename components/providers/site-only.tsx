"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Renders the public-site chrome (loader, 3D canvas, navbar, footer) everywhere except the admin panel. */
export function SiteOnly({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <>{children}</>;
}
