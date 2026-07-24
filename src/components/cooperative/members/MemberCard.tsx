"use client";

import { useLanguage } from "@/lib/LanguageContext";

export type MemberStatus = "Active" | "Pending" | "Inactive";

export type Member = {
  id: string;
  name: string;
  phone: string;
  village: string;
  crop: string;
  status: MemberStatus;
  color: string;
};

type MemberCardProps = {
  member: Member;
  onSendSms: (member: Member) => void;
  onDelete?: (member: Member) => void;
};

const statusColor: Record<MemberStatus, string> = {
  Active: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  Inactive: "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-green-100/50",
};

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

export default function MemberCard({ member, onSendSms, onDelete }: MemberCardProps) {
  const { t } = useLanguage();

  const statusLabel: Record<MemberStatus, string> = {
    Active: t.members.statusActive,
    Pending: t.members.statusPending,
    Inactive: t.members.statusInactive,
  };

  return (
    <article className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-[#112d1a] dark:ring-white/10">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${member.color}`}>
            {initials(member.name)}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-gray-900 dark:text-white">{member.name}</h2>
            <p className="text-xs text-gray-400 dark:text-green-100/50">{member.id}</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColor[member.status]}`}>
          {statusLabel[member.status]}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-xs text-gray-500 dark:text-green-100/60">
        <p className="flex items-center gap-2">
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8.01 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
          </svg>
          {member.phone}
        </p>
        <p className="flex items-center gap-2">
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 10c0 5-8 11-8 11s-8-6-8-11a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="3" />
          </svg>
          {member.village} · {member.crop}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => onSendSms(member)}
          className="flex-1 rounded-lg border border-green-600 py-2 text-xs font-semibold text-green-600 transition hover:bg-green-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 dark:text-green-400"
        >
          {t.members.sendSms}
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(member)}
            className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
          >
            {t.buyers.delete}
          </button>
        )}
      </div>
    </article>
  );
}
