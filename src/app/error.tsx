"use client";

import { useEffect } from "react";
import Link from "next/link";
import { LinkyMark } from "@/components/LinkyMark";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <LinkyMark size={40} />
          <h1 className="text-xl font-semibold mt-4">Something went wrong</h1>
          <p className="text-sm text-gray-500 mt-2 max-w-sm">
            LINKY ran into an unexpected error. You can try again, and if the problem continues,
            come back in a few minutes.
          </p>
          <div className="mt-6 flex gap-4">
            <button onClick={reset} className="text-sm font-medium text-black underline underline-offset-2">
              Try again
            </button>
            <Link href="/" className="text-sm font-medium text-black underline underline-offset-2">
              Back to LINKY
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
