import { BootLoader } from "@/components/intro/BootLoader";

export default function Loading() {
  return (
    <div className="flex h-dvh items-center justify-center bg-[#071018]">
      <BootLoader />
    </div>
  );
}
