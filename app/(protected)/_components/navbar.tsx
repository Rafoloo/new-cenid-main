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
        // Rolando para baixo
        setIsVisible(false);
      } else {
        // Rolando para cima
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
      className={`fixed top-0 w-full bg-secondary flex justify-between items-center p-4 shadow-sm transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex gap-x-2">
        <Button
          asChild
          variant={pathname === "/cadastro" ? "default" : "outline"}
        >
          <Link href="/cadastro">Cadastro</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/settings" ? "default" : "outline"}
        >
          <Link href="/settings">Configurações</Link>
        </Button>
      </div>
      <UserButton />
    </nav>
  );
};