"use client";

import { useState } from "react";
import { Download, FileBarChart2, TrendingUp, Calendar, CheckCircle2, Plus } from "lucide-react";
import Card from "./Card";
import Modal from "./Modal";

type Report = {
    name: string;
    period: string;
    format: "PDF" | "XLSX" | "CSV";
    size: string;
    rows: string[][];
};

const initialReports: Report[] = [
    {
        name: "Monthly GMV Summary",
        period: "July 2026",
        format: "CSV",
        size: "1.2 MB",
        rows: [
            ["Metric", "Value"],
            ["Total GMV", "182,400,000 RWF"],
            ["YoY Growth", "18.2%"],
            ["Active Cooperatives", "184"],
            ["Active Buyers", "312"],
        ],
    },
    {
        name: "Cooperative Growth Report",
        period: "Q2 2026",
        format: "CSV",
        size: "860 KB",
        rows: [
            ["District", "Cooperatives", "GMV (RWF)"],
            ["Musanze", "22", "28,400,000"],
            ["Nyamasheke", "17", "22,100,000"],
            ["Rwamagana", "15", "18,700,000"],
            ["Nyagatare", "13", "16,200,000"],
            ["Huye", "11", "12,900,000"],
        ],
    },
    {
        name: "Dispute Resolution Log",
        period: "July 2026",
        format: "CSV",
        size: "210 KB",
        rows: [
            ["Dispute ID", "Title", "Parties", "Amount"],
            ["DSP-118", "Quality mismatch", "Hotel Serena vs Rwamagana Farm", "48,000 RWF"],
            ["DSP-117", "Late delivery", "Simba Supermarket vs Rubavu Highland", "192,000 RWF"],
            ["DSP-116", "Missing units", "Kigali Fresh vs Musanze Coop", "76,500 RWF"],
        ],
    },
    {
        name: "District Performance Breakdown",
        period: "YTD 2026",
        format: "CSV",
        size: "2.4 MB",
        rows: [
            ["District", "Share of GMV"],
            ["Musanze", "28%"],
            ["Nyamasheke", "22%"],
            ["Rwamagana", "19%"],
            ["Nyagatare", "17%"],
            ["Huye", "14%"],
        ],
    },
];

const reportTypes = [
    { label: "GMV Summary", rows: [["Metric", "Value"], ["Total GMV", "182,400,000 RWF"], ["YoY Growth", "18.2%"]] },
    { label: "Cooperative Growth", rows: [["District", "Cooperatives"], ["Musanze", "22"], ["Nyamasheke", "17"]] },
    { label: "Dispute Log", rows: [["Dispute ID", "Status"], ["DSP-118", "Open"], ["DSP-117", "Open"]] },
];

