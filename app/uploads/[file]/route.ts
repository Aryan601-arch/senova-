import fs from "node:fs/promises";
import path from "node:path";
import { uploadsDir } from "@/lib/db";

const types: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

/** Serves product photos from storage/uploads, so photos added in the admin panel work without a rebuild. */
export async function GET(_req: Request, ctx: RouteContext<"/uploads/[file]">) {
  const { file } = await ctx.params;
  const name = path.basename(file);
  const type = types[path.extname(name).toLowerCase()];
  if (!type || name !== file) return new Response("Not found", { status: 404 });
  try {
    const data = await fs.readFile(path.join(uploadsDir, name));
    return new Response(new Uint8Array(data), {
      headers: { "Content-Type": type, "Cache-Control": "public, max-age=3600" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
