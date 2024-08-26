"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") {
    } else {
      router.push("/admin");
    }
  });
  return <main></main>;
}
