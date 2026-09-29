"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { bag } from "@/lib/bag";

export function AddToBag({ slug, name }: { slug: string; name: string }) {
  const [qty, setQty] = useState(1);
  return (
    <div className="flex gap-3">
      <div className="inline-flex items-center rounded-[3px] border border-line bg-white">
        <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-11 place-items-center" aria-label="One less">
          <Minus className="size-4" />
        </button>
        <span className="w-8 text-center" aria-live="polite">{qty}</span>
        <button type="button" onClick={() => setQty((q) => q + 1)} className="grid size-11 place-items-center" aria-label="One more">
          <Plus className="size-4" />
        </button>
      </div>
      <button type="button" onClick={() => bag.add(slug, qty)} className="btn btn-rose flex-1" aria-label={`Add ${name} to bag`}>
        <ShoppingBag className="size-4" aria-hidden="true" /> Add to bag
      </button>
    </div>
  );
}
