import { storeConfig } from "@/lib/store-config";

export const metadata = {
  title: "Terms & Privacy Policy | RideHub",
  description: "Terms of service and customer privacy notice for RideHub multi-brand riding gear.",
};

export default function TermsPage() {
  return (
    <div className="container-narrow py-10 lg:py-16 max-w-3xl space-y-8">
      <div>
        <span className="badge badge-accent uppercase tracking-wider text-xs">
          Legal & Privacy
        </span>
        <h1 className="heading-display text-3xl sm:text-4xl font-bold text-text-primary mt-2">
          Terms of Service & Privacy
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Last updated: January 2026
        </p>
      </div>

      <div className="prose prose-stone dark:prose-invert max-w-none text-text-secondary text-sm sm:text-base space-y-6">
        <section className="space-y-3">
          <h2 className="heading-display text-xl font-bold text-text-primary">
            1. Business Entity
          </h2>
          <p>
            RideHub operates as an authorized independent multi-brand retailer of motorcycle protective gear with physical business operations located in Bongaigaon, Assam, India. All brand names, logos, and registered trademarks displayed on this site belong to their respective manufacturers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="heading-display text-xl font-bold text-text-primary">
            2. Customer Privacy
          </h2>
          <p>
            We collect only the essential personal information (Name, Mobile Phone, Delivery Address, PIN code) required to process and dispatch your Cash on Delivery orders. We never sell, rent, or trade your personal information with third-party advertising brokers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="heading-display text-xl font-bold text-text-primary">
            3. Product Pricing & Stock
          </h2>
          <p>
            Prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes. While we maintain real-time physical inventory syncing, in the rare event that an item sells out in our physical storefront concurrently with an online order, we will promptly notify you and suggest an immediate replacement or cancel the order.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="heading-display text-xl font-bold text-text-primary">
            4. Motorcycle Safety & Liability
          </h2>
          <p>
            Motorcycle riding carries inherent risks. While protective gear significantly reduces the risk of injury, no helmet, armor, or jacket can guarantee complete immunity against all impact forces or accidents. Riders must ride responsibly and comply with all applicable traffic laws.
          </p>
        </section>
      </div>
    </div>
  );
}
