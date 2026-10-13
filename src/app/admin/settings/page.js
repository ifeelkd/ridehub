"use client";

import { useState } from "react";
import { storeConfig } from "@/lib/store-config";
import {
  Save,
  CheckCircle,
  AlertCircle,
  Phone,
  MessageCircle,
  Truck,
  MapPin,
  Megaphone,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({
    phone: storeConfig.contact.phone,
    whatsapp: storeConfig.contact.whatsapp,
    email: storeConfig.contact.email,
    addressLine: storeConfig.contact.address.line1,
    city: storeConfig.contact.address.city,
    state: storeConfig.contact.address.state,
    pin: storeConfig.contact.address.pin,
    defaultShipping: storeConfig.shipping.defaultCharge,
    freeShippingThreshold: storeConfig.shipping.freeThreshold,
    lowStockThreshold: storeConfig.inventory?.lowStockThreshold || 5,
    announcementEnabled: storeConfig.announcement.enabled,
    announcementText: storeConfig.announcement.text,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrorMsg("");

    try {
      const payload = {
        contact: {
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          email: formData.email,
          address: {
            line1: formData.addressLine,
            city: formData.city,
            state: formData.state,
            pin: formData.pin,
          },
        },
        shipping: {
          defaultCharge: Number(formData.defaultShipping),
          freeThreshold: Number(formData.freeShippingThreshold),
        },
        lowStockThreshold: Number(formData.lowStockThreshold),
        announcement: {
          enabled: formData.announcementEnabled,
          text: formData.announcementText,
        },
      };

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to update settings");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setErrorMsg(err.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="heading-display text-2xl sm:text-3xl font-bold text-text-primary">
          Store Settings
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Configure contact numbers, Bongaigaon store address, delivery rates, and announcements.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs flex items-center gap-2">
          <CheckCircle size={16} />
          <span>Settings updated successfully!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Info */}
        <div className="p-6 rounded-2xl border border-border-default bg-bg-primary space-y-4 shadow-sm">
          <h2 className="heading-display text-base font-bold text-text-primary flex items-center gap-2">
            <Phone size={16} className="text-accent" /> Customer Support & Contact
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="phone">
                Helpline Phone Number *
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                required
                value={formData.phone}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label" htmlFor="whatsapp">
                WhatsApp Support Number (without +) *
              </label>
              <input
                id="whatsapp"
                name="whatsapp"
                type="text"
                required
                value={formData.whatsapp}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="label" htmlFor="email">
                Support Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Physical Store Address */}
        <div className="p-6 rounded-2xl border border-border-default bg-bg-primary space-y-4 shadow-sm">
          <h2 className="heading-display text-base font-bold text-text-primary flex items-center gap-2">
            <MapPin size={16} className="text-accent" /> Physical Store Address
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-3">
              <label className="label" htmlFor="addressLine">
                Street / Area Address *
              </label>
              <input
                id="addressLine"
                name="addressLine"
                type="text"
                required
                value={formData.addressLine}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label" htmlFor="city">
                City / Town *
              </label>
              <input
                id="city"
                name="city"
                type="text"
                required
                value={formData.city}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label" htmlFor="state">
                State *
              </label>
              <input
                id="state"
                name="state"
                type="text"
                required
                value={formData.state}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label" htmlFor="pin">
                PIN Code *
              </label>
              <input
                id="pin"
                name="pin"
                type="text"
                required
                value={formData.pin}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Inventory Thresholds */}
        <div className="p-6 rounded-2xl border border-border-default bg-bg-primary space-y-4 shadow-sm">
          <h2 className="heading-display text-base font-bold text-text-primary flex items-center gap-2">
            <Truck size={16} className="text-accent" /> Shipping & Stock Rules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label" htmlFor="defaultShipping">
                Default Delivery Charge (₹)
              </label>
              <input
                id="defaultShipping"
                name="defaultShipping"
                type="number"
                min="0"
                value={formData.defaultShipping}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label" htmlFor="freeShippingThreshold">
                Free Shipping Threshold (₹)
              </label>
              <input
                id="freeShippingThreshold"
                name="freeShippingThreshold"
                type="number"
                min="0"
                value={formData.freeShippingThreshold}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label" htmlFor="lowStockThreshold">
                Low-Stock Alert Level (Units)
              </label>
              <input
                id="lowStockThreshold"
                name="lowStockThreshold"
                type="number"
                min="1"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="p-6 rounded-2xl border border-border-default bg-bg-primary space-y-4 shadow-sm">
          <h2 className="heading-display text-base font-bold text-text-primary flex items-center gap-2">
            <Megaphone size={16} className="text-accent" /> Storefront Announcement Bar
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-xs text-text-primary">
              <input
                type="checkbox"
                name="announcementEnabled"
                checked={formData.announcementEnabled}
                onChange={handleChange}
                className="w-4 h-4 rounded text-accent"
              />
              Enable Top Announcement Banner on Storefront
            </label>

            <div>
              <label className="label" htmlFor="announcementText">
                Announcement Message
              </label>
              <input
                id="announcementText"
                name="announcementText"
                type="text"
                value={formData.announcementText}
                onChange={handleChange}
                className="input"
                placeholder="e.g. Free shipping on orders above ₹2,999 • Cash on Delivery available across India"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary text-xs font-semibold px-6 h-11 flex items-center gap-2 shadow-sm"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save size={15} /> Save All Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
