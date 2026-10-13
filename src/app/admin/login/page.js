"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Shield, ArrowRight, AlertCircle, ArrowLeft } from "lucide-react";
import { storeConfig } from "@/lib/store-config";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@ridehub.in");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid login credentials.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setErrorMsg(err.message || "Failed to log in.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center mx-auto mb-4 shadow-md">
            <Shield size={24} />
          </div>
          <h2 className="heading-display text-3xl font-bold text-text-primary">
            Store Owner Portal
          </h2>
          <p className="mt-1.5 text-xs text-text-secondary">
            RideHub Bongaigaon • Product, Inventory & COD Order Management
          </p>
        </div>

        <div className="mt-8 bg-bg-primary py-8 px-6 sm:px-10 shadow-sm border border-border-default rounded-3xl">
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="email">
                Owner Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="admin@ridehub.in"
              />
            </div>

            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full h-11 text-sm font-semibold flex items-center justify-center gap-2 mt-2 shadow-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Access Admin Panel <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          {/* Quick Development / Owner Helper */}
          <div className="mt-6 pt-5 border-t border-border-default text-center">
            <p className="text-[11px] text-text-secondary">
              Initial Owner Passcode: <code className="bg-bg-secondary px-1.5 py-0.5 rounded text-accent font-semibold">ridehub2026</code>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-text-secondary hover:text-text-primary inline-flex items-center gap-1"
          >
            <ArrowLeft size={13} /> Back to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
