import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { storeConfig } from "@/lib/store-config";

export const metadata = {
  title: "Contact Us | RideHub Riding Gear Bongaigaon",
  description: "Get in touch with RideHub riding gear store in Bongaigaon, Assam. Phone, WhatsApp, email and location details.",
};

export default function ContactPage() {
  return (
    <div className="container-narrow py-10 lg:py-16 space-y-12">
      <div className="max-w-2xl space-y-3">
        <span className="badge badge-accent uppercase tracking-wider text-xs">
          Get In Touch
        </span>
        <h1 className="heading-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
          Contact RideHub
        </h1>
        <p className="text-text-secondary text-base leading-relaxed">
          Have questions regarding gear sizing, stock availability, or order delivery? We are here to help you gear up right.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Phone */}
        <div className="p-6 rounded-2xl bg-bg-secondary/40 border border-border-default space-y-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <Phone size={20} />
          </div>
          <h3 className="font-semibold text-text-primary text-base">Call Us</h3>
          <p className="text-xs text-text-secondary">Direct customer helpline during store hours</p>
          <a
            href={`tel:${storeConfig.contact.phone}`}
            className="text-sm font-bold text-accent hover:underline block"
          >
            {storeConfig.contact.phone}
          </a>
        </div>

        {/* WhatsApp */}
        <div className="p-6 rounded-2xl bg-bg-secondary/40 border border-border-default space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <MessageCircle size={20} />
          </div>
          <h3 className="font-semibold text-text-primary text-base">WhatsApp Support</h3>
          <p className="text-xs text-text-secondary">Send photos for size recommendations & inquiries</p>
          <a
            href={`https://wa.me/${storeConfig.contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-emerald-600 hover:underline block"
          >
            +{storeConfig.contact.whatsapp}
          </a>
        </div>

        {/* Email */}
        <div className="p-6 rounded-2xl bg-bg-secondary/40 border border-border-default space-y-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <Mail size={20} />
          </div>
          <h3 className="font-semibold text-text-primary text-base">Email Us</h3>
          <p className="text-xs text-text-secondary">General queries, warranties & bulk orders</p>
          <a
            href={`mailto:${storeConfig.contact.email}`}
            className="text-sm font-bold text-accent hover:underline block truncate"
          >
            {storeConfig.contact.email}
          </a>
        </div>
      </div>

      {/* Store Location & Hours Box */}
      <div className="p-8 rounded-3xl border border-border-default bg-bg-primary grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-accent font-semibold text-sm">
            <MapPin size={18} /> Physical Store Address
          </div>
          <h3 className="heading-display text-2xl font-bold text-text-primary">
            RideHub Riding Gear Store
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            {storeConfig.contact.address.line1}<br />
            {storeConfig.contact.address.line2}<br />
            {storeConfig.contact.address.city}, {storeConfig.contact.address.state} — {storeConfig.contact.address.pin}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-accent font-semibold text-sm">
            <Clock size={18} /> Store Working Hours
          </div>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex justify-between border-b border-border-default pb-2">
              <span>Monday – Saturday:</span>
              <strong className="text-text-primary">10:00 AM – 8:30 PM</strong>
            </li>
            <li className="flex justify-between border-b border-border-default pb-2">
              <span>Sunday:</span>
              <strong className="text-text-primary">11:00 AM – 6:00 PM</strong>
            </li>
            <li className="flex justify-between">
              <span>Online Orders:</span>
              <strong className="text-emerald-600">Open 24/7</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
