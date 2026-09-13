import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "EchoBound — a todo game RPG. Also called Eco Bound: turn real tasks into a city you restore.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const bytes = await readFile(join(process.cwd(), "public/assets/readme_img.jpeg"));
  const src = `data:image/jpeg;base64,${bytes.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#07111f",
          color: "white",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          width={1200}
          height={630}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(7,17,31,0.88) 0%, rgba(7,17,31,0.45) 58%, rgba(7,17,31,0.2) 100%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "64px 72px",
            width: "72%",
          }}
        >
          <div
            style={{
              fontSize: 28,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#ffc857",
              marginBottom: 16,
            }}
          >
            Todo game · Eco Bound
          </div>
          <div style={{ fontSize: 84, lineHeight: 0.95, letterSpacing: "0.04em" }}>
            EchoBound
          </div>
          <div style={{ fontSize: 30, marginTop: 20, color: "rgba(255,255,255,0.86)" }}>
            Your tasks. Your journey. A brighter tomorrow.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
