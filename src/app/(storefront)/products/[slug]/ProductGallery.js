"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

export default function ProductGallery({ images = [], productName = "Product", hasDiscount = false, discountPercent = 0, isNew = false }) {
  const displayImages = images.length > 0
    ? images
    : [{ id: "ph1", url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80", alt_text: productName }];

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeImage = displayImages[activeIndex] || displayImages[0];

  const handlePrev = (e) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-4">
      {/* Main Image Viewport */}
      <div 
        className="relative aspect-product bg-bg-secondary rounded-2xl overflow-hidden border border-border-default group cursor-pointer"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={activeImage.url}
          alt={activeImage.alt_text || productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
          {hasDiscount && (
            <span className="badge badge-accent shadow-sm">
              SAVE {discountPercent}%
            </span>
          )}
          {isNew && (
            <span className="badge bg-stone-900 text-white border border-stone-700 shadow-sm">
              NEW ARRIVAL
            </span>
          )}
        </div>

        {/* Zoom Hint */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLightboxOpen(true);
          }}
          className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-bg-primary/80 backdrop-blur-md text-text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm border border-border-default"
          aria-label="Enlarge image"
        >
          <Maximize2 size={16} />
        </button>

        {/* Mobile / Arrow Controls */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-bg-primary/80 backdrop-blur-md text-text-primary flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity border border-border-default"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-bg-primary/80 backdrop-blur-md text-text-primary flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity border border-border-default"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {displayImages.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-20 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                activeIndex === idx
                  ? "border-accent ring-2 ring-accent/20 scale-[1.02]"
                  : "border-border-default hover:border-text-secondary opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt_text || `${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-stone-900/60"
            aria-label="Close fullscreen view"
          >
            <X size={24} />
          </button>
          <div
            className="relative max-w-4xl max-h-[85vh] w-full h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage.url}
              alt={activeImage.alt_text || productName}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
