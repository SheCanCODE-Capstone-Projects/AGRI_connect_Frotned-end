"use client";

import { useLanguage } from "@/lib/LanguageContext";

type Audience = "all" | "active" | "pending" | "inactive";
type Channel = "SMS" | "Voice";

type BroadcastPanelProps = {
  audience: Audience;
  audienceCount: number;
  channel: Channel;
  message: string;
  onAudienceChange: (value: Audience) => void;
  onChannelChange: (value: Channel) => void;
  onMessageChange: (value: string) => void;
  onSend: () => void;
};

export default function BroadcastPanel({
  audience, audienceCount, channel, message,
  onAudienceChange, onChannelChange, onMessageChange, onSend,
}: BroadcastPanelProps) {
  const { t } = useLanguage();

  return (
    <aside className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-[#112d1a] dark:ring-white/10">

      <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
        <svg aria-hidden="true" className="text-green-600 dark:text-green-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
        </svg>
        {t.members.broadcastTitle}
      </h2>

      {/* Audience */}
      <div className="mt-5">
        <label className="text-[10px] font-semibold tracking-wide text-gray-400 dark:text-green-100/50">
          {t.members.broadcastAudience}
        </label>
        <select
          value={audience}
          onChange={(e) => onAudienceChange(e.target.value as Audience)}
          className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-green-600 dark:border-white/10 dark:bg-[#183622] dark:text-white"
        >
          <option value="all">{t.members.broadcastAudienceAll} · {audienceCount}</option>
          <option value="active">{t.members.broadcastAudienceActive}</option>
          <option value="pending">{t.members.broadcastAudiencePending}</option>
          <option value="inactive">{t.members.broadcastAudienceInactive}</option>
        </select>
      </div>

      {/* Channel */}
      <div className="mt-5">
        <p className="text-[10px] font-semibold tracking-wide text-gray-400 dark:text-green-100/50">
          {t.members.broadcastChannel}
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChannelChange("SMS")}
            className={`rounded-lg border py-2 text-sm font-semibold ${channel === "SMS" ? "border-green-600 bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "border-gray-200 text-gray-600 dark:border-white/10 dark:text-green-100/70"}`}
          >
            ▣ SMS
          </button>
          <button
            type="button"
            onClick={() => onChannelChange("Voice")}
            className={`rounded-lg border py-2 text-sm font-semibold ${channel === "Voice" ? "border-green-600 bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "border-gray-200 text-gray-600 dark:border-white/10 dark:text-green-100/70"}`}
          >
            ◉ {t.members.voice}
          </button>
        </div>
      </div>

      {/* Message */}
      <div className="mt-5">
        <label htmlFor="broadcast-message" className="text-[10px] font-semibold tracking-wide text-gray-400 dark:text-green-100/50">
          {t.members.broadcastMessage}
        </label>
        <textarea
          id="broadcast-message"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder={t.members.broadcastPlaceholder}
          rows={4}
          className="mt-2 w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-600 dark:border-white/10 dark:bg-[#183622] dark:text-white"
        />
        <p className="mt-2 text-xs text-gray-400 dark:text-green-100/50">
          {message.length} {t.members.broadcastChars} {audienceCount} {audienceCount === 1 ? t.members.broadcastMember : t.members.broadcastMembers}
        </p>
      </div>

      <button
        type="button"
        onClick={onSend}
        disabled={!message.trim() || audienceCount === 0}
        className="mt-5 w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-white/10"
      >
        {t.members.broadcastSend}
      </button>

      <p className="mt-4 rounded-lg bg-green-50 px-3 py-3 text-xs text-green-800 dark:bg-green-500/10 dark:text-green-100/70">
        {t.members.broadcastNote}
      </p>

    </aside>
  );
}
