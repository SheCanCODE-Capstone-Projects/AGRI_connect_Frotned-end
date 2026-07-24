"use client";

import { useState, type ReactNode } from "react";
import { ShieldCheck, FileText, MapPin, Clock, Eye, CheckCircle2, Download } from "lucide-react";

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    children?: ReactNode;
};

function Modal({ open, onClose, title, children }: ModalProps) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-green-950/70 p-4"
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-2xl rounded-xl border border-green-800 bg-green-900 p-4 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold m-0">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white text-lg leading-none"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

function Card({ children }: { children: ReactNode }) {
    return <div className="rounded-xl border border-green-800 bg-green-900/70 p-4">{children}</div>;
}

type QueueItem = {
    name: string;
    type: string;
    place: string;
    time: string;
    docs: string[];
    stage: string;
    approved: boolean;
};

const initialQueue: QueueItem[] = [
    {
        name: "Rulindo Coffee Coop",
        type: "Cooperative",
        place: "Rulindo",
        time: "2h ago",
        docs: ["Cooperative Registration Certificate.pdf", "Board Member IDs.pdf", "Tax Clearance Certificate.pdf", "Land Ownership Deed.pdf"],
        stage: "RCA pending",
        approved: false,
    },
    {
        name: "Bugesera Dairy Union",
        type: "Cooperative",
        place: "Bugesera",
        time: "5h ago",
        docs: ["Cooperative Registration Certificate.pdf", "Board Member IDs.pdf", "Tax Clearance Certificate.pdf"],
        stage: "Docs review",
        approved: false,
    },
    {
        name: "Kigali Fresh Ltd",
        type: "Buyer",
        place: "Kigali",
        time: "1d ago",
        docs: ["Business License.pdf", "Director National ID.pdf"],
        stage: "KYC pending",
        approved: false,
    },
    {
        name: "Nyaruguru Grain Coop",
        type: "Cooperative",
        place: "Nyaruguru",
        time: "2d ago",
        docs: ["Cooperative Registration Certificate.pdf", "Board Member IDs.pdf", "Tax Clearance Certificate.pdf", "Land Ownership Deed.pdf"],
        stage: "RCA pending",
        approved: false,
    },
];

const stageStyles: Record<string, string> = {
    "RCA pending": "bg-orange-500/15 text-orange-500",
    "Docs review": "bg-blue-500/15 text-blue-400",
    "KYC pending": "bg-orange-500/15 text-orange-500",
};

