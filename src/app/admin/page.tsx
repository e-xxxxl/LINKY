"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Sign-in failed.");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("We couldn't reach the server. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-margin-mobile py-24">
      <h1 className="font-display text-headline-sm text-black">Sign in</h1>
      <p className="mt-1 text-body-sm text-ink-muted">Restricted to LINKY administrators.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-space-md rounded-xl bg-surface-lowest p-space-md shadow-sm">
        <div>
          <label htmlFor="admin-password" className="mb-1.5 block text-label-md text-ink-muted">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-lg border border-line bg-surface px-3.5 text-body-sm text-ink focus:border-black focus:outline-none"
          />
        </div>

        {error && (
          <p role="alert" className="flex items-center gap-1.5 text-body-sm text-risk-danger">
            <Icon name="error" size={16} />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ boxShadow: "3px 3px 0px #1c1b1b" }}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-black text-label-lg text-white transition-transform active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-70"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
