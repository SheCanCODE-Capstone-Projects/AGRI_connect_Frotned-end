"use client";

import { useEffect, useState } from "react";
import type { Buyer } from "./BuyersBoard";
import { useLanguage } from "@/lib/LanguageContext";

interface AddBuyerModalProps {
  isOpen: boolean;
  buyer?: Buyer | null;
  onClose: () => void;
  onAdd: (buyer: Buyer) => void;
}

export default function AddBuyerModal({ isOpen, buyer, onClose, onAdd }: AddBuyerModalProps) {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: "", location: "", orders: 0, spend: "RWF 0", reliability: 100, active: true,
  });

  useEffect(() => {
    setFormData(buyer
      ? { name: buyer.name, location: buyer.location, orders: buyer.orders, spend: buyer.spend, reliability: buyer.reliability, active: buyer.active }
      : { name: "", location: "", orders: 0, spend: "RWF 0", reliability: 100, active: true }
    );
  }, [buyer, isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const initials = formData.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    onAdd({ initials, name: formData.name, location: formData.location, orders: Number(formData.orders), spend: formData.spend, reliability: Number(formData.reliability), active: formData.active });
    setFormData({ name: "", location: "", orders: 0, spend: "RWF 0", reliability: 100, active: true });
    onClose();
  }

  const field = (key: string) => "w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-green-500 dark:border-white/10 dark:bg-transparent dark:text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-[#112d1a]">

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {buyer ? t.buyers.editModalTitle : t.buyers.addModalTitle}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t.buyers.placeholderName} className={field("name")} />

          <input required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder={t.buyers.placeholderLocation} className={field("location")} />

          <input type="number" min="0" value={formData.orders} onChange={(e) => setFormData({ ...formData, orders: Number(e.target.value) })}
            placeholder={t.buyers.placeholderOrders} className={field("orders")} />

          <input value={formData.spend} onChange={(e) => setFormData({ ...formData, spend: e.target.value })}
            placeholder={t.buyers.placeholderSpend} className={field("spend")} />

          <input type="number" min="0" max="100" value={formData.reliability} onChange={(e) => setFormData({ ...formData, reliability: Number(e.target.value) })}
            placeholder={t.buyers.placeholderReliability} className={field("reliability")} />

          <button type="submit" className="w-full rounded-lg bg-green-600 py-2 text-sm font-semibold text-white hover:bg-green-700">
            {buyer ? t.buyers.saveChanges : t.buyers.addBuyerBtn}
          </button>
        </form>

      </div>
    </div>
  );
}