export default function VerificationBoard() {
    const [queue, setQueue] = useState<QueueItem[]>(initialQueue);
    const [reviewTarget, setReviewTarget] = useState<QueueItem | null>(null);

    function handleApprove(name: string) {
        setQueue((prev) =>
            prev.map((q) => (q.name === name ? { ...q, stage: "Approved", approved: true } : q))
        );
        if (reviewTarget?.name === name) {
            setReviewTarget((prev) => (prev ? { ...prev, stage: "Approved", approved: true } : prev));
        }
    }

    function downloadDoc(docName: string, entryName: string) {
        const content = `Document: ${docName}\nSubmitted by: ${entryName}\n\nThis is a placeholder file generated for demo purposes.`;
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = docName.replace(/\.[^.]+$/, ".txt");
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    const pendingCount = queue.filter((q) => !q.approved).length;

    return (
        <div className="flex-1 min-w-0 p-8 text-zinc-100 text-sm bg-green-950">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-2xl font-bold m-0">Verification (RCA)</h1>
                    <p className="text-zinc-400 text-[13.5px] m-0 mt-1">
                        Review cooperative and buyer identity documents before approval
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                <Card>
                    <div className="flex items-start justify-between">
                        <span className="text-[11.5px] uppercase tracking-wide text-zinc-500">Awaiting Review</span>
                        <div className="w-8 h-8 rounded-lg bg-orange-500/15 text-orange-500 flex items-center justify-center">
                            <ShieldCheck size={16} />
                        </div>
                    </div>
                    <div className="text-[26px] font-bold mt-2.5">{pendingCount}</div>
                </Card>
                <Card>
                    <div className="flex items-start justify-between">
                        <span className="text-[11.5px] uppercase tracking-wide text-zinc-500">Approved this month</span>
                        <div className="w-8 h-8 rounded-lg bg-green-500/15 text-green-950 flex items-center justify-center">
                            <ShieldCheck size={16} />
                        </div>
                    </div>
                    <div className="text-[26px] font-bold mt-2.5">
                        {31 + queue.filter((q) => q.approved).length}
                    </div>
                </Card>
                <Card>
                    <div className="flex items-start justify-between">
                        <span className="text-[11.5px] uppercase tracking-wide text-zinc-500">Avg. review time</span>
                        <div className="w-8 h-8 rounded-lg bg-green-500/15 text-green-950 flex items-center justify-center">
                            <Clock size={16} />
                        </div>
                    </div>
                    <div className="text-[26px] font-bold mt-2.5">6h</div>
                </Card>
            </div>

            <Card>
                <p className="text-[15.5px] font-bold m-0 mb-4">Verification Queue</p>

                {queue.map((q) => (
                    <div
                        key={q.name}
                        className="flex items-center justify-between py-3.5 border-b border-green-800 last:border-b-0 gap-3"
                    >
                        <div className="min-w-0">
                            <div className="font-semibold text-[13.5px] mb-1 truncate">{q.name}</div>
                            <div className="flex items-center gap-2 text-[11.5px] text-zinc-500 flex-wrap">
                                <span className="bg-green-950 border border-green-950 px-2 py-0.5 rounded">{q.type}</span>
                                <span className="flex items-center gap-1">
                                    <MapPin size={11} /> {q.place}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={11} /> {q.time}
                                </span>
                                <span className="flex items-center gap-1">
                                    <FileText size={11} /> {q.docs.length} documents
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span
                                className={`text-[11.5px] font-semibold px-2.5 py-1 rounded-md whitespace-nowrap ${
                                    q.approved ? "bg-green-950 text-zinc-400" : stageStyles[q.stage]
                                }`}
                            >
                                {q.stage}
                            </span>
                            <button
                                onClick={() => setReviewTarget(q)}
                                className="flex items-center gap-1.5 border border-green-950 text-zinc-300 text-xs px-3.5 py-1.5 rounded-md whitespace-nowrap hover:bg-green-800"
                            >
                                <Eye size={13} /> Review
                            </button>
                            <button
                                disabled={q.approved}
                                onClick={() => handleApprove(q.name)}
                                className={`font-bold text-xs px-3.5 py-1.5 rounded-md whitespace-nowrap ${
                                    q.approved
                                        ? "bg-green-950 text-zinc-500 cursor-not-allowed"
                                        : "bg-green-500 text-black hover:bg-green-400"
                                }`}
                            >
                                {q.approved ? "Approved" : "Approve"}
                            </button>
                        </div>
                    </div>
                ))}
            </Card>

            {/* Review modal */}
            <Modal
                open={!!reviewTarget}
                onClose={() => setReviewTarget(null)}
                title={reviewTarget ? `Documents — ${reviewTarget.name}` : ""}
            >
                {reviewTarget && (
                    <>
                        <div className="flex flex-col gap-2 mb-4">
                            {reviewTarget.docs.map((doc) => (
                                <div
                                    key={doc}
                                    className="flex items-center justify-between bg-green-950 border border-green-800 rounded-lg px-3 py-2.5"
                                >
                                    <span className="flex items-center gap-2 text-[13px] text-zinc-200 truncate">
                                        <FileText size={14} className="text-zinc-500 shrink-0" />
                                        {doc}
                                    </span>
                                    <button
                                        onClick={() => downloadDoc(doc, reviewTarget.name)}
                                        className="text-zinc-500 hover:text-white shrink-0"
                                        title="Download"
                                    >
                                        <Download size={15} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {reviewTarget.approved ? (
                            <div className="flex items-center gap-2 text-green-500 text-sm">
                                <CheckCircle2 size={16} /> This entry has been approved.
                            </div>
                        ) : (
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setReviewTarget(null)}
                                    className="text-xs text-zinc-400 px-3.5 py-2 hover:text-white"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => handleApprove(reviewTarget.name)}
                                    className="bg-green-500 text-black font-bold text-xs px-4 py-2 rounded-md"
                                >
                                    Approve
                                </button>
                            </div>
                        )}
                    </>
                )}
            </Modal>
        </div>
    );
}