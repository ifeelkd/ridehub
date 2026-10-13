"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  BarChart2,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { storeConfig } from "@/lib/store-config";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: Package },
  { name: "Products", href: "/admin/products", icon: Layers },
  { name: "Inventory", href: "/admin/inventory", icon: BarChart2 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on login page, don't show admin chrome
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 flex flex-col md:flex-row text-stone-900">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-stone-200 px-5 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <Link href="/admin" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            RH
          </div>
          <span className="heading-display text-lg font-bold text-stone-900 tracking-wide">
            RideHub Admin
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="p-2 text-stone-500 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors"
            aria-label="View storefront"
          >
            <ExternalLink size={18} />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-500 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-72 bg-white h-full p-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="heading-display text-lg font-bold text-stone-900 tracking-wide">
                  Store Manager
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-stone-400 hover:text-stone-600 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        isActive
                          ? "bg-orange-600 text-white shadow-sm"
                          : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-5 border-t border-stone-200 space-y-2">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors"
              >
                <ExternalLink size={15} /> View Live Storefront
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
              >
                <LogOut size={15} /> Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-stone-200/90 p-6 sticky top-0 h-screen justify-between flex-shrink-0 shadow-sm">
        <div className="space-y-8">
          {/* Brand */}
          <Link href="/admin" className="flex items-center gap-3 no-underline">
            <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              RH
            </div>
            <div>
              <span className="heading-display text-xl font-bold text-stone-900 block leading-none tracking-wide">
                RideHub
              </span>
              <span className="text-[10px] text-stone-500 uppercase tracking-widest font-bold mt-1 block">
                Shop Manager
              </span>
            </div>
          </Link>

          {/* Nav */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-orange-600 text-white shadow-sm"
                      : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="space-y-2 pt-6 border-t border-stone-200">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} /> Open Storefront
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}
