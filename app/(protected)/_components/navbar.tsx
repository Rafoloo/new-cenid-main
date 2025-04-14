"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";

export const Navbar = () => {
  const pathname = usePathname();
  const isProtectedRoute = pathname.startsWith("/protected");

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  if (isProtectedRoute) return null;

  return (
    <nav
      className={`fixed top-0 z-50 w-full bg-gradient-to-r from-teal-600 to-teal-800 text-white shadow-md transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex gap-x-3">
          <Button
            asChild
            variant={pathname === "/dashboard" ? "secondary" : "ghost"}
            className="text-white hover:bg-teal-700 hover:text-white"
          >
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/cadastro" ? "secondary" : "ghost"}
            className="text-white hover:bg-teal-700 hover:text-white"
          >
            <Link href="/cadastro">Cadastro</Link>
          </Button>
        </div>
        <UserButton />
      </div>
    </nav>
  );
};
