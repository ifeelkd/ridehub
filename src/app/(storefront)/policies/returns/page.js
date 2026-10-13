import { storeConfig } from "@/lib/store-config";
import { RotateCcw, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Returns & Exchanges Policy | RideHub",
  description: "7-Day size exchange and return policy for motorcycle riding gear purchased at RideHub.",
};

export default function ReturnsPolicyPage() {
  return (
    <div className="container-narrow py-10 lg:py-16 max-w-3xl space-y-8">
      <div>
        <span className="badge badge-accent uppercase tracking-wider text-xs">
          Store Policies
        </span>
        <h1 className="heading-display text-3xl sm:text-4xl font-bold text-text-primary mt-2">
          Returns & 7-Day Size Exchange
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Last updated: January 2026
        </p>
      </div>

      <div className="prose prose-stone dark:prose-invert max-w-none text-text-secondary text-sm sm:text-base space-y-6">
        <section className="space-y-3">
          <h2 className="heading-display text-xl font-bold text-text-primary">
            1. 7-Day Size Exchange Guarantee
          </h2>
          <p>
            Riding safety depends on a proper, snug fit. If your helmet, jacket, pants, gloves, or boots feel too tight or loose, we offer a <strong>7-Day Size Exchange</strong> from the date of parcel delivery.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="heading-display text-xl font-bold text-text-primary">
            2. Exchange Conditions
          </h2>
          <p>To be eligible for an exchange:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Gear must be <strong>unworn on rides</strong>, clean, odorless, and completely free of road debris, dust, or scratches.</li>
            <li>All original brand tags, visor protective films, and warranty cards must remain attached and intact.</li>
            <li>Original packaging box (e.g. helmet box, boot box) must be retained and not taped over directly.</li>
            <li>Proof of purchase (invoice or order reference number) must be provided.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="heading-display text-xl font-bold text-text-primary">
            3. Non-Returnable Items
          </h2>
          <p>
            For hygiene and safety reasons, balaclavas, base layers, thermal inner-wear, socks, and earplugs cannot be returned or exchanged once opened.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="heading-display text-xl font-bold text-text-primary">
            4. How to Initiate an Exchange
          </h2>
          <p>
            Simply send a WhatsApp message to our Bongaigaon store support team at <strong>+{storeConfig.contact.whatsapp}</strong> with your Order Number and photos of the gear. We will confirm the replacement size availability and guide you through the reverse pickup process.
          </p>
        </section>
      </div>
    </div>
  );
}
