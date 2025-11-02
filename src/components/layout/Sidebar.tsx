"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  FileText,
  Home,
  Package,
  Settings,
  BotMessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/jobs", icon: Package, label: "Jobs" },
  { href: "/reports", icon: FileText, label: "Reports" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r fixed h-full z-10">
      <div className="flex items-center h-16 border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-headline text-lg font-semibold">
          <BotMessageSquare className="h-7 w-7 text-primary" />
          <span>MobileTester</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-4">
        <TooltipProvider>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      <Link href={item.href}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </li>
            ))}
          </ul>
        </TooltipProvider>
      </nav>
      <div className="mt-auto p-4 border-t">
        {/* Placeholder for future use, e.g., quick access actions */}
      </div>
    </aside>
  );
}
