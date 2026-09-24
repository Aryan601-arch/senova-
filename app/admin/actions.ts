"use server";

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { redirect } from "next/navigation";
import { isProductGroup } from "@/data/catalog";
import { passwordMatches, requireAdmin, signIn, signOut } from "@/lib/admin-auth";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct, uploadsDir, type NewProduct } from "@/lib/db";

export type FormState = { error: string | null };

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!passwordMatches(String(formData.get("password") ?? ""))) return { error: "Wrong password. Try again." };
  await signIn();
  redirect("/admin");
}

export async function logout() {
  await signOut();
  redirect("/admin/login");
}

const MAX_PHOTO = 5 * 1024 * 1024;

async function savePhoto(file: File) {
  const ext = path.extname(file.name).toLowerCase() || ".jpg";
  const name = crypto.randomBytes(8).toString("hex") + ext;
  await fs.writeFile(path.join(uploadsDir, name), Buffer.from(await file.arrayBuffer()));
  return name;
}

/** Deletes a photo file unless another product still uses it. */
async function removePhotoIfUnused(photo: string | null) {
  if (!photo || getProducts().some((p) => p.photo === photo)) return;
  await fs.unlink(path.join(uploadsDir, path.basename(photo))).catch(() => {});
}

function done(message: string): never {
  redirect(`/admin?flash=${encodeURIComponent(message)}`);
}

export async function saveProduct(id: number | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const existing = id ? getProduct(id) : undefined;
  if (id && !existing) return { error: "That product no longer exists." };

  const category = String(formData.get("category") ?? "").trim();
  const group = formData.get("category_group");
  const model = String(formData.get("model") ?? "").trim();
  const spec = String(formData.get("spec") ?? "").trim();
  const price = Number.parseInt(String(formData.get("price") ?? ""), 10);
  if (!category || !isProductGroup(group) || !model || !spec || !Number.isFinite(price) || price < 0) {
    return { error: "Please fill in every field." };
  }

  const file = formData.get("photo");
  const upload = file instanceof File && file.size > 0 ? file : null;
  if (upload && !upload.type.startsWith("image/")) return { error: "Only image files are allowed for the photo." };
  if (upload && upload.size > MAX_PHOTO) return { error: "That photo is over 5MB. Please use a smaller one." };

  let photo = existing?.photo ?? null;
  if (upload) photo = await savePhoto(upload);
  else if (formData.get("remove_photo") === "1") photo = null;

  const data: NewProduct = { category, category_group: group, model, spec, price, photo };
  if (existing) {
    updateProduct(existing.id, data);
    if (existing.photo !== photo) await removePhotoIfUnused(existing.photo);
    done(`${model} updated.`);
  }
  createProduct(data);
  done(`${model} added.`);
}

export async function removeProduct(id: number) {
  await requireAdmin();
  const existing = getProduct(id);
  if (existing) {
    deleteProduct(id);
    await removePhotoIfUnused(existing.photo);
  }
  done("Product deleted.");
}
