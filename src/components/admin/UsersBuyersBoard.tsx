"use client";

import { useState, type ReactNode } from "react";
import { Search, Users, ShoppingBag, UserCheck, MoreVertical } from "lucide-react";

type PersonType = "Farmer" | "Cooperative Admin" | "Buyer";

type CardProps = {
    children: ReactNode;
};

function Card({ children }: CardProps) {
    return <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">{children}</div>;
}

const people: {
    name: string;
    email: string;
    type: PersonType;
    district: string;
    status: "Active" | "Suspended" | "Pending";
    joined: string;
}[] = [
    { name: "Jean Bosco Habimana", email: "jean.b@rulindo.rw", type: "Farmer", district: "Rulindo", status: "Active", joined: "12 Jan 2025" },
    { name: "Alice Uwase", email: "alice.u@bugesera.rw", type: "Cooperative Admin", district: "Bugesera", status: "Active", joined: "3 Mar 2025" },
    { name: "Kigali Fresh Ltd", email: "orders@kigalifresh.rw", type: "Buyer", district: "Kigali", status: "Pending", joined: "20 Jun 2026" },
    { name: "Eric Nshimiyimana", email: "eric.n@nyagatare.rw", type: "Farmer", district: "Nyagatare", status: "Suspended", joined: "8 Sep 2024" },
    { name: "Simba Supermarket", email: "procurement@simba.rw", type: "Buyer", district: "Musanze", status: "Active", joined: "14 Feb 2025" },
];

const statusStyles: Record<string, string> = {
    Active: "bg-green-500/15 text-green-500",
    Suspended: "bg-red-500/15 text-red-500",
    Pending: "bg-orange-500/15 text-orange-500",
};

export default function UsersBuyersBoard() {
    const [query, setQuery] = useState("");

    const filtered = people.filter((p) =>
        `${p.name} ${p.email} ${p.district}`.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="flex-1 min-w-0 p-8  bg-green-950 text-zinc-100 text-sm">
            {/* Page header */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-2xl font-bold m-0 font-display">Users &amp; Buyers</h1>
                    <p className="text-zinc-400 text-[13.5px] m-0 mt-1">
                        Manage farmers, cooperative admins, and buyer accounts
                    </p>
                </div>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                <Card>
                    <div className="flex items-start justify-between">
                        <span className="text-[11.5px] uppercase tracking-wide text-zinc-500">Farmer Members</span>
                        <div className="w-8 h-8 rounded-lg bg-green-500/15 text-green-500 flex items-center justify-center">
                            <Users size={16} />
                        </div>
                    </div>
                    <div className="text-[26px] font-bold mt-2.5">2,417</div>
                </Card>
                <Card>
                    <div className="flex items-start justify-between">
                        <span className="text-[11.5px] uppercase tracking-wide text-zinc-500">Active Buyers</span>
                        <div className="w-8 h-8 rounded-lg bg-green-500/15 text-green-500 flex items-center justify-center">
                            <ShoppingBag size={16} />
                        </div>
                    </div>
                    <div className="text-[26px] font-bold mt-2.5">312</div>
                </Card>
                <Card>
                    <div className="flex items-start justify-between">
                        <span className="text-[11.5px] uppercase tracking-wide text-zinc-500">Pending Verification</span>
                        <div className="w-8 h-8 rounded-lg bg-orange-500/15 text-orange-500 flex items-center justify-center">
                            <UserCheck size={16} />
                        </div>
                    </div>
                    <div className="text-[26px] font-bold mt-2.5">18</div>
                </Card>
            </div>

            {/* Search + table */}
            <Card>
                <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 max-w-sm">
                    <Search size={15} className="text-zinc-500" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name, email, or district"
                        className="bg-transparent outline-none text-[13px] text-zinc-200 placeholder:text-zinc-600 w-full"
                    />
                </div>

                <div className="grid grid-cols-[2fr_1.4fr_1fr_1fr_1fr_auto] gap-2 text-[11px] uppercase tracking-wide text-zinc-500 pb-2.5 border-b border-zinc-800">
                    <span>Name</span>
                    <span>Type</span>
                    <span>District</span>
                    <span>Status</span>
                    <span>Joined</span>
                    <span></span>
                </div>

                {filtered.map((p) => (
                    <div
                        key={p.email}
                        className="grid grid-cols-[2fr_1.4fr_1fr_1fr_1fr_auto] gap-2 items-center py-3.5 border-b border-zinc-800 last:border-b-0 text-[13.5px]"
                    >
                        <div>
                            <div className="font-semibold">{p.name}</div>
                            <div className="text-[11.5px] text-zinc-500">{p.email}</div>
                        </div>
                        <span className="text-zinc-400">{p.type}</span>
                        <span className="text-zinc-400">{p.district}</span>
                        <span>
                            <span className={`text-[11.5px] font-semibold px-2.5 py-1 rounded-md ${statusStyles[p.status]}`}>
                                {p.status}
                            </span>
                        </span>
                        <span className="text-zinc-400">{p.joined}</span>
                        <button className="text-zinc-500 hover:text-white">
                            <MoreVertical size={16} />
                        </button>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="py-8 text-center text-zinc-500 text-sm">
                        No matches for &quot;{query}&quot;.
                    </div>
                )}
            </Card>
        </div>
    );
}