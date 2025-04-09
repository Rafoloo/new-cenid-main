"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserButton } from "@/components/auth/user-button";
import {
  UserPlus,
  LayoutDashboard,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface SidebarProps {
  className?: string;
  onCollapseChange: (collapsed: boolean) => void;
}

export function Sidebar({ className, onCollapseChange }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);
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
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleCollapse = () => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      onCollapseChange(newState);
      return newState;
    });
  };

  return (
    <div
      className={cn(
        "bg-gradient-to-b from-blue-800 to-blue-950 text-white font-sans h-screen flex flex-col shadow-lg transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-72",
        isVisible ? "translate-x-0" : "-translate-x-full",
        "fixed top-0 left-0 z-50",
        className
      )}
    >
      {/* Topo */}
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        {!isCollapsed && (
          <h2 className="text-2xl font-bold tracking-tight text-white">Sistema</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCollapse}
          className="text-white hover:bg-white/10 rounded-full transition-all"
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* Itens */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {/* Dashboard primeiro */}
          <Button
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start text-white hover:bg-white/10 hover:text-white transition-colors",
              isCollapsed && "justify-center px-0",
              pathname === "/dashboard" && "bg-white/10 font-semibold"
            )}
          >
            <Link href="/dashboard" className="flex items-center space-x-3">
              <LayoutDashboard className="h-5 w-5" />
              {!isCollapsed && <span className="text-base">Dashboard</span>}
            </Link>
          </Button>

          {/* Cadastro */}
          <Button
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start text-white hover:bg-white/10 hover:text-white transition-colors",
              isCollapsed && "justify-center px-0",
              pathname === "/cadastro" && "bg-white/10 font-semibold"
            )}
          >
            <Link href="/cadastro" className="flex items-center space-x-3">
              <UserPlus className="h-5 w-5" />
              {!isCollapsed && <span className="text-base">Cadastro</span>}
            </Link>
          </Button>
        </nav>
      </ScrollArea>

      {/* Rodapé */}
      <div className="p-4 border-t border-white/10 bg-white/5">
        <div className={cn("flex justify-center", !isCollapsed && "justify-start")}>
          <UserButton />
        </div>
      </div>
    </div>
  );
}
