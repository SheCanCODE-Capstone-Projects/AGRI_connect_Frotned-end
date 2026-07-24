"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { getCurrentAccount, Account } from "@/lib/auth";

export default function SettingsPage() {
  const { locale, t, toggleLocale } = useLanguage();
  const [account, setAccount] = useState<Account | null>(null);
  const [saved, setSaved] = useState(false);

  const [coopName, setCoopName] = useState("Green Valley Coop");
  const [location, setLocation] = useState("Musanze District");
  const [email, setEmail] = useState("contact@greenvalley.rw");
  const [phone, setPhone] = useState("+250 788 123 456");
  const [currency, setCurrency] = useState("RWF");

  useEffect(() => {
    const acc = getCurrentAccount();
    setAccount(acc);
    if (acc) {
      setCoopName(acc.cooperativeName);
      setEmail(acc.email);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-5">

      {/* ── Page header — same style as every other page ── */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs text-gray-400 dark:text-green-100/50">
            {t.settings.subtitle}
          </p>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            {t.settings.title}
          </h1>
        </div>
      </div>

      {/* ── Success notice ── */}
      {saved && (
        <div className="rounded-xl border border-green-100 bg-green-50/80 px-4 py-3 text-sm text-green-900 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-100">
          {t.settings.successMessage}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">

        {/* ── Cooperative Profile ── */}
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-[#112d1a] dark:ring-white/10">
          <h2 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white">
            {t.settings.profileSection}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-green-100/50">
                {t.settings.coopName}
              </label>
              <input
                type="text"
                value={coopName}
                onChange={(e) => setCoopName(e.target.value)}
                placeholder={t.settings.coopNamePlaceholder}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-white/10 dark:bg-black/20 dark:text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-green-100/50">
                {t.settings.location}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t.settings.locationPlaceholder}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-white/10 dark:bg-black/20 dark:text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-green-100/50">
                {t.settings.contactEmail}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-white/10 dark:bg-black/20 dark:text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-green-100/50">
                {t.settings.contactPhone}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-white/10 dark:bg-black/20 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* ── Preferences ── */}
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-[#112d1a] dark:ring-white/10">
          <h2 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white">
            {t.settings.preferencesSection}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">

            {/* Language */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-green-100/50">
                {t.settings.language}
              </p>
              <p className="text-xs text-gray-400 dark:text-green-100/40">
                {t.settings.languageDesc}
              </p>
              <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-black/20">
                <button
                  type="button"
                  onClick={() => { if (locale !== "en") toggleLocale(); }}
                  className={`flex-1 rounded-md py-2 text-xs font-semibold transition-all ${
                    locale === "en"
                      ? "bg-white text-gray-900 shadow dark:bg-green-600 dark:text-white"
                      : "text-gray-500 hover:text-gray-700 dark:text-green-100/50"
                  }`}
                >
                  🇬🇧 {t.settings.english}
                </button>
                <button
                  type="button"
                  onClick={() => { if (locale !== "rw") toggleLocale(); }}
                  className={`flex-1 rounded-md py-2 text-xs font-semibold transition-all ${
                    locale === "rw"
                      ? "bg-white text-gray-900 shadow dark:bg-green-600 dark:text-white"
                      : "text-gray-500 hover:text-gray-700 dark:text-green-100/50"
                  }`}
                >
                  🇷🇼 {t.settings.kinyarwanda}
                </button>
              </div>
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-green-100/50">
                {t.settings.currency}
              </p>
              <p className="text-xs text-gray-400 dark:text-green-100/40">
                {locale === "rw" ? "Hitamo ifaranga ry'ibikorwa" : "Choose your preferred currency"}
              </p>
              <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-black/20">
                {["RWF", "USD"].map((cur) => (
                  <button
                    key={cur}
                    type="button"
                    onClick={() => setCurrency(cur)}
                    className={`flex-1 rounded-md py-2 text-xs font-semibold transition-all ${
                      currency === cur
                        ? "bg-white text-gray-900 shadow dark:bg-green-600 dark:text-white"
                        : "text-gray-500 hover:text-gray-700 dark:text-green-100/50"
                    }`}
                  >
                    {cur}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Save button — no separate footer, just inline ── */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            {t.settings.saveChanges}
          </button>
        </div>

      </form>
    </div>
  );
}
