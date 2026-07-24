"use client";

import { useState } from "react";
import BuyerCard from "./BuyerCard";
import BuyersStats from "./BuyersStats";
import SearchBuyers from "./SearchBuyers";
import BuyerDetailsModal from "./BuyerDetailsModal";
import AddBuyerModal from "./AddBuyerModal";
import { useBuyers } from "@/lib/buyers";
import { useLanguage } from "@/lib/LanguageContext";

export type { Buyer } from "@/lib/buyers";

export default function BuyersBoard() {
  const { t } = useLanguage();
  const { buyers, addBuyer, updateBuyer, deleteBuyer } = useBuyers();

  const [showAddBuyer, setShowAddBuyer] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [editingBuyer, setEditingBuyer] = useState<Buyer | null>(null);
  const [feedback, setFeedback] = useState("");

  const filteredBuyers = buyers.filter((buyer) => {
    const searchMatch =
      buyer.name.toLowerCase().includes(search.toLowerCase()) ||
      buyer.location.toLowerCase().includes(search.toLowerCase());
    const filterMatch =
      filter === "All" ? true : filter === "Active" ? buyer.active : !buyer.active;
    return searchMatch && filterMatch;
  });

  const handleAddBuyer = (buyer: Buyer) => {
    addBuyer(buyer);
    setFeedback(`${buyer.name} was added.`);
  };

  const handleUpdateBuyer = (updatedBuyer: Buyer) => {
    if (!editingBuyer) return;
    updateBuyer(editingBuyer.name, updatedBuyer);
    setSelectedBuyer((current) => current?.name === editingBuyer.name ? updatedBuyer : current);
    setEditingBuyer(null);
    setFeedback(`${updatedBuyer.name} was updated.`);
  };

  const handleDeleteBuyer = (buyer: Buyer) => {
    if (!confirm(`Delete ${buyer.name}?`)) return;
    deleteBuyer(buyer.name);
    setSelectedBuyer((current) => current?.name === buyer.name ? null : current);
    setFeedback(`${buyer.name} was deleted.`);
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 dark:text-green-100/50">
            {t.buyers.subtitle}
          </p>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            {t.buyers.title}
          </h1>
        </div>
        <button
          onClick={() => setShowAddBuyer(true)}
          className="rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700"
        >
          {t.buyers.addBuyer}
        </button>
      </div>

      {feedback && (
        <p role="status" className="rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-100">
          {feedback}
        </p>
      )}

      <BuyersStats buyers={buyers} />

      <SearchBuyers search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} />

      {filteredBuyers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBuyers.map((buyer) => (
            <BuyerCard
              key={buyer.name}
              buyer={buyer}
              onViewHistory={() => setSelectedBuyer(buyer)}
              onEdit={() => setEditingBuyer(buyer)}
              onDelete={() => handleDeleteBuyer(buyer)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-white p-8 text-center text-sm text-gray-500 shadow-sm dark:bg-[#112d1a] dark:text-green-100/50">
          {t.buyers.noBuyers}
        </div>
      )}

      <BuyerDetailsModal buyer={selectedBuyer} onClose={() => setSelectedBuyer(null)} />

      <AddBuyerModal
        isOpen={showAddBuyer || Boolean(editingBuyer)}
        buyer={editingBuyer}
        onClose={() => { setShowAddBuyer(false); setEditingBuyer(null); }}
        onAdd={editingBuyer ? handleUpdateBuyer : handleAddBuyer}
      />
    </div>
  );
}
