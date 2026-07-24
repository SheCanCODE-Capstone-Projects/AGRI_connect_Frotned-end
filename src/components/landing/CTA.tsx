"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";

export default function CTA() {
  const { t } = useLanguage();

  return (
    <section className="relative px-4 pb-12 sm:px-6 lg:px-8 bg-transparent">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl sm:rounded-[2rem]">
        {/* Background Image with Overlay & Subtle Pan Animation */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/products/ct-farm.jpg"
            alt="Farm background"
            fill
            className="object-cover transition-transform duration-[12000ms] ease-out scale-105 hover:scale-115 animate-[pulse_8s_ease-in-out_infinite]"
            priority
          />
          {/* Green Gradient Overlay with Pulsing Glow */}
          <div className="absolute inset-0 bg-green-950/80 bg-gradient-to-t from-[#081f14] via-green-900/70 to-emerald-800/80 mix-blend-multiply" />
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-orange-500/15 blur-3xl animate-pulse" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-white/10 shadow-xl backdrop-blur-md ring-1 ring-white/20 transition-transform duration-500 hover:scale-110 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-300">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </div>

          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl max-w-3xl animate-[fadeInUp_0.8s_ease-out_both]">
            <span className="bg-gradient-to-r from-white via-green-100 to-emerald-200 bg-clip-text text-transparent">
              {t.cta.heading}
            </span>
          </h2>

          <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base leading-7 sm:text-lg sm:leading-8 text-green-100/90 lg:text-xl animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
            {t.cta.description}
          </p>

          <div className="mt-8 flex w-full flex-col items-center gap-4 sm:mt-10 sm:w-auto sm:flex-row sm:justify-center animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
            <Link
              href="/register"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-8 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105 hover:shadow-orange-500/40 active:scale-95 sm:w-auto"
            >
              {t.cta.register}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/about"
              className="flex w-full justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-sm font-semibold text-white shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95 sm:w-auto"
            >
              {t.cta.learnMore}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
