"use client";

import { useMemo, useState } from "react";
import { useCooperativeData } from "@/lib/cooperative-data";
import { useLanguage } from "@/lib/LanguageContext";

type OrderStatus = "Delivered" | "Dispatched" | "Preparing";

type OrderItem = {
  id: string;
  buyer: string;
  product: string;
  amount: string;
  date: string;
  status: OrderStatus;
  steps: string[];
  current: number;
};

const statusColor = {
  Delivered: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
  Dispatched: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  Preparing: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
};

// ─── Add Order Modal ────────────────────────────────────────────────────────
function AddOrderModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: { buyer: string; product: string; amount: string; date: string }) => void;
}) {
  const { t } = useLanguage();
  const [buyer, setBuyer] = useState("");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
  );
  const [error, setError] = useState("");

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!buyer.trim() || !product.trim() || !amount.trim()) {
      setError(t.orders?.addModalError ?? "Please fill in all required fields.");
      return;
    }
    onSave({ buyer: buyer.trim(), product: product.trim(), amount: amount.trim(), date });
    setBuyer(""); setProduct(""); setAmount(""); setError("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-[#112d1a]"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t.orders?.addModalTitle ?? "New Order"}
          </h2>
          <button type="button" onClick={onClose} className="text-2xl text-gray-400 hover:text-red-500">×</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white">
              {t.orders?.labelBuyer ?? "Buyer"} *
            </label>
            <input
              value={buyer}
              onChange={(e) => setBuyer(e.target.value)}
              placeholder="e.g. Kigali Serena Hotel"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-green-600 dark:border-white/10 dark:bg-[#1b3a26] dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white">
              {t.orders?.labelItem ?? "Product"} *
            </label>
            <input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="e.g. White Rice · 200 kg"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-green-600 dark:border-white/10 dark:bg-[#1b3a26] dark:text-white"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white">
                {t.orders?.labelAmount ?? "Amount"} *
              </label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="RWF 360,000"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-green-600 dark:border-white/10 dark:bg-[#1b3a26] dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white">
                Date
              </label>
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-green-600 dark:border-white/10 dark:bg-[#1b3a26] dark:text-white"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2 font-medium dark:border-white/10 dark:text-white"
          >
            {t.orders?.addModalCancel ?? "Cancel"}
          </button>
          <button
            type="submit"
            className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700"
          >
            {t.orders?.addModalSave ?? "Add Order"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Main Board ─────────────────────────────────────────────────────────────
export default function OrdersBoard() {
  const { t } = useLanguage();
  const { orders, addOrder, deleteOrder, advanceOrder, reverseOrder } = useCooperativeData();

  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(orders[0] ?? null);
  const [panel, setPanel] = useState<"invoice" | "track">("invoice");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);

  const stepTranslations: Record<string, string> = {
    Pending: t.orders.stepPending,
    Accepted: t.orders.stepAccepted,
    Preparing: t.orders.stepPreparing,
    Dispatched: t.orders.stepDispatched,
    Delivered: t.orders.stepDelivered,
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.buyer.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filter === "All" || order.status === filter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, filter]);

  const total = orders.length;
  const pending = orders.filter((o) => o.status === "Pending").length;
  const accepted = orders.filter((o) => o.status === "Accepted").length;
  const preparing = orders.filter((o) => o.status === "Preparing").length;
  const dispatched = orders.filter((o) => o.status === "Dispatched").length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;

  const statusLabel: Record<string, string> = {
    Pending: t.orders?.stepPending ?? "Pending",
    Accepted: t.orders?.stepAccepted ?? "Accepted",
    Preparing: t.orders.statusPreparing,
    Dispatched: t.orders.statusDispatched,
    Delivered: t.orders.statusDelivered,
  };

  function handleAdvance(order: OrderItem) {
    advanceOrder(order.id);
    // Keep selected order in sync
    if (selectedOrder?.id === order.id) {
      const next = Math.min(order.current + 1, order.steps.length - 1);
      const statusMap: Record<number, OrderStatus> = { 0: "Pending", 1: "Accepted", 2: "Preparing", 3: "Dispatched", 4: "Delivered" };
      setSelectedOrder({ ...order, current: next, status: statusMap[next] ?? order.status });
    }
  }

  function handleReverse(order: OrderItem) {
    reverseOrder(order.id);
    if (selectedOrder?.id === order.id) {
      const next = Math.max(order.current - 1, 0);
      const statusMap: Record<number, OrderStatus> = { 0: "Pending", 1: "Accepted", 2: "Preparing", 3: "Dispatched", 4: "Delivered" };
      setSelectedOrder({ ...order, current: next, status: statusMap[next] ?? order.status });
    }
  }

  function handleDelete(id: string) {
    if (!confirm(t.orders?.confirmDelete ?? "Delete this order?")) return;
    deleteOrder(id);
    if (selectedOrder?.id === id) setSelectedOrder(orders.find((o) => o.id !== id) ?? null);
  }

  function handleAdd(data: { buyer: string; product: string; amount: string; date: string }) {
    addOrder(data);
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-400 dark:text-green-100/50">{t.orders.subtitle}</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.orders.title}</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          + {t.orders?.addModalTitle ?? "New Order"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
        {([
          [t.orders.statTotal, total],
          [t.orders?.stepPending ?? "Pending", pending],
          [t.orders?.stepAccepted ?? "Accepted", accepted],
          [t.orders.statPreparing, preparing],
          [t.orders.statDispatched, dispatched],
          [t.orders.statDelivered, delivered],
        ] as [string, number][]).map(([title, value]) => (
          <div key={title} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-[#112d1a] dark:ring-white/10">
            <p className="text-sm text-gray-400 dark:text-green-100/50">{title}</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{value}</h2>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.orders.searchPlaceholder}
          className="flex-1 rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-green-600 dark:border-white/10 dark:bg-[#112d1a] dark:text-white"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-green-600 dark:border-white/10 dark:bg-[#112d1a] dark:text-white"
        >
          <option value="All">{t.orders.filterAll}</option>
          <option value="Pending">{t.orders?.stepPending ?? "Pending"}</option>
          <option value="Accepted">{t.orders?.stepAccepted ?? "Accepted"}</option>
          <option value="Preparing">{t.orders.filterPreparing}</option>
          <option value="Dispatched">{t.orders.filterDispatched}</option>
          <option value="Delivered">{t.orders.filterDelivered}</option>
        </select>
      </div>

      {/* Orders list */}
      <div className="space-y-4">
        {filteredOrders.length === 0 && (
          <div className="rounded-xl bg-white p-8 text-center text-sm text-gray-500 shadow-sm ring-1 ring-gray-100 dark:bg-[#112d1a] dark:text-green-100/60 dark:ring-white/10">
            {t.orders.noOrders}
          </div>
        )}

        {filteredOrders.map((order) => {
          const isDelivered = order.current === order.steps.length - 1;
          return (
            <div key={order.id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-[#112d1a] dark:ring-white/10">

              {/* Top row */}
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-gray-900 dark:text-white">{order.id}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[order.status]}`}>
                      {statusLabel[order.status]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-green-100/50">{order.buyer} · {order.product}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="font-bold text-gray-900 dark:text-white">{order.amount}</p>
                  <p className="text-xs text-gray-400">{order.date}</p>
                </div>
              </div>

              {/* Progress steps */}
              <div className="mt-5 overflow-x-auto">
                <div className="flex min-w-[500px] items-center">
                  {order.steps.map((step, index) => (
                    <div key={step} className="flex flex-1 items-center">
                      <div className="text-center">
                        <div className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                          index <= order.current ? "bg-green-600 text-white" : "bg-gray-200 text-gray-400 dark:bg-white/10"
                        }`}>
                          {index + 1}
                        </div>
                        <p className="mt-1 text-[10px] text-gray-400">{stepTranslations[step] ?? step}</p>
                      </div>
                      {index < order.steps.length - 1 && (
                        <div className={`h-0.5 flex-1 ${index < order.current ? "bg-green-600" : "bg-gray-200 dark:bg-white/10"}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button onClick={() => { setSelectedOrder(order); setPanel("invoice"); }}
                  className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {t.orders.invoice}
                </button>
                <button onClick={() => { setSelectedOrder(order); setPanel("track"); }}
                  className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {t.orders.track}
                </button>

                {/* Cancel Advance button */}
                {order.current > 0 && (
                  <button
                    onClick={() => handleReverse(order)}
                    className="ml-auto rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
                  >
                    ← Cancel Advance
                  </button>
                )}

                {/* Advance status */}
                {!isDelivered && (
                  <button
                    onClick={() => handleAdvance(order)}
                    className={`${order.current > 0 ? "" : "ml-auto"} rounded-lg bg-green-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700`}
                  >
                    {t.orders?.advanceStatus ?? "Advance →"}
                  </button>
                )}

                {/* Delete */}
                <button
                  onClick={() => handleDelete(order.id)}
                  className={`${!isDelivered ? "" : "ml-auto"} rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700`}
                >
                  {t.orders?.deleteOrder ?? "Delete"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail panel */}
      {selectedOrder && (
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-[#112d1a] dark:ring-white/10">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {panel === "invoice" ? t.orders.invoicePreview : t.orders.trackingDetails}
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-gray-400">{t.orders.labelOrder}</p>
              <p className="font-semibold text-gray-900 dark:text-white">{selectedOrder.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">{t.orders.labelBuyer}</p>
              <p className="font-semibold text-gray-900 dark:text-white">{selectedOrder.buyer}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">{t.orders.labelAmount}</p>
              <p className="font-semibold text-gray-900 dark:text-white">{selectedOrder.amount}</p>
            </div>
          </div>

          {panel === "invoice" ? (
            <div className="mt-5 rounded-lg bg-gray-50 p-4 text-sm dark:bg-white/5">
              <div className="flex justify-between">
                <span className="text-gray-400">{t.orders.labelOrderTotal}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{selectedOrder.amount}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="text-gray-400">{t.orders.labelItem}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{selectedOrder.product}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="text-gray-400">{t.orders.labelInvoiceStatus}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{statusLabel[selectedOrder.status]}</span>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-lg bg-gray-50 p-4 dark:bg-white/5">
              <p className="text-xs text-gray-400">{t.orders.labelCurrentStage}</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {stepTranslations[selectedOrder.steps[selectedOrder.current]] ?? selectedOrder.steps[selectedOrder.current]}
              </p>
            </div>
          )}
        </div>
      )}

      <AddOrderModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAdd}
      />

    </div>
  );
}
