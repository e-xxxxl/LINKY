"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./Icon";
import { HomeIllustration } from "./illustrations/HomeIllustration";
import { ScanningIllustration } from "./illustrations/ScanningIllustration";

export function ScannerForm() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Simulated progress while the real request is in flight, the same
  // "climb toward ~94%, snap to 100% on completion" pattern as the
  // source mock's own script, since actual scan progress isn't
  // something the server reports incrementally.
  useEffect(() => {
    if (status !== "loading") return;
    setProgress(8);
    const interval = setInterval(() => {
      setProgress((p) => (p >= 94 ? p : Math.min(94, p + Math.floor(Math.random() * 4) + 1)));
    }, 450);
    return () => clearInterval(interval);
  }, [status]);

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setValue(text.trim());
      inputRef.current?.focus();
    } catch {
      inputRef.current?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) {
      setStatus("error");
      setError("Enter a URL to scan.");
      return;
    }

    setStatus("loading");
    setError(null);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value.trim() }),
        signal: controller.signal,
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      setProgress(100);
      router.push(`/scan/${data.id}`);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setStatus("idle");
        return;
      }
      setStatus("error");
      setError("We couldn't reach LINKY right now. Check your connection and try again.");
    }
  }

  function handleCancel() {
    abortRef.current?.abort();
    setStatus("idle");
  }

  if (status === "loading") {
    return (
      <div className="fixed inset-x-0 top-16 bottom-20 z-40 flex flex-col bg-surface">
        <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col items-center justify-between px-margin-mobile py-space-xl">
          <div className="flex w-full justify-end">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-high px-3 py-1 shadow-sm">
              <span className="h-2 w-2 animate-ping rounded-full bg-lime" />
              <span className="text-label-sm uppercase tracking-wider text-ink">Live engine</span>
            </div>
          </div>

          <div className="my-auto flex w-full max-w-xs flex-col items-center text-center">
            <ScanningIllustration />
            <h2 className="font-display text-headline-md tracking-tight text-black">Scanning link…</h2>
            <p className="mb-space-xl mt-2 max-w-[240px] text-body-md leading-relaxed text-ink-muted">
              Processing results, won&rsquo;t take a second
            </p>
            <div className="h-2.5 w-full rounded-full bg-near-black p-0.5 shadow-inner">
              <div
                className="h-full rounded-full bg-lime transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 flex w-full items-center justify-between px-0.5">
              <span className="text-label-sm uppercase tracking-wider text-ink-faint">Inspect</span>
              <span className="text-label-sm font-semibold text-ink">{progress}%</span>
            </div>
          </div>

          <div className="w-full max-w-xs pt-space-md">
            <button
              type="button"
              onClick={handleCancel}
              className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-surface-low text-label-lg text-ink shadow-sm transition-all active:translate-y-0.5 active:bg-surface-high"
            >
              <Icon name="close" size={20} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="scanner" className="flex flex-col gap-space-sm">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-space-sm">
        <label htmlFor="url-input" className="sr-only">
          URL to scan
        </label>
        <div
          className="relative flex items-center rounded-xl bg-surface-lowest"
          style={{ boxShadow: "3px 3px 0px #1c1b1b" }}
        >
          <Icon name="link" size={22} className="pointer-events-none absolute left-3.5 text-ink-faint" />
          <input
            ref={inputRef}
            id="url-input"
            type="text"
            inputMode="url"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="Paste or type link here..."
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            aria-invalid={status === "error"}
            aria-describedby={status === "error" ? "url-error" : undefined}
            className="h-14 w-full rounded-xl bg-transparent pl-11 pr-24 text-body-sm text-ink placeholder:text-ink-faint focus:outline-none"
          />
          <button
            type="button"
            onClick={handlePaste}
            style={{ boxShadow: "1.5px 1.5px 0px #1c1b1b" }}
            className="absolute right-2.5 flex h-8 items-center gap-1 rounded-full bg-surface-high px-3 text-label-sm text-ink transition-transform active:scale-95"
          >
            <Icon name="content_paste" size={15} />
            Paste
          </button>
        </div>

        <button
          type="submit"
          style={{ boxShadow: "4px 4px 0px #c6f340" }}
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-black text-label-lg tracking-wide text-white transition-all active:translate-x-0.5 active:translate-y-0.5"
          onMouseDown={(e) => (e.currentTarget.style.boxShadow = "2px 2px 0px #c6f340")}
          onMouseUp={(e) => (e.currentTarget.style.boxShadow = "4px 4px 0px #c6f340")}
        >
          <span>Scan link</span>
          <Icon name="arrow_forward" size={20} />
        </button>

        <div className="min-h-[1.5rem]" aria-live="polite">
          {status === "error" && error && (
            <p id="url-error" role="alert" className="flex items-center gap-1.5 text-body-sm text-risk-danger">
              <Icon name="error" size={16} />
              {error}
            </p>
          )}
        </div>
      </form>

      <div className="flex w-full items-center justify-center py-2">
        <HomeIllustration />
      </div>
    </div>
  );
}
