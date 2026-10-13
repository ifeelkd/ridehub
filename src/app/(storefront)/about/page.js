import Link from "next/link";
import { Shield, MapPin, Award, CheckCircle2, ArrowRight } from "lucide-react";
import { storeConfig } from "@/lib/store-config";

export const metadata = {
  title: "About Us | RideHub Riding Gear Bongaigaon",
  description: "Learn more about RideHub, Bongaigaon's premier multi-brand motorcycle riding gear destination.",
};

export default function AboutPage() {
  return (
    <div className="container-narrow py-10 lg:py-16 space-y-16">
      {/* Hero Section */}
      <div className="max-w-3xl space-y-4">
        <span className="badge badge-accent uppercase tracking-wider text-xs">
          About RideHub
        </span>
        <h1 className="heading-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
          Engineered Protection for Riders Across Northeast India
        </h1>
        <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
          Based in Bongaigaon, Assam, RideHub is an authorized multi-brand retailer dedicated to providing certified motorcycle riding jackets, helmets, gloves, boots, and luggage to riders tackling highways, hills, and everyday commutes.
        </p>
      </div>

      {/* Philosophy Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 rounded-2xl bg-bg-secondary/40 border border-border-default space-y-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <Shield size={22} />
          </div>
          <h3 className="font-semibold text-text-primary text-lg">
            Safety Above Everything
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            We only stock products that meet rigorous global and national safety certifications — ECE 22.06, DOT, and CE Level 1 & 2 armors. No knockoffs, no compromises.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-bg-secondary/40 border border-border-default space-y-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <Award size={22} />
          </div>
          <h3 className="font-semibold text-text-primary text-lg">
            Authorized Multi-Brand Retailer
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Direct partnerships with India&apos;s leading riding gear manufacturers like Rynox, Axor, MT Helmets, Viaterra, and Mototech ensure authentic warranties and genuine spare parts.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-bg-secondary/40 border border-border-default space-y-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <MapPin size={22} />
          </div>
          <h3 className="font-semibold text-text-primary text-lg">
            Local Store, Wide Reach
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Visit our physical storefront on Chapaguri Road in Bongaigaon for personalized sizing consultations, or order online with convenient Cash on Delivery across India.
          </p>
        </div>
      </div>

      {/* Store Details Callout */}
      <div className="p-8 rounded-3xl bg-bg-dark text-text-inverse flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="heading-display text-2xl font-bold">
            Visit Our Bongaigaon Store
          </h3>
          <p className="text-sm text-stone-400 max-w-xl">
            {storeConfig.contact.address.line1}, {storeConfig.contact.address.city}, {storeConfig.contact.address.state} - {storeConfig.contact.address.pin}
          </p>
          <p className="text-xs text-stone-400">
            Open Monday – Saturday: 10:00 AM – 8:30 PM | Sunday: 11:00 AM – 6:00 PM
          </p>
        </div>
        <Link href="/contact" className="btn btn-accent flex-shrink-0">
          Get Store Directions <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
