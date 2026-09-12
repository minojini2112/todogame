import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

async function logoDataUrl() {
  const bytes = await readFile(join(process.cwd(), "public/assets/Logo.jpeg"));
  return `data:image/jpeg;base64,${bytes.toString("base64")}`;
}

export default async function Icon() {
  const src = await logoDataUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "9999px",
          overflow: "hidden",
          background: "#07111f",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          width={64}
          height={64}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "9999px",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
