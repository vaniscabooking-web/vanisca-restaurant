import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const alt = "Vanisca Restaurant Agadir";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(120% 120% at 50% 0%, #3a2414 0%, #1a1714 50%, #100e0c 100%)",
          color: "#f5efe4",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: "0.3em",
            color: "#c8a45c",
            textTransform: "uppercase",
          }}
        >
          Vanisca
        </div>
        <div style={{ fontSize: 30, marginTop: 16, opacity: 0.8 }}>
          Restaurant méditerranéen · Agadir
        </div>
        <div
          style={{
            marginTop: 40,
            width: 120,
            height: 4,
            background: "linear-gradient(90deg,#e3c889,#c8a45c,#a07e3c)",
          }}
        />
        <div style={{ fontSize: 22, marginTop: 40, opacity: 0.6 }}>
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    { ...size },
  );
}