export default function ReportsBoard() {
    const [reports, setReports] = useState<Report[]>(initialReports);
    const [downloaded, setDownloaded] = useState<Record<string, boolean>>({});

    const [showNewReport, setShowNewReport] = useState(false);
    const [newName, setNewName] = useState("");
    const [newPeriod, setNewPeriod] = useState("");
    const [newType, setNewType] = useState(reportTypes[0].label);
    const [generating, setGenerating] = useState(false);

    function toCsvBlobUrl(rows: string[][]) {
        const csv = rows.map((row) => row.join(",")).join("\n");
        return URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    }

    function handleDownload(report: Report) {
        const url = toCsvBlobUrl(report.rows);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${report.name.replace(/\s+/g, "_")}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        setDownloaded((prev) => ({ ...prev, [report.name]: true }));
        setTimeout(() => setDownloaded((prev) => ({ ...prev, [report.name]: false })), 2000);
    }

    function handleGenerateReport() {
        if (!newName.trim() || !newPeriod.trim()) return;
        setGenerating(true);

        // Simulates report generation. Swap this for a real API call
        // (e.g. POST /api/admin/reports) once a backend exists.
        setTimeout(() => {
            const template = reportTypes.find((t) => t.label === newType) ?? reportTypes[0];
            const report: Report = {
                name: newName.trim(),
                period: newPeriod.trim(),
                format: "CSV",
                size: "—",
                rows: template.rows,
            };
            setReports((prev) => [report, ...prev]);
            setGenerating(false);
            setShowNewReport(false);
            setNewName("");
            setNewPeriod("");
            setNewType(reportTypes[0].label);
        }, 900);
    }

    return (
        <div className="flex-1 min-w-0 p-8 bg-green-950 text-zinc-100 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-2xl font-bold m-0">Reports</h1>
                    <p className="text-zinc-400 text-[13.5px] m-0 mt-1">
                        Generate and download platform-wide performance reports
                    </p>
                </div>
                <button
                    onClick={() => setShowNewReport(true)}
                    className="flex items-center gap-2 bg-green-500 text-black font-bold text-xs px-4 py-2 rounded-lg hover:bg-green-400"
                >
                    <FileBarChart2 size={14} /> New Report
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                <Card>
                    <div className="flex items-start justify-between">
                        <span className="text-[11.5px] uppercase tracking-wide text-zinc-500">GMV (YTD)</span>
                        <div className="w-8 h-8 rounded-lg bg-orange-500/15 text-orange-500 flex items-center justify-center">
                            <TrendingUp size={16} />
                        </div>
                    </div>
                    <div className="text-[26px] font-bold mt-2.5">182.4M RWF</div>
                </Card>
                <Card>
                    <div className="flex items-start justify-between">
                        <span className="text-[11.5px] uppercase tracking-wide text-zinc-500">Reports generated</span>
                        <div className="w-8 h-8 rounded-lg bg-green-500/15 text-green-500 flex items-center justify-center">
                            <FileBarChart2 size={16} />
                        </div>
                    </div>
                    <div className="text-[26px] font-bold mt-2.5">{reports.length}</div>
                </Card>
                <Card>
                    <div className="flex items-start justify-between">
                        <span className="text-[11.5px] uppercase tracking-wide text-zinc-500">Next scheduled</span>
                        <div className="w-8 h-8 rounded-lg bg-green-500/15 text-green-500 flex items-center justify-center">
                            <Calendar size={16} />
                        </div>
                    </div>
                    <div className="text-[26px] font-bold mt-2.5">1 Aug</div>
                </Card>
            </div>

            <Card>
                <p className="text-[15.5px] font-bold m-0 mb-4">Available Reports</p>

                <div className="grid grid-cols-[2fr_1fr_0.8fr_0.8fr_auto] gap-2 text-[11px] uppercase tracking-wide text-zinc-500 pb-2.5 border-b border-green-800">
                    <span>Name</span>
                    <span>Period</span>
                    <span>Format</span>
                    <span>Size</span>
                    <span></span>
                </div>

                {reports.map((r) => (
                    <div
                        key={r.name}
                        className="grid grid-cols-[2fr_1fr_0.8fr_0.8fr_auto] gap-2 items-center py-3.5 border-b border-green-800 last:border-b-0 text-[13.5px]"
                    >
                        <span className="font-semibold">{r.name}</span>
                        <span className="text-zinc-400">{r.period}</span>
                        <span className="text-zinc-400">{r.format}</span>
                        <span className="text-zinc-400">{r.size}</span>
                        <button
                            onClick={() => handleDownload(r)}
                            className="flex items-center gap-1.5 border border-green-700 text-zinc-300 text-xs px-3.5 py-1.5 rounded-md whitespace-nowrap hover:bg-green-800 justify-self-end"
                        >
                            {downloaded[r.name] ? (
                                <>
                                    <CheckCircle2 size={13} className="text-green-500" /> Downloaded
                                </>
                            ) : (
                                <>
                                    <Download size={13} /> Download
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </Card>

            {/* New Report modal */}
            <Modal open={showNewReport} onClose={() => setShowNewReport(false)} title="Generate a new report">
                <div className="flex flex-col gap-3 mb-4">
                    <div>
                        <label className="block text-[12.5px] text-zinc-400 mb-1.5">Report name</label>
                        <input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="e.g. August GMV Summary"
                            className="w-full bg-green-950 border border-green-800 rounded-lg px-3 py-2 text-[13px] text-zinc-100 outline-none focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-[12.5px] text-zinc-400 mb-1.5">Period</label>
                        <input
                            value={newPeriod}
                            onChange={(e) => setNewPeriod(e.target.value)}
                            placeholder="e.g. August 2026"
                            className="w-full bg-green-950 border border-green-800 rounded-lg px-3 py-2 text-[13px] text-zinc-100 outline-none focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-[12.5px] text-zinc-400 mb-1.5">Report type</label>
                        <select
                            value={newType}
                            onChange={(e) => setNewType(e.target.value)}
                            className="w-full bg-green-950 border border-green-800 rounded-lg px-3 py-2 text-[13px] text-zinc-100 outline-none focus:border-green-500"
                        >
                            {reportTypes.map((t) => (
                                <option key={t.label}>{t.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => setShowNewReport(false)}
                        className="text-xs text-zinc-400 px-3.5 py-2 hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleGenerateReport}
                        disabled={!newName.trim() || !newPeriod.trim() || generating}
                        className="flex items-center gap-1.5 bg-green-500 text-black font-bold text-xs px-4 py-2 rounded-md disabled:opacity-50"
                    >
                        <Plus size={13} /> {generating ? "Generating..." : "Generate report"}
                    </button>
                </div>
            </Modal>
        </div>
    );
}