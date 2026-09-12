import { BootLoader } from "@/components/intro/BootLoader";

export default function BoardLoading() {
  return (
    <div className="flex h-dvh items-center justify-center">
      <BootLoader />
    </div>
  );
}
