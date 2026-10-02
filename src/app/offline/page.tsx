import Link from "next/link";
import { LinkyMark } from "@/components/LinkyMark";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <LinkyMark size={40} />
      <h1 className="mt-4 font-display text-headline-sm text-black">You're offline</h1>
      <p className="mt-2 max-w-sm text-body-sm text-ink-muted">
        LINKY needs a connection to scan links and load reports. Check your connection and try
        again.
      </p>
      <Link href="/" className="mt-6 text-label-md font-semibold text-black underline underline-offset-2">
        Try again
      </Link>
    </div>
  );
}
