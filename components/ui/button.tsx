"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, useImperativeHandle, useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useScrollTo } from "@/hooks/use-lenis-scroll";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

type BaseProps = {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode | false;
  magnetic?: boolean;
  cursorLabel?: string;
  className?: string;
  children: ReactNode;
};

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-ink",
  secondary: "border border-line-strong text-fg hover:border-fg/40",
  ghost: "text-fg",
};

const fills: Record<Variant, string> = {
  primary: "bg-fg",
  secondary: "bg-fg",
  ghost: "bg-fg/10",
};

const hoverText: Record<Variant, string> = {
  primary: "group-hover/btn:text-bg",
  secondary: "group-hover/btn:text-bg",
  ghost: "",
};

const sizes: Record<Size, string> = {
  md: "h-11 pl-5 pr-4 text-sm gap-2.5",
  lg: "h-14 pl-7 pr-5 text-[0.95rem] gap-3",
};

/**
 * Magnetic effect: the button drifts toward the pointer while hovered.
 * Disabled on touch devices and for users who prefer reduced motion.
 */
function useMagnetic<T extends HTMLElement>(enabled: boolean) {
  const ref = useRef<T>(null);

  const onPointerMove = (e: React.PointerEvent) => {
    if (!enabled || e.pointerType !== "mouse" || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    gsap.to(ref.current, { x: x * 0.25, y: y * 0.35, duration: 0.5, ease: "power3.out" });
  };
  const onPointerLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
  };

  return { ref, onPointerMove, onPointerLeave };
}

function Inner({ variant, icon, children }: { variant: Variant; icon: ReactNode | false; children: ReactNode }) {
  return (
    <>
      {/* Fill that sweeps up on hover */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 translate-y-[101%] rounded-[inherit] transition-transform duration-500 ease-out-expo group-hover/btn:translate-y-0",
          fills[variant],
        )}
      />
      <span className={cn("relative z-10 transition-colors duration-500", hoverText[variant])}>{children}</span>
      {icon !== false && (
        <span
          aria-hidden="true"
          className={cn(
            "relative z-10 grid size-7 place-items-center overflow-hidden rounded-full transition-colors duration-500",
            variant === "primary" ? "bg-accent-ink/10" : "bg-fg/10",
            hoverText[variant],
          )}
        >
          {icon ?? (
            <span className="relative block size-4">
              <ArrowUpRight className="absolute inset-0 size-4 transition-transform duration-500 ease-out-expo group-hover/btn:-translate-y-5 group-hover/btn:translate-x-5" />
              <ArrowUpRight className="absolute inset-0 size-4 -translate-x-5 translate-y-5 transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-0 group-hover/btn:translate-y-0" />
            </span>
          )}
        </span>
      )}
    </>
  );
}

const baseClass =
  "group/btn relative isolate inline-flex select-none items-center justify-center overflow-hidden rounded-full font-medium tracking-[-0.01em] will-change-transform active:scale-[0.97] transition-[transform,border-color] duration-300 disabled:pointer-events-none disabled:opacity-60";

type ButtonLinkProps = BaseProps & { href: string } & Omit<ComponentPropsWithoutRef<"a">, "href" | "children">;

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  icon,
  magnetic = true,
  cursorLabel,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const { ref, onPointerMove, onPointerLeave } = useMagnetic<HTMLAnchorElement>(magnetic);
  const pathname = usePathname();
  const scrollTo = useScrollTo();
  const isExternal = /^https?:|^mailto:|^tel:/.test(href);
  // In-page section links (#id or /#id on the home page) scroll smoothly with Lenis.
  const sectionId = href.startsWith("#") ? href.slice(1) : href.startsWith("/#") && pathname === "/" ? href.slice(2) : null;
  const { onClick, ...restProps } = rest;
  const cls = cn(baseClass, variants[variant], sizes[size], className);
  const shared = {
    className: cls,
    onPointerMove,
    onPointerLeave,
    "data-cursor": "hover",
    "data-cursor-label": cursorLabel,
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (e.defaultPrevented || !sectionId) return;
      if (scrollTo(sectionId)) e.preventDefault();
    },
    ...restProps,
  };

  if (isExternal || href.startsWith("#")) {
    return (
      <a ref={ref} href={href} {...shared}>
        <Inner variant={variant} icon={icon ?? undefined}>
          {children}
        </Inner>
      </a>
    );
  }
  return (
    <Link ref={ref} href={href} {...shared}>
      <Inner variant={variant} icon={icon ?? undefined}>
        {children}
      </Inner>
    </Link>
  );
}

type ButtonProps = BaseProps & Omit<ComponentPropsWithoutRef<"button">, "children">;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", icon, magnetic = true, cursorLabel, className, children, ...rest },
  forwarded,
) {
  const { ref, onPointerMove, onPointerLeave } = useMagnetic<HTMLButtonElement>(magnetic);
  useImperativeHandle(forwarded, () => ref.current as HTMLButtonElement);
  return (
    <button
      ref={ref}
      className={cn(baseClass, variants[variant], sizes[size], className)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      data-cursor="hover"
      data-cursor-label={cursorLabel}
      {...rest}
    >
      <Inner variant={variant} icon={icon ?? undefined}>
        {children}
      </Inner>
    </button>
  );
});
