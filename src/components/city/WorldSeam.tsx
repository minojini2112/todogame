"use client";

import Image from "next/image";

const TILE_SRC = "/aurelia/home-city.png";

type TileProps = {
  flipX?: boolean;
  flipY?: boolean;
  dim?: boolean;
};

function WorldTile({ flipX, flipY, dim }: TileProps) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`,
      }}
    >
      <Image
        src={TILE_SRC}
        alt=""
        fill
        sizes="1200px"
        className="object-cover object-center select-none"
        draggable={false}
        priority={!flipX && !flipY}
      />
      {dim ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(7,17,31,0.28), rgba(7,17,31,0.45))",
          }}
        />
      ) : null}
    </div>
  );
}

/**
 * 3×3 seamless world plate:
 * center = playable Aurelia
 * edges/corners = mirrored continuations so pan never hits void
 */
export default function WorldSeam() {
  return (
    <div
      className="grid h-full w-full"
      style={{
        gridTemplateColumns: "1fr 1fr 1fr",
        gridTemplateRows: "1fr 1fr 1fr",
      }}
    >
      {/* Top row */}
      <WorldTile flipX flipY dim />
      <WorldTile flipY dim />
      <WorldTile flipX flipY dim />

      {/* Middle row */}
      <WorldTile flipX dim />
      <WorldTile />
      <WorldTile flipX dim />

      {/* Bottom row */}
      <WorldTile flipX flipY dim />
      <WorldTile flipY dim />
      <WorldTile flipX flipY dim />
    </div>
  );
}
