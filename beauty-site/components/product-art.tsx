import type { ProductKind } from "@/lib/types";

/**
 * Drawn packaging used when a product photo can't load, and in decorative spots.
 * Each kind gets its own silhouette; the tint comes from the product's key ingredient.
 */

const tints: [RegExp, string][] = [
  [/rose|sakura|peach|jasmine/i, "#e8b4a8"],
  [/strawberr/i, "#e58f8f"],
  [/aloe|green tea|cucumber|avocado|mint/i, "#b5c4a1"],
  [/vitamin c|orange|lemon|papaya/i, "#f0bf86"],
  [/blueberr|lavender/i, "#b9aed3"],
  [/honey|cocoa|coconut|almond|vitamin e/i, "#dcc09a"],
];

export function tintFor(name: string) {
  return tints.find(([re]) => re.test(name))?.[1] ?? "#ecd3c9";
}

type Props = {
  kind: ProductKind;
  name: string;
  className?: string;
};

export function ProductArt({ kind, name, className }: Props) {
  const tint = tintFor(name);
  const id = `g-${kind}-${name.replace(/[^a-z]/gi, "").slice(0, 12)}`;
  return (
    <svg viewBox="0 0 200 240" className={className} role="img" aria-label={name}>
      <defs>
        <linearGradient id={`${id}-body`} x1="0" x2="1">
          <stop offset="0" stopColor={tint} />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor={tint} />
        </linearGradient>
        <linearGradient id={`${id}-cap`} x1="0" x2="1">
          <stop offset="0" stopColor="#c9a27a" />
          <stop offset="0.5" stopColor="#f3e2c8" />
          <stop offset="1" stopColor="#b08a62" />
        </linearGradient>
        <radialGradient id={`${id}-shadow`}>
          <stop offset="0" stopColor="#93503f" stopOpacity="0.28" />
          <stop offset="1" stopColor="#93503f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="222" rx="62" ry="9" fill={`url(#${id}-shadow)`} />
      <Silhouette kind={kind} id={id} tint={tint} />
    </svg>
  );
}

function Label({ y, small }: { y: number; small?: boolean }) {
  return (
    <text
      x="100"
      y={y}
      textAnchor="middle"
      fontFamily="Georgia, serif"
      fontSize={small ? 9 : 12}
      letterSpacing="2.5"
      fill="#7a4a3e"
    >
      SENOVA
    </text>
  );
}

function Silhouette({ kind, id, tint }: { kind: ProductKind; id: string; tint: string }) {
  const body = `url(#${id}-body)`;
  const cap = `url(#${id}-cap)`;
  switch (kind) {
    case "serum":
      return (
        <g>
          <rect x="70" y="100" width="60" height="118" rx="12" fill={body} />
          <rect x="84" y="80" width="32" height="22" rx="3" fill={cap} />
          <path d="M88 80 Q88 40 100 36 Q112 40 112 80 Z" fill="#3d2b27" />
          <Label y={165} small />
        </g>
      );
    case "toner":
    case "spray":
    case "cleanser":
    case "shower":
    case "lotion":
      return (
        <g>
          <rect x="66" y="78" width="68" height="140" rx={kind === "lotion" ? 22 : 14} fill={body} />
          <rect x="84" y="56" width="32" height="24" rx="3" fill={cap} />
          {kind === "spray" || kind === "lotion" || kind === "shower" ? (
            <path d="M92 56 V38 H120 V46 H100 V56 Z" fill="#c9a27a" />
          ) : null}
          <Label y={150} />
        </g>
      );
    case "jar":
      return (
        <g>
          <rect x="46" y="140" width="108" height="78" rx="14" fill={body} />
          <rect x="42" y="112" width="116" height="32" rx="8" fill={cap} />
          <Label y={186} />
        </g>
      );
    case "gel":
      return (
        <g>
          <rect x="52" y="120" width="96" height="98" rx="18" fill={body} />
          <rect x="48" y="96" width="104" height="28" rx="8" fill="#b5c4a1" />
          <Label y={176} />
        </g>
      );
    case "tube":
    case "sunscreen":
    case "scrub":
    case "handcream":
      return (
        <g>
          <path d="M62 60 H138 L128 196 H72 Z" fill={body} />
          <rect x="74" y="196" width="52" height="24" rx="4" fill={cap} />
          <rect x="60" y="52" width="80" height="10" rx="2" fill={tint} />
          <Label y={128} />
        </g>
      );
    case "mask":
      return (
        <g>
          <path d="M52 40 H148 V206 H52 Z" fill={body} />
          <path d="M52 40 H148 V52 H52 Z" fill={tint} />
          <path d="M52 194 H148 V206 H52 Z" fill={tint} />
          <circle cx="100" cy="112" r="26" fill="#fff" opacity="0.7" />
          <Label y={164} />
        </g>
      );
    case "lipoil":
      return (
        <g>
          <rect x="84" y="96" width="32" height="122" rx="8" fill={body} />
          <rect x="86" y="40" width="28" height="58" rx="5" fill={cap} />
          <Label y={160} small />
        </g>
      );
    case "balm":
      return (
        <g>
          <rect x="80" y="112" width="40" height="106" rx="6" fill={body} />
          <rect x="80" y="66" width="40" height="48" rx="6" fill={tint} opacity="0.9" />
          <path d="M84 66 L84 50 Q100 34 116 50 L116 66 Z" fill={tint} />
          <Label y={170} small />
        </g>
      );
  }
}
