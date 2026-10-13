import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  ArrowUp,
} from "lucide-react";
import { storeConfig } from "@/lib/store-config";

function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
    </svg>
  );
}

const { contact, social, name, defaultCategories } = storeConfig;

export default function Footer() {
  return (
    <footer className="bg-bg-dark text-text-inverse mt-auto">
      {/* Main Footer */}
      <div className="container-narrow py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-3 no-underline">
              <span className="heading-display text-xl sm:text-2xl tracking-wider text-text-inverse">
                {storeConfig.logoText}
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed mb-3 max-w-xs">
              {storeConfig.description}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2.5 mt-3">
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-accent flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {social.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-accent flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {social.youtube && (
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-accent flex items-center justify-center transition-colors"
                  aria-label="YouTube"
                >
                  <YoutubeIcon className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="col-span-1">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-300 mb-2.5">
              Categories
            </h3>
            <ul className="space-y-1.5">
              {defaultCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="text-xs sm:text-sm text-stone-400 hover:text-white transition-colors no-underline block py-0.5"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-300 mb-2.5">
              Information
            </h3>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/about"
                  className="text-xs sm:text-sm text-stone-400 hover:text-white transition-colors no-underline block py-0.5"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-xs sm:text-sm text-stone-400 hover:text-white transition-colors no-underline block py-0.5"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-xs sm:text-sm text-stone-400 hover:text-white transition-colors no-underline block py-0.5"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-xs sm:text-sm text-stone-400 hover:text-white transition-colors no-underline block py-0.5"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-xs sm:text-sm text-stone-400 hover:text-white transition-colors no-underline block py-0.5"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-300 mb-2.5">
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-xs sm:text-sm text-stone-400 hover:text-white transition-colors no-underline"
                >
                  <Phone size={14} className="flex-shrink-0" />
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 text-xs sm:text-sm text-stone-400 hover:text-white transition-colors no-underline"
                >
                  <Mail size={14} className="flex-shrink-0" />
                  {contact.email}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-xs sm:text-sm text-stone-400">
                  <MapPin size={14} className="flex-shrink-0 mt-0.5" />
                  <span>
                    {contact.address.line1}
                    {contact.address.line2 && `, ${contact.address.line2}`}
                    <br />
                    {contact.address.city}, {contact.address.state} — {contact.address.pinCode}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800">
        <div className="container-narrow py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-stone-500">
            © 2026 {name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-stone-500">
            <span>Cash on Delivery Available</span>
            <span>•</span>
            <span>Ships Across India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
