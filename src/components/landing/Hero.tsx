"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const HERO_IMAGES = [
  {
    src: "/images/hero-bg.png",
    alt: "Lush green agricultural field in Rwanda",
  },
  {
    src: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2000&auto=format&fit=crop",
    alt: "Lush terraced agricultural farm and tea plantation hills",
  },
];

export default function Hero() {
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000); // Switch image every 6 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* ── Background images with animated crossfade & Terra-style Ken Burns pan ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {HERO_IMAGES.map((img, index) => {
          const isActive = index === currentImageIndex;
          return (
            <div
              key={img.src}
              className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className={`object-cover transition-all duration-[6500ms] ease-linear ${
                  isActive
                    ? index % 2 === 0
                      ? "scale-115 translate-x-2 -translate-y-2"
                      : "scale-115 -translate-x-2 translate-y-2"
                    : "scale-100 translate-x-0 translate-y-0"
                }`}
                priority={index === 0}
                quality={90}
              />
            </div>
          );
        })}

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 z-10" />

        {/* Terra-style Slide Progress & Navigation */}
        <div className="absolute bottom-8 right-8 z-20 flex items-center gap-3">
          {HERO_IMAGES.map((_, index) => {
            const isActive = index === currentImageIndex;
            return (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className="relative h-1.5 w-12 overflow-hidden rounded-full bg-white/30 transition-all duration-300 hover:bg-white/50"
              >
                {isActive && (
                  <div className="h-full bg-brand-500 animate-[progress_6s_linear_forwards]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-32 pb-24 lg:px-8">
        {/* Badge */}
        <div className="mb-8 animate-[fadeInUp_0.6s_ease-out_both]">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/15 px-5 py-2.5 text-sm font-medium text-accent-400 backdrop-blur-sm">
            <span className="text-base"></span>
            {t.hero.badge}
          </span>
        </div>

        <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-[5.25rem] animate-[fadeInUp_0.8s_ease-out_0.15s_both]">
          <span className="text-white">{t.hero.headline1}</span>
          <br />
          <span className="text-brand-500">{t.hero.headline2}</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg md:text-xl animate-[fadeInUp_0.8s_ease-out_0.3s_both]">
          {t.hero.description}
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row animate-[fadeInUp_0.8s_ease-out_0.45s_both]">
          <Link
            href="/products"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-brand-600/25 transition-all duration-300 hover:bg-brand-500 hover:shadow-xl hover:shadow-brand-500/30 active:scale-[0.98]"
          >
            {t.hero.exploreProducts}
            <svg
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl border-2 border-brand-500/50 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-brand-500 hover:bg-brand-500/10 active:scale-[0.98]"
          >
            {t.hero.joinCooperative}
          </Link>
        </div>
      </div>
    </section>
  );
}
