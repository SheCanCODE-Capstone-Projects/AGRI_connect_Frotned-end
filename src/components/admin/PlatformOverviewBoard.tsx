"use client";

import { useState } from "react";
import {
    Building2,
    Users,
    ShoppingBag,
    DollarSign,
    Bell,
    Moon,
    CheckCircle2,
    AlertTriangle,
    TrendingUp,
    MapPin,
    Clock,
    Mail,
} from "lucide-react";
import Modal from "./Modal";

const monthlyGMV = [
    { m: "Jan", v: 62 },
    { m: "Feb", v: 70 },
    { m: "Mar", v: 52 },
    { m: "Apr", v: 78 },
    { m: "May", v: 65 },
    { m: "Jun", v: 84 },
    { m: "Jul", v: 72 },
    { m: "Aug", v: 88 },
    { m: "Sep", v: 75 },
    { m: "Oct", v: 92 },
    { m: "Nov", v: 80 },
    { m: "Dec", v: 95 },
];

const districts = [
    { rank: 1, name: "Musanze", coops: 22, gmv: "28.4M RWF", share: 28 },
    { rank: 2, name: "Nyamasheke", coops: 17, gmv: "22.1M RWF", share: 22 },
    { rank: 3, name: "Rwamagana", coops: 15, gmv: "18.7M RWF", share: 19 },
    { rank: 4, name: "Nyagatare", coops: 13, gmv: "16.2M RWF", share: 17 },
    { rank: 5, name: "Huye", coops: 11, gmv: "12.9M RWF", share: 14 },
];

const stats = [
    { label: "Registered Cooperatives", value: "184", delta: "+6 this month", icon: Building2, tone: "green" },
    { label: "Farmer Members", value: "2,417", delta: "+128 this month", icon: Users, tone: "green" },
    { label: "Active Buyers", value: "312", delta: "+21 this month", icon: ShoppingBag, tone: "green" },
    { label: "GMV (YTD)", value: "182.4M RWF", delta: "+18.2% YoY", icon: DollarSign, tone: "orange" },
];

type Approval = {
    name: string;
    type: string;
    place: string;
    time: string;
    status: string;
    approved: boolean;
};

const initialApprovals: Approval[] = [
    { name: "Rulindo Coffee Coop", type: "Cooperative", place: "Rulindo", time: "2h ago", status: "RCA pending", approved: false },
    { name: "Bugesera Dairy Union", type: "Cooperative", place: "Bugesera", time: "5h ago", status: "Docs review", approved: false },
    { name: "Kigali Fresh Ltd", type: "Buyer", place: "Kigali", time: "1d ago", status: "KYC pending", approved: false },
    { name: "Nyaruguru Grain Coop", type: "Cooperative", place: "Nyaruguru", time: "2d ago", status: "RCA pending", approved: false },
];

type Dispute = {
    id: string;
    title: string;
    parties: string;
    amount: string;
    time: string;
    resolved: boolean;
};

