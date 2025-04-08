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

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
        "bg-gradient-to-b from-teal-900 to-teal-800 text-white h-screen flex flex-col shadow-lg transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-72",
        isVisible ? "translate-x-0" : "-translate-x-full",
        "fixed top-0 left-0 z-50",
        className
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-teal-700/50">
        {!isCollapsed && (
          <h2 className="text-2xl font-bold tracking-tight text-teal-100">Sistema</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCollapse}
          className="text-teal-200 hover:bg-teal-700/50 hover:text-white rounded-full"
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          <Button
            asChild
            variant={pathname === "/cadastro" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start text-teal-100 hover:bg-teal-700/50 hover:text-white",
              isCollapsed && "justify-center px-0",
              pathname === "/cadastro" && "bg-teal-700 text-white"
            )}
          >
            <Link href="/cadastro" className="flex items-center space-x-3">
              <UserPlus className="h-5 w-5" />
              {!isCollapsed && <span className="text-base font-medium">Cadastro</span>}
            </Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/dashboard" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start text-teal-100 hover:bg-teal-700/50 hover:text-white",
              isCollapsed && "justify-center px-0",
              pathname === "/dashboard" && "bg-teal-700 text-white"
            )}
          >
            <Link href="/dashboard" className="flex items-center space-x-3">
              <LayoutDashboard className="h-5 w-5" />
              {!isCollapsed && <span className="text-base font-medium">Dashboard</span>}
            </Link>
          </Button>
        </nav>
      </ScrollArea>
      <div className="p-4 border-t border-teal-700/50 bg-teal-900/50">
        <div className={cn("flex justify-center", !isCollapsed && "justify-start")}>
          <UserButton />
        </div>
      </div>
    </div>
  );
}