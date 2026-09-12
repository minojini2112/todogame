import Image from "next/image";
import splashArt from "@/assests/splash_screen.jpeg";

function Bone({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-full bg-[rgba(232,196,140,0.14)] ${className ?? ""}`}
    />
  );
}

/** Shared board/vault shell so navigation keeps the sanctum layout visible. */
export function SanctumPageSkeleton({
  variant = "board",
}: {
  variant?: "board" | "vault";
}) {
  return (
    <div className="sanctum relative min-h-dvh overflow-hidden" aria-busy aria-label="Loading">
      <Image
        src={splashArt}
        alt=""
        fill
        priority
        quality={75}
        sizes="100vw"
        className="scale-105 object-cover object-[center_35%]"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(12,9,7,0.58) 0%, rgba(16,11,8,0.74) 40%, rgba(8,6,4,0.92) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen sanctum-motes"
      />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <header className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="min-w-0 space-y-2">
            <p className="font-splash text-[11px] tracking-[0.32em] text-[var(--sanctum-gold)]">
              EchoBound
            </p>
            <Bone className="h-4 w-40" />
            <Bone className="h-1.5 w-[min(100%,220px)] rounded-full" />
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Bone className="h-8 w-16" />
            <Bone className="h-8 w-16" />
            <Bone className="h-8 w-14" />
            <Bone className="h-8 w-24" />
          </div>
        </header>

        <div className="flex flex-wrap gap-3 px-4 pb-3 sm:px-6">
          <Bone className="h-8 w-24" />
          <Bone className="h-8 w-28" />
          <Bone className="h-8 w-20" />
        </div>

        <div className="flex-1 px-4 pb-8 sm:px-6">
          {variant === "vault" ? (
            <div className="sanctum-panel mx-auto max-w-5xl rounded-[32px] border border-[rgba(232,196,140,0.22)] p-5 sm:p-8">
              <Bone className="h-3 w-24" />
              <Bone className="mt-3 h-8 w-48" />
              <Bone className="mt-3 h-4 w-full max-w-md" />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-[24px] border border-[rgba(232,196,140,0.16)] bg-black/25"
                  >
                    <Bone className="h-48 w-full rounded-none sm:h-56" />
                    <div className="space-y-2 p-4">
                      <Bone className="h-3 w-16" />
                      <Bone className="h-6 w-28" />
                      <Bone className="h-4 w-full" />
                      <Bone className="h-1 w-full rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <div className="sanctum-panel min-w-0 flex-1 rounded-[28px] border border-[rgba(232,196,140,0.22)] p-4">
                <div className="mb-4 flex gap-2">
                  <Bone className="h-8 w-28" />
                  <Bone className="h-8 w-24" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[0, 1, 2].map((col) => (
                    <div
                      key={col}
                      className="space-y-3 rounded-2xl border border-[rgba(232,196,140,0.12)] bg-black/20 p-3"
                    >
                      <Bone className="h-4 w-24" />
                      <Bone className="h-16 w-full rounded-xl" />
                      <Bone className="h-16 w-full rounded-xl" />
                      <Bone className="h-16 w-full rounded-xl" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="sanctum-panel hidden w-[280px] shrink-0 rounded-[28px] border border-[rgba(232,196,140,0.22)] p-4 lg:block">
                <Bone className="h-3 w-28" />
                <Bone className="mx-auto mt-6 h-40 w-40 rounded-full" />
                <Bone className="mx-auto mt-4 h-6 w-24" />
                <Bone className="mx-auto mt-2 h-3 w-36" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CityPageSkeleton() {
  return (
    <div
      className="relative h-dvh min-h-[640px] w-full overflow-hidden bg-[#0a1624]"
      aria-busy
      aria-label="Loading map"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(85,230,255,0.08),transparent_55%),linear-gradient(180deg,#0a1624,#07111f)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 sanctum-motes opacity-25 mix-blend-screen" />

      <div className="absolute inset-x-0 top-0 z-40 flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="w-[220px] rounded-2xl border border-white/10 bg-void/70 px-4 py-3 backdrop-blur-xl">
          <BoneCyan className="h-3 w-24" />
          <BoneCyan className="mt-2 h-4 w-28" />
          <BoneCyan className="mt-2 h-3 w-full" />
          <BoneCyan className="mt-1 h-3 w-[80%]" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-1 rounded-full border border-white/10 bg-void/70 p-1 backdrop-blur-xl">
            <BoneCyan className="h-8 w-16" />
            <BoneCyan className="h-8 w-14" />
            <BoneCyan className="h-8 w-14" />
            <BoneCyan className="h-8 w-24" />
          </div>
          <BoneCyan className="h-10 w-36" />
        </div>
      </div>

      {[
        { left: "24%", top: "72%" },
        { left: "78%", top: "70%" },
        { left: "24%", top: "34%" },
        { left: "78%", top: "32%" },
      ].map((spot) => (
        <div
          key={`${spot.left}-${spot.top}`}
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ left: spot.left, top: spot.top }}
        >
          <BoneCyan className="mx-auto h-20 w-20 rounded-full" />
          <BoneCyan className="mx-auto mt-2 h-5 w-16" />
        </div>
      ))}

      <div className="absolute right-4 bottom-28 z-40 w-[min(74vw,252px)] sm:right-5 sm:bottom-32">
        <div className="rounded-[22px] border border-heartlight/20 bg-[#07111f]/93 p-3.5 backdrop-blur-xl">
          <BoneCyan className="h-3 w-28" />
          <BoneCyan className="mt-2 h-6 w-36" />
          <BoneCyan className="mt-3 h-10 w-full rounded-xl" />
          <BoneCyan className="mt-2 h-10 w-full rounded-xl" />
          <BoneCyan className="mt-2 h-10 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function BoneCyan({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-full bg-white/10 ${className ?? ""}`} />
  );
}

export function RanksPageSkeleton() {
  return (
    <main
      className="relative min-h-dvh overflow-hidden bg-[#0a1624] text-[#f2f8ff]"
      aria-busy
      aria-label="Loading echo chorus"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(85,230,255,0.12),transparent_50%),linear-gradient(180deg,rgba(7,17,31,0.7),rgba(7,17,31,0.95))]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 sanctum-motes opacity-25 mix-blend-screen" />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 py-6 sm:px-6">
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <BoneCyan className="h-3 w-28" />
            <BoneCyan className="h-10 w-56" />
            <BoneCyan className="h-4 w-72 max-w-full" />
          </div>
          <BoneCyan className="h-9 w-32" />
        </header>

        <section className="relative mt-8 rounded-[28px] border border-heartlight/20 bg-[#07111f]/88 p-4 sm:p-5">
          <BoneCyan className="h-3 w-24" />
          <BoneCyan className="mt-2 h-3 w-48" />
          <div className="mt-4 space-y-2.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/30 px-3.5 py-3"
              >
                <div className="flex items-center gap-3">
                  <BoneCyan className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <BoneCyan className="h-4 w-36" />
                    <BoneCyan className="h-3 w-20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <BoneCyan className="ml-auto h-3 w-20" />
                  <BoneCyan className="ml-auto h-3 w-14" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
