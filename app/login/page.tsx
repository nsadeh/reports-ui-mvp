"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Login failed");
        setLoading(false);
        return;
      }
      const from = searchParams.get("from");
      router.push(data.redirectTo || from || "/");
    } catch {
      setError("Network error. Try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "#FAFAF6" }}
    >
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-lg border p-8 shadow-sm"
        style={{ background: "#F3F4EE", borderColor: "#E2E5DE" }}
      >
        <h1
          className="mb-1 text-2xl font-semibold"
          style={{ color: "#083D44" }}
        >
          Inflection Labs
        </h1>
        <p className="mb-6 text-sm" style={{ color: "#6B7F82" }}>
          Enter your access password to view the report.
        </p>
        <label
          className="mb-2 block text-sm font-medium"
          style={{ color: "#1A2B2E" }}
        >
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="mb-4 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
          style={{
            background: "#FFFFFF",
            borderColor: "#E2E5DE",
            color: "#1A2B2E",
          }}
        />
        {error && (
          <p className="mb-4 text-sm" style={{ color: "#B91C1C" }}>
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          style={{ background: "#026370" }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
