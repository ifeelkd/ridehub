import { formatPrice, storeConfig } from "@/lib/store-config";
import { Truck, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Shipping & Delivery Policy | RideHub",
  description: "Shipping timelines, Cash on Delivery details, and delivery charges for RideHub riding gear.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="container-narrow py-10 lg:py-16 max-w-3xl space-y-8">
      <div>
        <span className="badge badge-accent uppercase tracking-wider text-xs">
          Store Policies
        </span>
        <h1 className="heading-display text-3xl sm:text-4xl font-bold text-text-primary mt-2">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Last updated: January 2026
        </p>
      </div>

      <div className="prose prose-stone dark:prose-invert max-w-none text-text-secondary text-sm sm:text-base space-y-6">
        <section className="space-y-3">
          <h2 className="heading-display text-xl font-bold text-text-primary">
            1. Dispatch & Processing Time
          </h2>
          <p>
            All confirmed Cash on Delivery orders are inspected, securely packed, and dispatched from our physical retail store located in <strong>Bongaigaon, Assam</strong> within <strong>24 to 48 hours</strong> (excluding national holidays and Sundays).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="heading-display text-xl font-bold text-text-primary">
            2. Estimated Delivery Timelines
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Assam & Northeast India:</strong> 3 – 5 business days.</li>
            <li><strong>Rest of India (Metro & Major Cities):</strong> 5 – 7 business days.</li>
            <li><strong>Remote or Rural Pincodes:</strong> 7 – 10 business days.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="heading-display text-xl font-bold text-text-primary">
            3. Shipping Charges
          </h2>
          <p>
            We offer <strong>Free Standard Shipping</strong> on all domestic orders totaling <strong>{formatPrice(storeConfig.shipping?.freeThreshold || 2999)} or more</strong>. For orders below this threshold, a flat delivery fee of <strong>{formatPrice(storeConfig.shipping?.defaultCharge || 99)}</strong> applies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="heading-display text-xl font-bold text-text-primary">
            4. Cash on Delivery (COD) Guidelines
          </h2>
          <p>
            Cash on Delivery is available across serviceable PIN codes in India. Upon dispatch, you may receive an SMS or WhatsApp notification. Please ensure you or an authorized recipient is available at the delivery location with exact cash or a mobile payment app (UPI) to ensure prompt handover.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="heading-display text-xl font-bold text-text-primary">
            5. Parcel Inspection & Damage Policy
          </h2>
          <p>
            If the outer parcel shows severe physical damage, tampering, or open seals upon arrival from the courier, please refuse delivery and immediately contact our support hotline at <strong>{storeConfig.contact.phone}</strong> or on WhatsApp.
          </p>
        </section>
      </div>
    </div>
  );
}
