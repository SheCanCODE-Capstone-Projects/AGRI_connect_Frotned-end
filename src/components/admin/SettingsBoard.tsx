"use client";

import { useState } from "react";
import { Save, Globe, Bell, Percent, CheckCircle2, Loader2 } from "lucide-react";
import Card from "./Card";

type SaveState = "idle" | "saving" | "saved";

export default function SettingsBoard() {
    const [platformFee, setPlatformFee] = useState("3.5");
    const [smsAlerts, setSmsAlerts] = useState(true);
    const [autoApprove, setAutoApprove] = useState(false);
    const [currency, setCurrency] = useState("RWF — Rwandan Franc");
    const [language, setLanguage] = useState("English");

    const [saveState, setSaveState] = useState<SaveState>("idle");
    const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);

    function handleSave() {
        setSaveState("saving");

        // Simulates a persistence call. Replace this block with a real
        // API request (e.g. fetch("/api/admin/settings", { method: "POST", ... }))
        // once a backend endpoint exists.
        const payload = { platformFee, smsAlerts, autoApprove, currency, language };

        setTimeout(() => {
            setSavedSnapshot(JSON.stringify(payload));
            setSaveState("saved");
            setTimeout(() => setSaveState("idle"), 2000);
        }, 800);
    }

    return (
        <div className="flex-1 min-w-0 p-8 bg-green-950 text-zinc-100 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-2xl font-bold m-0">Platform Settings</h1>
                    <p className="text-zinc-400 text-[13.5px] m-0 mt-1">
                        Configure platform-wide fees, notifications, and defaults
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saveState === "saving"}
                    className={`flex items-center gap-2 font-bold text-xs px-4 py-2 rounded-lg transition-colors ${
                        saveState === "saved"
                            ? "bg-green-500 text-black"
                            : "bg-green-500 text-black hover:bg-green-400 disabled:opacity-60"
                    }`}
                >
                    {saveState === "saving" && <Loader2 size={14} className="animate-spin" />}
                    {saveState === "saved" && <CheckCircle2 size={14} />}
                    {saveState === "idle" && <Save size={14} />}
                    {saveState === "saving" ? "Saving..." : saveState === "saved" ? "Saved" : "Save changes"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <div className="flex items-center gap-2 mb-4">
                        <Percent size={16} className="text-orange-500" />
                        <p className="text-[15.5px] font-bold m-0">Marketplace Fees</p>
                    </div>
                    <label className="block text-[12.5px] text-zinc-400 mb-1.5">Platform commission (%)</label>
                    <input
                        value={platformFee}
                        onChange={(e) => setPlatformFee(e.target.value)}
                        className="w-full max-w-[160px] bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-[13.5px] text-zinc-100 outline-none focus:border-green-500"
                    />
                    <p className="text-[11.5px] text-zinc-500 mt-2">
                        Applied to every completed transaction across all cooperatives.
                    </p>
                </Card>

                <Card>
                    <div className="flex items-center gap-2 mb-4">
                        <Bell size={16} className="text-orange-500" />
                        <p className="text-[15.5px] font-bold m-0">Notifications</p>
                    </div>
                    <div className="flex items-center justify-between py-2.5 border-b border-zinc-800">
                        <span className="text-[13px] text-zinc-300">SMS alerts for new signups</span>
                        <button
                            onClick={() => setSmsAlerts(!smsAlerts)}
                            className={`w-10 h-5.5 rounded-full relative transition-colors ${
                                smsAlerts ? "bg-green-500" : "bg-zinc-700"
                            }`}
                        >
                            <span
                                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                                    smsAlerts ? "left-5" : "left-0.5"
                                }`}
                            />
                        </button>
                    </div>
                    <div className="flex items-center justify-between py-2.5">
                        <span className="text-[13px] text-zinc-300">Auto-approve verified buyers</span>
                        <button
                            onClick={() => setAutoApprove(!autoApprove)}
                            className={`w-10 h-5.5 rounded-full relative transition-colors ${
                                autoApprove ? "bg-green-500" : "bg-zinc-700"
                            }`}
                        >
                            <span
                                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                                    autoApprove ? "left-5" : "left-0.5"
                                }`}
                            />
                        </button>
                    </div>
                </Card>

                <Card className="lg:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <Globe size={16} className="text-orange-500" />
                        <p className="text-[15.5px] font-bold m-0">Regional Defaults</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[12.5px] text-zinc-400 mb-1.5">Default currency</label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-[13.5px] text-zinc-100 outline-none focus:border-green-500"
                            >
                                <option>RWF — Rwandan Franc</option>
                                <option>USD — US Dollar</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[12.5px] text-zinc-400 mb-1.5">Default language</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-[13.5px] text-zinc-100 outline-none focus:border-green-500"
                            >
                                <option>English</option>
                                <option>Kinyarwanda</option>
                                <option>Français</option>
                            </select>
                        </div>
                    </div>
                </Card>
            </div>

            {savedSnapshot && saveState === "idle" && (
                <p className="text-[11.5px] text-zinc-600 mt-4">
                    Last saved settings are active. Changing a field again will require pressing “Save changes” once more.
                </p>
            )}
        </div>
    );
}