

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Home from "./home";

const Page = () => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("mockUser");
    if (!stored) {
      router.replace("/login");
      return;
    }
    setAuthorized(true);
  }, [router]);

  if (authorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
          <p className="text-sm text-white/70">Verifying access…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Home />
    </div>
  );
};

export default Page;
