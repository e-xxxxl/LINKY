import Link from "next/link";
import { LinkyMark } from "@/components/LinkyMark";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <LinkyMark size={40} />
      <h1 className="mt-4 font-display text-headline-sm text-black">Page not found</h1>
      <p className="mt-2 max-w-sm text-body-sm text-ink-muted">
        The page or scan report you're looking for doesn't exist or may have been removed.
      </p>
      <Link href="/" className="mt-6 text-label-md font-semibold text-black underline underline-offset-2">
        Back to LINKY
      </Link>
    </div>
  );
}
