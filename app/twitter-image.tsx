import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site";

export const alt = `${siteConfig.legalName} — Genuine Webor home appliances in Nepal`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Generated Open Graph / Twitter card image — no static asset to maintain. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 78% 40%, #2a3308 0%, #0b0d10 45%, #07080a 100%)",
          color: "#eeeee8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, fontWeight: 600 }}>
          <div style={{ width: 44, height: 44, borderRadius: 999, background: "#d4ff3f" }} />
          {siteConfig.legalName.toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, fontWeight: 600, letterSpacing: -6, lineHeight: 0.95 }}>Creating</div>
          <div style={{ display: "flex", fontSize: 120, fontWeight: 600, letterSpacing: -6, lineHeight: 0.95 }}>
            {"easy"}&nbsp;<span style={{ color: "#d4ff3f", fontStyle: "italic" }}>life.</span>
          </div>
        </div>
        <div style={{ fontSize: 28, color: "#a0a19a" }}>Call 980-1111669 · Full official price list</div>
      </div>
    ),
    size,
  );
}
