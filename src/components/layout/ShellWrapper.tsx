"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const COOPERATIVE_ROUTES = [
  "/dashboard",
  "/inventory",
  "/orders",
  "/buyers",
  "/members",
  "/reports",
  "/cooperative",
  "/settings",
  "/login",
  "/register",
  "/forgot-password",
  "/admin",
];

export default function ShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide public Navbar & Footer inside the cooperative app shell
  const isCooperative = COOPERATIVE_ROUTES.some((route) =>
    pathname?.startsWith(route)
  );

  if (isCooperative) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div className="flex-1 pt-16">{children}</div>
      <Footer />
    </>
  );
}
