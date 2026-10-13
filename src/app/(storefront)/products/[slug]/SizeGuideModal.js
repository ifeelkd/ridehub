"use client";

import { X, Ruler, HelpCircle } from "lucide-react";

const sizeGuides = {
  helmets: {
    title: "Helmet Size Guide",
    instruction: "Wrap a flexible measuring tape around your head approximately 2.5 cm (1 inch) above your eyebrows and ears, across the widest part of your skull.",
    table: [
      { size: "XS", cm: "53 - 54 cm", inches: "20.8 - 21.2 in" },
      { size: "S", cm: "55 - 56 cm", inches: "21.6 - 22.0 in" },
      { size: "M", cm: "57 - 58 cm", inches: "22.4 - 22.8 in" },
      { size: "L", cm: "59 - 60 cm", inches: "23.2 - 23.6 in" },
      { size: "XL", cm: "61 - 62 cm", inches: "24.0 - 24.4 in" },
      { size: "XXL", cm: "63 - 64 cm", inches: "24.8 - 25.2 in" },
    ],
    tips: [
      "A new helmet should fit snugly against your cheeks and skull without causing painful pressure points.",
      "Cheek pads break in and loosen by approximately 10-15% after 15-20 hours of riding.",
      "If you fall between two sizes, choose the smaller size for optimal impact safety."
    ]
  },
  jackets: {
    title: "Riding Jacket Size Guide",
    instruction: "Measure your chest at the fullest point keeping the tape parallel to the floor. For waist, measure around your natural waistline.",
    table: [
      { size: "S", chest: "36 - 38 in (91-96 cm)", waist: "30 - 32 in", height: "5'4\" - 5'7\"" },
      { size: "M", chest: "38 - 40 in (96-101 cm)", waist: "32 - 34 in", height: "5'7\" - 5'10\"" },
      { size: "L", chest: "40 - 42 in (101-106 cm)", waist: "34 - 36 in", height: "5'9\" - 6'0\"" },
      { size: "XL", chest: "42 - 44 in (106-111 cm)", waist: "36 - 38 in", height: "5'11\" - 6'2\"" },
      { size: "XXL", chest: "44 - 46 in (111-116 cm)", waist: "38 - 40 in", height: "6'0\" - 6'4\"" },
    ],
    tips: [
      "Ensure armor cups align precisely with the apex of your shoulders and elbows in riding posture.",
      "Account for wearing a light thermal underlayer during winter rides.",
      "Touring jackets should cover your lower back when leaning forward on handlebars."
    ]
  },
  gloves: {
    title: "Riding Gloves Size Guide",
    instruction: "Measure the circumference of your dominant hand across the widest part of your palm, excluding your thumb.",
    table: [
      { size: "S", cm: "18 - 19 cm", inches: "7.0 - 7.5 in" },
      { size: "M", cm: "20 - 21 cm", inches: "7.8 - 8.2 in" },
      { size: "L", cm: "22 - 23 cm", inches: "8.6 - 9.0 in" },
      { size: "XL", cm: "24 - 25 cm", inches: "9.4 - 9.8 in" },
      { size: "XXL", cm: "26 - 27 cm", inches: "10.2 - 10.6 in" },
    ],
    tips: [
      "Fingertips should have roughly 2-3 mm clearance when gripping throttle/clutch.",
      "Leather gloves stretch slightly across width with natural hand heat and sweat."
    ]
  },
  pants: {
    title: "Riding Pants Size Guide",
    instruction: "Measure around your natural waistline where you normally wear riding trousers.",
    table: [
      { size: "S", waist: "28 - 30 in (71-76 cm)", inseam: "30 in" },
      { size: "M", waist: "30 - 32 in (76-81 cm)", inseam: "31 in" },
      { size: "L", waist: "32 - 34 in (81-86 cm)", inseam: "32 in" },
      { size: "XL", waist: "34 - 36 in (86-91 cm)", inseam: "32.5 in" },
      { size: "XXL", waist: "36 - 38 in (91-96 cm)", inseam: "33 in" },
    ],
    tips: [
      "Knee armors should rest right over your kneecaps when your knees are bent at riding angle.",
      "Most adventure pants feature adjustable side waist tabs to adjust tension."
    ]
  },
  boots: {
    title: "Riding Boots Size Guide",
    instruction: "Stand upright on a sheet of paper with riding socks on, trace both feet, and measure from heel to longest toe.",
    table: [
      { size: "UK 7 / EU 41", footLength: "26.0 cm", us: "US 8" },
      { size: "UK 8 / EU 42", footLength: "26.7 cm", us: "US 9" },
      { size: "UK 9 / EU 43", footLength: "27.3 cm", us: "US 10" },
      { size: "UK 10 / EU 44", footLength: "28.0 cm", us: "US 11" },
      { size: "UK 11 / EU 45", footLength: "28.7 cm", us: "US 12" },
    ],
    tips: [
      "Motorcycle boots should hold your heel firmly in place without slipping during gear shifting.",
      "Always wear the thickness of socks you normally wear on motorcycle rides."
    ]
  }
};

export default function SizeGuideModal({ categorySlug, isOpen, onClose }) {
  if (!isOpen) return null;

  const key = Object.keys(sizeGuides).find(k => categorySlug?.toLowerCase().includes(k)) || "helmets";
  const guide = sizeGuides[key];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-bg-primary rounded-2xl shadow-2xl border border-border-default overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default bg-bg-secondary/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
              <Ruler size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary text-base">{guide.title}</h3>
              <p className="text-xs text-text-secondary">Official sizing specifications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-bg-secondary text-text-secondary hover:text-text-primary flex items-center justify-center transition-colors"
            aria-label="Close size guide"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="bg-bg-secondary/60 rounded-xl p-4 text-xs sm:text-sm text-text-secondary leading-relaxed border border-border-default">
            <span className="font-semibold text-text-primary block mb-1">How to Measure:</span>
            {guide.instruction}
          </div>

          {/* Sizing Table */}
          <div className="overflow-x-auto rounded-xl border border-border-default">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg-secondary text-xs uppercase tracking-wider text-text-secondary">
                <tr>
                  {Object.keys(guide.table[0]).map((col) => (
                    <th key={col} className="px-4 py-3 font-semibold capitalize">
                      {col === "cm" ? "Head Circumference (cm)" : col === "inches" ? "Inches" : col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {guide.table.map((row, idx) => (
                  <tr key={idx} className="hover:bg-bg-secondary/30 transition-colors">
                    {Object.values(row).map((val, vIdx) => (
                      <td key={vIdx} className={`px-4 py-3 ${vIdx === 0 ? "font-semibold text-text-primary" : "text-text-secondary"}`}>
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expert Tips */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
              <HelpCircle size={14} className="text-accent" /> Expert Fitting Advice
            </h4>
            <ul className="space-y-1.5 text-xs text-text-secondary">
              {guide.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-border-default bg-bg-secondary/30 flex items-center justify-between text-xs text-text-secondary">
          <span>Need custom assistance? Contact our store team in Bongaigaon.</span>
          <button onClick={onClose} className="btn btn-sm btn-primary">
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