const initialDisputes: Dispute[] = [
    { id: "DSP-118", title: "Quality mismatch", parties: "Hotel Serena vs Rwamagana Farm", amount: "48,000 RWF", time: "3h ago", resolved: false },
    { id: "DSP-117", title: "Late delivery", parties: "Simba Supermarket vs Rubavu Highland", amount: "192,000 RWF", time: "1d ago", resolved: false },
    { id: "DSP-116", title: "Missing units", parties: "Kigali Fresh vs Musanze Coop", amount: "76,500 RWF", time: "2d ago", resolved: false },
];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-zinc-900 border border-zinc-800 rounded-xl p-5 ${className}`}>
            {children}
        </div>
    );
}

export default function AgriConnectDashboard() {
    const [approvals, setApprovals] = useState<Approval[]>(initialApprovals);
    const [disputes, setDisputes] = useState<Dispute[]>(initialDisputes);

    const [contactTarget, setContactTarget] = useState<Dispute | null>(null);
    const [mediateTarget, setMediateTarget] = useState<Dispute | null>(null);
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState(false);
    const [mediationNote, setMediationNote] = useState("");

    function handleApprove(name: string) {
        setApprovals((prev) =>
            prev.map((a) => (a.name === name ? { ...a, status: "Approved", approved: true } : a))
        );
    }

    function handleSendMessage() {
        setSent(true);
        setTimeout(() => {
            setContactTarget(null);
            setMessage("");
            setSent(false);
        }, 1200);
    }

    function handleResolveDispute() {
        if (!mediateTarget) return;
        setDisputes((prev) =>
            prev.map((d) => (d.id === mediateTarget.id ? { ...d, resolved: true } : d))
        );
        setMediateTarget(null);
        setMediationNote("");
    }

    return (
        <div className="min-h-screen bg-green-950 text-zinc-100 text-sm">
            <div className="flex">
                <div className="flex-1 min-w-0 p-8">
                    {/* Page header */}
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold m-0">Platform Overview</h1>
                            <p className="text-zinc-400 text-[13.5px] m-0 mt-1">
                                Cross-cooperative health, growth and operations
                            </p>
                        </div>
                        <div className="flex items-center gap-3.5 text-[13px] text-zinc-400">
                            <span>Today, 22 Jul 2026</span>
                            <Bell size={16} />
                            <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center">
                                <Moon size={15} />
                            </div>
                            <span className="bg-orange-500 text-black font-semibold px-3.5 py-1.5 rounded-lg text-xs">
                                Super Admin
                            </span>
                        </div>
                    </div>

                    {/* Stat cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                        {stats.map(({ label, value, delta, icon: Icon, tone }) => (
                            <Card key={label}>
                                <div className="flex items-start justify-between">
                                    <span className="text-[11.5px] uppercase tracking-wide text-zinc-500">{label}</span>
                                    <div
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                            tone === "orange" ? "bg-orange-500/15 text-orange-500" : "bg-green-500/15 text-green-500"
                                        }`}
                                    >
                                        <Icon size={16} />
                                    </div>
                                </div>
                                <div className="text-[26px] font-bold mt-2.5 mb-1.5">{value}</div>
                                <div className="text-[12.5px] text-green-500 flex items-center gap-1">
                                    <TrendingUp size={13} /> {delta}
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Chart + Health */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
                        <Card className="lg:col-span-2">
                            <div className="flex items-start justify-between mb-5">
                                <div>
                                    <p className="text-[15.5px] font-bold m-0 mb-1">Gross Merchandise Volume</p>
                                    <p className="text-xs text-zinc-500 m-0">All cooperatives · 2025 (RWF, millions)</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-green-500">182.4M</div>
                                    <div className="text-xs text-green-500">+18.2% YoY</div>
                                </div>
                            </div>
                            <div className="flex items-end gap-2.5 h-56">
                                {monthlyGMV.map(({ m, v }) => (
                                    <div key={m} className="flex-1 flex flex-col items-center justify-end h-full">
                                        <div
                                            className="w-full max-w-[34px] rounded-t-[5px] bg-gradient-to-b from-green-400 to-green-600"
                                            style={{ height: `${v}%` }}
                                        />
                                        <div className="mt-2 text-[11.5px] text-zinc-500">{m}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card>
                            <p className="text-[15.5px] font-bold m-0 mb-3.5">Platform Health</p>
                            <div className="flex items-center justify-between py-2.5 border-b border-zinc-800 text-[13px]">
                                <span className="flex items-center gap-2 text-zinc-400">
                                    <CheckCircle2 size={14} className="text-green-500" /> Platform uptime
                                </span>
                                <span className="font-semibold">99.98%</span>
                            </div>
                            <div className="flex items-center justify-between py-2.5 border-b border-zinc-800 text-[13px]">
                                <span className="flex items-center gap-2 text-zinc-400">
                                    <CheckCircle2 size={14} className="text-green-500" /> SMS delivery rate
                                </span>
                                <span className="font-semibold">97.4%</span>
                            </div>
                            <div className="flex items-center justify-between py-2.5 border-b border-zinc-800 text-[13px]">
                                <span className="flex items-center gap-2 text-zinc-400">
                                    <CheckCircle2 size={14} className="text-green-500" /> MoMo settlement lag
                                </span>
                                <span className="font-semibold">42 min</span>
                            </div>
                            <div className="flex items-center justify-between py-2.5 text-[13px]">
                                <span className="flex items-center gap-2 text-zinc-400">
                                    <AlertTriangle size={14} className="text-yellow-500" /> Failed payouts (24h)
                                </span>
                                <span className="font-semibold text-orange-500">3</span>
                            </div>

                            <div className="text-[11px] uppercase tracking-wide text-zinc-500 mt-4 mb-2.5">Live Activity</div>
                            <div className="flex items-center gap-2 text-[12.5px] text-zinc-400 py-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                14 orders placed in the last hour
                            </div>
                            <div className="flex items-center gap-2 text-[12.5px] text-zinc-400 py-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                6 new farmer signups (SMS)
                            </div>
                            <div className="flex items-center gap-2 text-[12.5px] text-zinc-400 py-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                2 MoMo callbacks retrying
                            </div>
                        </Card>
                    </div>

                    {/* Approvals + Disputes */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
                        <Card>
                            <div className="flex items-baseline justify-between mb-3.5">
                                <div>
                                    <p className="text-[15.5px] font-bold m-0 mb-1">Pending Approvals</p>
                                    <p className="text-xs text-zinc-500 m-0">Cooperatives &amp; buyers awaiting review</p>
                                </div>
                                <a className="text-green-500 text-xs font-semibold" href="#">Review queue</a>
                            </div>

                            {approvals.map((a) => (
                                <div
                                    key={a.name}
                                    className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-b-0 gap-3"
                                >
                                    <div className="min-w-0">
                                        <div className="font-semibold text-[13.5px] mb-1 truncate">{a.name}</div>
                                        <div className="flex items-center gap-2 text-[11.5px] text-zinc-500 flex-wrap">
                                            <span className="bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded">{a.type}</span>
                                            <span className="flex items-center gap-1">
                                                <MapPin size={11} /> {a.place}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={11} /> {a.time}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span
                                            className={`text-[11.5px] font-semibold px-2.5 py-1 rounded-md whitespace-nowrap ${
                                                a.approved ? "bg-zinc-800 text-zinc-400" : "bg-orange-500/15 text-orange-500"
                                            }`}
                                        >
                                            {a.status}
                                        </span>
                                        <button
                                            disabled={a.approved}
                                            onClick={() => handleApprove(a.name)}
                                            className={`font-bold text-xs px-3.5 py-1.5 rounded-md whitespace-nowrap ${
                                                a.approved
                                                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                                    : "bg-green-500 text-black hover:bg-green-400"
                                            }`}
                                        >
                                            {a.approved ? "Approved" : "Approve"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </Card>

                        <Card>
                            <div className="flex items-baseline justify-between mb-3.5">
                                <div>
                                    <p className="text-[15.5px] font-bold m-0 mb-1">Open Disputes</p>
                                    <p className="text-xs text-zinc-500 m-0">Buyer–cooperative conflicts to mediate</p>
                                </div>
                                <a className="text-green-500 text-xs font-semibold" href="#">All disputes</a>
                            </div>

                            {disputes.map((d) => (
                                <div
                                    key={d.id}
                                    className="flex items-start justify-between py-3 border-b border-zinc-800 last:border-b-0 gap-3"
                                >
                                    <div className="min-w-0">
                                        <div className="font-semibold text-[13.5px] mb-1 truncate">
                                            {d.id} · {d.title}
                                        </div>
                                        <div className="text-[11.5px] text-zinc-500 mb-1 truncate">{d.parties}</div>
                                        <div className="text-[13px] font-semibold">{d.amount}</div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                                        <span className="text-[11.5px] text-zinc-500">
                                            {d.resolved ? "Resolved" : d.time}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setContactTarget(d)}
                                                className="border border-zinc-700 text-zinc-300 text-xs px-3.5 py-1.5 rounded-md whitespace-nowrap hover:bg-zinc-800"
                                            >
                                                Contact
                                            </button>
                                            <button
                                                disabled={d.resolved}
                                                onClick={() => setMediateTarget(d)}
                                                className={`font-bold text-xs px-3.5 py-1.5 rounded-md whitespace-nowrap ${
                                                    d.resolved
                                                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                                        : "bg-zinc-100 text-black hover:bg-white"
                                                }`}
                                            >
                                                {d.resolved ? "Resolved" : "Mediate"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Card>
                    </div>

                    {/* Districts table */}
                    <Card>
                        <div className="flex items-baseline justify-between mb-3.5">
                            <div>
                                <p className="text-[15.5px] font-bold m-0 mb-1 flex items-center gap-1.5">
                                    <TrendingUp size={16} className="text-green-500" /> Top Districts by GMV
                                </p>
                                <p className="text-xs text-zinc-500 m-0">Where the platform is growing fastest</p>
                            </div>
                            <a className="text-green-500 text-xs font-semibold" href="#">Export CSV</a>
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-[11px] uppercase tracking-wide text-zinc-500 pb-2.5 border-b border-zinc-800">
                            <span>District</span>
                            <span>Cooperatives</span>
                            <span>GMV (RWF)</span>
                            <span>Share</span>
                        </div>

                        {districts.map((d) => (
                            <div
                                key={d.name}
                                className="grid grid-cols-4 gap-2 items-center py-3.5 border-b border-zinc-800 last:border-b-0 text-[13.5px]"
                            >
                                <span className="font-semibold">
                                    {d.rank}. {d.name}
                                </span>
                                <span>{d.coops}</span>
                                <span>{d.gmv}</span>
                                <span className="flex items-center gap-2.5">
                                    <span className="bg-zinc-800 rounded h-1.5 w-full max-w-[120px]">
                                        <span className="block bg-green-500 h-1.5 rounded" style={{ width: `${d.share * 3}%` }} />
                                    </span>
                                    <span className="text-zinc-400 text-xs w-9">{d.share}%</span>
                                </span>
                            </div>
                        ))}
                    </Card>
                </div>
            </div>

            {/* Contact modal */}
            <Modal open={!!contactTarget} onClose={() => setContactTarget(null)} title={`Contact — ${contactTarget?.parties ?? ""}`}>
                {sent ? (
                    <div className="flex items-center gap-2 text-green-500 text-sm py-4">
                        <CheckCircle2 size={16} /> Message sent.
                    </div>
                ) : (
                    <>
                        <p className="text-xs text-zinc-500 mb-3">
                            Send a message to both parties regarding {contactTarget?.id} · {contactTarget?.title}.
                        </p>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            placeholder="Type your message..."
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-[13px] text-zinc-100 outline-none focus:border-green-500 mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setContactTarget(null)} className="text-xs text-zinc-400 px-3.5 py-2 hover:text-white">
                                Cancel
                            </button>
                            <button
                                onClick={handleSendMessage}
                                disabled={!message.trim()}
                                className="flex items-center gap-1.5 bg-green-500 text-black font-bold text-xs px-4 py-2 rounded-md disabled:opacity-40"
                            >
                                <Mail size={13} /> Send message
                            </button>
                        </div>
                    </>
                )}
            </Modal>

            {/* Mediate modal */}
            <Modal open={!!mediateTarget} onClose={() => setMediateTarget(null)} title={`Mediate — ${mediateTarget?.id ?? ""}`}>
                <p className="text-xs text-zinc-500 mb-1">{mediateTarget?.title}</p>
                <p className="text-[13px] text-zinc-300 mb-3">{mediateTarget?.parties}</p>
                <textarea
                    value={mediationNote}
                    onChange={(e) => setMediationNote(e.target.value)}
                    rows={4}
                    placeholder="Resolution notes..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-[13px] text-zinc-100 outline-none focus:border-green-500 mb-4"
                />
                <div className="flex justify-end gap-2">
                    <button onClick={() => setMediateTarget(null)} className="text-xs text-zinc-400 px-3.5 py-2 hover:text-white">
                        Cancel
                    </button>
                    <button
                        onClick={handleResolveDispute}
                        disabled={!mediationNote.trim()}
                        className="bg-green-500 text-black font-bold text-xs px-4 py-2 rounded-md disabled:opacity-40"
                    >
                        Mark as resolved
                    </button>
                </div>
            </Modal>
        </div>
    );
}