"use client";

import Image from "next/image";
import { useActionState } from "react";
import type { Product } from "@/lib/db";
import { groupLabels, productGroups } from "@/data/catalog";
import { saveProduct } from "@/app/admin/actions";
import { Field, Flash, inputClass, primaryButton } from "./ui";

export function ProductForm({ product }: { product?: Product }) {
  const [state, action, pending] = useActionState(saveProduct.bind(null, product?.id ?? null), { error: null });

  return (
    <form action={action} className="flex flex-col gap-6">
      {state.error && <Flash tone="error">{state.error}</Flash>}
      <Field label="Category" hint={'e.g. "Television", "Air Conditioner"'} htmlFor="category">
        <input id="category" name="category" required defaultValue={product?.category} className={inputClass} />
      </Field>
      <Field label="Range" hint="used for the site filters" htmlFor="category_group">
        <select id="category_group" name="category_group" required defaultValue={product?.category_group ?? ""} className={inputClass}>
          <option value="" disabled>
            Choose a range
          </option>
          {productGroups.map((g) => (
            <option key={g} value={g}>
              {groupLabels[g]}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Model number" htmlFor="model">
        <input id="model" name="model" required defaultValue={product?.model} className={`${inputClass} font-mono`} />
      </Field>
      <Field label="Specification" hint="comma-separated; each part becomes a bullet on the product page" htmlFor="spec">
        <textarea id="spec" name="spec" rows={3} required defaultValue={product?.spec} className={inputClass} />
      </Field>
      <Field label="Price, NPR" hint="numbers only, e.g. 23000" htmlFor="price">
        <input id="price" name="price" type="number" min={0} step={1} required defaultValue={product?.price} className={`${inputClass} font-mono`} />
      </Field>
      <Field label="Photo" hint={product?.photo ? "uploading a new one replaces the current photo" : "optional, up to 5MB"} htmlFor="photo">
        {product?.photo && (
          <div className="mb-2 flex items-center gap-4">
            <span className="relative block size-16 overflow-hidden rounded-xl border border-line bg-white">
              <Image src={`/uploads/${product.photo}`} alt="" fill unoptimized sizes="64px" className="object-contain p-1" />
            </span>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="remove_photo" value="1" className="size-4 accent-[var(--accent)]" />
              Remove current photo (no replacement)
            </label>
          </div>
        )}
        <input id="photo" name="photo" type="file" accept="image/*" className="text-sm file:mr-4 file:rounded-full file:border-0 file:bg-fg/10 file:px-4 file:py-2 file:text-fg" />
      </Field>
      <button type="submit" disabled={pending} className={`${primaryButton} h-12 w-fit px-7`}>
        {pending ? "Saving…" : product ? "Save changes" : "Add product"}
      </button>
    </form>
  );
}
