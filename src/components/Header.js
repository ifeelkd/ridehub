"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  ChevronDown,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";
import { storeConfig } from "@/lib/store-config";
import { useCart } from "@/context/cart-context";
import CartDrawer from "./CartDrawer";

const navCategories = storeConfig.defaultCategories;
const navBrands = storeConfig.defaultBrands;

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [megaMenu, setMegaMenu] = useState(null);
  const searchInputRef = useRef(null);
  const pathname = usePathname();
  const { itemCount } = useCart();

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setMegaMenu(null);
  }, [pathname]);

  // Sticky header detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      {storeConfig.announcement.enabled && (
        <div className="bg-bg-dark text-text-inverse text-center py-2 px-4 text-xs tracking-wide font-medium">
          <p>{storeConfig.announcement.text}</p>
        </div>
      )}

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-shadow duration-200 ${
          scrolled ? "shadow-md" : "border-b border-border"
        }`}
      >
        <div className="container-narrow">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="btn-icon btn-ghost lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-text-primary no-underline"
            >
              <span className="heading-display text-xl lg:text-2xl tracking-wider">
                {storeConfig.logoText}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 ml-8" aria-label="Main navigation">
              <Link
                href="/products"
                className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors rounded-md hover:bg-bg-secondary"
              >
                All Products
              </Link>

              {/* Categories Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setMegaMenu("categories")}
                onMouseLeave={() => setMegaMenu(null)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors rounded-md hover:bg-bg-secondary">
                  Categories
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      megaMenu === "categories" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {megaMenu === "categories" && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-bg-card rounded-lg shadow-xl border border-border py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {navCategories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/products?category=${cat.slug}`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Brands Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setMegaMenu("brands")}
                onMouseLeave={() => setMegaMenu(null)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors rounded-md hover:bg-bg-secondary">
                  Brands
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      megaMenu === "brands" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {megaMenu === "brands" && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-bg-card rounded-lg shadow-xl border border-border py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {navBrands.map((brand) => (
                      <Link
                        key={brand}
                        href={`/products?brand=${encodeURIComponent(brand)}`}
                        className="block px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                      >
                        {brand}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/about"
                className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors rounded-md hover:bg-bg-secondary"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors rounded-md hover:bg-bg-secondary"
              >
                Contact
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search Toggle Pill */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-200/80 transition-colors shadow-xs"
                aria-label="Search products"
              >
                <Search size={14} className="text-stone-500" />
                <span>Search</span>
              </button>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="btn-icon btn-ghost relative"
                aria-label={`Cart (${itemCount} items)`}
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="pb-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search helmets, jackets, gloves..."
                  className="input pr-10 text-stone-900"
                  style={{ paddingLeft: "2.75rem" }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  aria-label="Close search"
                >
                  <X size={18} />
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200 z-[100]"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white text-stone-900 shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col z-[101]">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-white">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="heading-display text-lg tracking-wider text-stone-900 no-underline"
              >
                {storeConfig.logoText}
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="btn-icon btn-ghost"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Drawer Content */}
            <nav className="flex-1 overflow-y-auto py-4" aria-label="Mobile navigation">
              <Link
                href="/products"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-6 py-3 text-base font-medium text-text-primary hover:bg-bg-secondary transition-colors"
              >
                All Products
                <ArrowRight size={16} className="text-text-tertiary" />
              </Link>

              <div className="px-6 pt-4 pb-2">
                <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                  Categories
                </p>
              </div>
              {navCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="block px-6 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                >
                  {cat.name}
                </Link>
              ))}

              <div className="px-6 pt-4 pb-2">
                <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                  Brands
                </p>
              </div>
              {navBrands.map((brand) => (
                <Link
                  key={brand}
                  href={`/products?brand=${encodeURIComponent(brand)}`}
                  onClick={() => setMobileOpen(false)}
                  className="block px-6 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                >
                  {brand}
                </Link>
              ))}

              <div className="border-t border-border mt-4 pt-4">
                <Link
                  href="/about"
                  onClick={() => setMobileOpen(false)}
                  className="block px-6 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="block px-6 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                >
                  Contact
                </Link>
                <Link
                  href="/shipping"
                  onClick={() => setMobileOpen(false)}
                  className="block px-6 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                >
                  Shipping & Returns
                </Link>
              </div>
            </nav>

            {/* Drawer Footer */}
            <div className="border-t border-border p-4 space-y-2">
              {storeConfig.contact.phone && (
                <a
                  href={`tel:${storeConfig.contact.phone.replace(/\s/g, "")}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 text-sm text-text-secondary hover:text-text-primary"
                >
                  <Phone size={16} />
                  {storeConfig.contact.phone}
                </a>
              )}
              {storeConfig.contact.email && (
                <a
                  href={`mailto:${storeConfig.contact.email}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 text-sm text-text-secondary hover:text-text-primary"
                >
                  <Mail size={16} />
                  {storeConfig.contact.email}
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
