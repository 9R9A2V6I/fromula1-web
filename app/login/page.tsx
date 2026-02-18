"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import users from "@/app/data/users.json";

const highlights = [
  "Unified creator dossiers",
  "Live campaign telemetry",
  "Payout & deliverable checks",
];

const stats = [
  { label: "Creators tracked", value: "3,842" },
  { label: "Active campaigns", value: "127" },
  { label: "Regions monitored", value: "19" },
  { label: "Avg. response", value: "< 4 min" },
];

type Credential = { username: string; password: string; role: string };

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const credentialMap = useMemo(() => users as Credential[], []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const match = credentialMap.find(
      (user) => user.username === username.trim() && user.password === password
    );

    if (!match) {
      setError("Invalid credentials. Check your username and password.");
      return;
    }

    sessionStorage.setItem("mockUser", JSON.stringify(match));
    router.push("/dashboard/home");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#EBEAE5] text-[#0b0b0b]">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 -top-32 h-[620px] w-[620px] rounded-full bg-gradient-to-br from-[#d2ff03]/35 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-gradient-to-tl from-[#9ff9ff]/35 via-transparent to-transparent blur-3xl" />
        <motion.div
          initial={{ opacity: 0.2, y: 20 }}
          animate={{ opacity: 0.45, y: 0 }}
          transition={{ duration: 1.6, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(26,26,26,.05),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(26,26,26,.05),transparent_30%),linear-gradient(120deg,rgba(26,26,26,.08),rgba(26,26,26,.02))]"
        />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-10 lg:flex-row lg:items-center lg:py-16">
        <div className="flex-1 space-y-8">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-black/70 shadow-sm">
            Influencer Intelligence
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight lg:text-5xl">
              Log in to the influencer command console
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-black/70">
              Keep every creator dossier, campaign pulse, and payment health in one dashboard.
              Built for operator speed—no spreadsheets, no back-and-forth.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {highlights.map((item) => (
              <motion.span
                key={item}
                whileHover={{ y: -2, scale: 1.02 }}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black/80 shadow-sm"
              >
                {item}
              </motion.span>
            ))}
          </div>

          <div className="grid max-w-md grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * index }}
                className="rounded-xl border border-black/10 bg-white px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.12)]"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-black/50">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold text-black">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex w-fit items-center gap-4 rounded-xl border border-black/10 bg-white px-5 py-4 shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-lime-400/60 bg-lime-300/70 text-lg font-semibold text-black shadow-[0_10px_30px_rgba(210,255,3,0.35)]">
              ✓
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-black">Live audit trails</p>
              <p className="text-sm text-black/70">Track login history, device trust, and collaborator approvals.</p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          className="flex-1"
        >
          <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white/90 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm lg:p-10">
            <motion.div
              className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#d2ff03]/30 blur-3xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            />
            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <p className="text-sm text-black/60">Log in</p>
                <p className="text-xl font-semibold text-black">Welcome back, Operator</p>
              </div>
              <span className="rounded-full border border-black/10 bg-black text-xs px-3 py-1 text-white/90 shadow-sm">
                v1.3
              </span>
            </div>

            <form className="mt-8 space-y-5 relative z-10" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-black/80" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ops.lead"
                  className="w-full rounded-xl border border-black/10 bg-[#F6F6F2] px-4 py-3 text-sm text-black placeholder:text-black/40 outline-none transition focus:border-lime-400 focus:ring-2 focus:ring-lime-400/40"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-black/80" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-[#F6F6F2] px-4 py-3 text-sm text-black placeholder:text-black/40 outline-none transition focus:border-lime-400 focus:ring-2 focus:ring-lime-400/40"
                  required
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-400/40 bg-red-100 px-4 py-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-black/70">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-black/30 text-black focus:ring-lime-400/60"
                  />
                  Remember this device
                </label>
                <a href="#" className="text-black underline-offset-4 transition hover:underline">
                  Forgot access?
                </a>
              </div>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full rounded-xl bg-[#0b0b0b] py-3.5 text-sm font-semibold text-[#d2ff03] shadow-[0_16px_45px_rgba(0,0,0,0.35)] transition hover:bg-black"
              >
                Sign in to console
              </motion.button>

              <div className="flex items-center gap-3 text-xs text-black/50">
                <span className="h-px w-full bg-black/10" />
                <span>or continue with</span>
                <span className="h-px w-full bg-black/10" />
              </div>

              <motion.button
                whileHover={{ y: -1 }}
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-black/10 bg-[#F6F6F2] px-4 py-3 text-sm font-semibold text-black transition hover:border-black/30"
              >
                <svg
                  aria-hidden
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.6 12.2273c0-.6818-.0614-1.3636-.1705-2.0228H12v3.8273h5.3818a4.608 4.608 0 0 1-2 3.0273v2.5091h3.2364c1.8982-1.7454 2.9823-4.3091 2.9823-7.3409Z"
                    fill="#3F83F8"
                  />
                  <path
                    d="M12 22c2.7 0 4.9727-.8818 6.63-2.4318l-3.2364-2.509c-.9.6136-2.0545.9773-3.3936.9773-2.6091 0-4.8182-1.7455-5.6091-4.0909H3.0455v2.5909C4.7455 19.9 8.1455 22 12 22Z"
                    fill="#34A853"
                  />
                  <path
                    d="M6.3909 13.9455A5.9999 5.9999 0 0 1 6.0727 12c0-.6818.1182-1.3455.3182-1.9455V7.4636H3.0455A9.9662 9.9662 0 0 0 2 12c0 1.6182.3818 3.1545 1.0455 4.5364l3.3454-2.5909Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 6.09091c1.4727 0 2.8.5 3.8455 1.5l2.8637-2.86364C16.9727 2.9 14.7 2 12 2 8.1455 2 4.7455 4.1 3.0455 7.46364l3.3454 2.59096C7.1818 7.83636 9.3909 6.09091 12 6.09091Z"
                    fill="#EA4335"
                  />
                </svg>
                Google Workspace
              </motion.button>

              <p className="text-center text-xs text-black/60">
                SSO enforced. Need access? Ask an admin to invite your workspace.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
