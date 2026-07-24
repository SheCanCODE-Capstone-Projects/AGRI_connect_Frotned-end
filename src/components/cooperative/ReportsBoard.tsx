"use client";

import { useState, useMemo } from "react";
import jsPDF from "jspdf";
import { useBuyers } from "@/lib/buyers";
import { useCooperativeData } from "@/lib/cooperative-data";
import { useLanguage } from "@/lib/LanguageContext";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type Action = "preview" | "export" | "share";

const COLORS = ["#16a34a", "#22c55e", "#4ade80", "#86efac", "#bbf7d0", "#dcfce3"];

export default function ReportsBoard() {
  const { t } = useLanguage();
  const { buyers } = useBuyers();
  const { products, inventory, orders } = useCooperativeData();

  const [action, setAction] = useState<Action>("preview");
  const [notice, setNotice] = useState("");

  // --- Dynamic Data Calculation ---

  const dynamicRevenueData = useMemo(() => {
    const monthTotals: Record<string, number> = {
      Aug: 6.8, Sep: 7.4, Oct: 8.1, Nov: 9.6, Dec: 10.2, Jan: 11.2 // defaults
    };
    
    // Add up real orders
    orders.forEach((o) => {
      const parts = o.date.split(" ");
      if (parts.length > 0) {
        const month = parts[0];
        const val = Number(o.amount.replace(/[^0-9]/g, "")) / 1000000;
        if (monthTotals[month] !== undefined) {
          monthTotals[month] += val;
        } else {
          monthTotals[month] = val;
        }
      }
    });
    
    return Object.entries(monthTotals)
      .map(([month, revenue]) => ({ month, revenue: Number(revenue.toFixed(2)) }))
      .slice(-6); // take last 6 months
  }, [orders]);

  const dynamicTopProducts = useMemo(() => {
    // Generate from inventory / products if available
    let totalStock = 0;
    const items = inventory.map(item => {
      const val = Number(item.stock.replace(/[^0-9]/g, ""));
      totalStock += val;
      return { name: t.productNames[item.name as keyof typeof t.productNames] || item.name, value: val };
    });
    
    if (totalStock === 0) return [
      { name: t.categories["Vegetables"], value: 40, color: COLORS[0] },
      { name: t.categories["Grains"], value: 30, color: COLORS[1] },
      { name: t.categories["Dairy"], value: 30, color: COLORS[2] }
    ];

    items.sort((a, b) => b.value - a.value);
    const top = items.slice(0, 4);
    const otherVal = items.slice(4).reduce((sum, item) => sum + item.value, 0);
    if (otherVal > 0) top.push({ name: "Other", value: otherVal });

    return top.map((item, idx) => ({
      ...item,
      value: Math.round((item.value / totalStock) * 100),
      color: COLORS[idx % COLORS.length]
    }));
  }, [inventory, t]);

  const totalRevenueNumber = buyers.reduce((sum, buyer) => sum + Number(buyer.spend.replace(/[^0-9]/g, "")), 0);
  const totalRevenueString = `RWF ${totalRevenueNumber.toLocaleString()}`;

  const reportData = {
    cooperative: "AGRI Connect Cooperative",
    generated: new Date().toLocaleDateString(),
    totalProducts: products.length,
    totalStock: `${inventory.reduce((sum, item) => sum + Number(item.available.replace(/[^0-9]/g, "")), 0)} kg`,
    totalOrders: orders.length,
    revenue: totalRevenueString,
  };

  const activeBuyers = buyers.filter((buyer) => buyer.active);
  const bestBuyer = buyers.reduce<(typeof buyers)[number] | null>(
    (top, buyer) => {
      if (!top || buyer.reliability > top.reliability) return buyer;
      return top;
    },
    buyers[0] ?? null
  );

  function downloadPDF() {
    setAction("preview");
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text("AGRI Connect Cooperative Report", 20, 20);
    
    // Info
    doc.setFontSize(12);
    doc.text(`Generated: ${reportData.generated}`, 20, 35);
    doc.text(`Total Products: ${reportData.totalProducts}`, 20, 45);
    doc.text(`Total Stock: ${reportData.totalStock}`, 20, 55);
    doc.text(`Total Orders: ${reportData.totalOrders}`, 20, 65);
    doc.text(`Revenue: ${reportData.revenue}`, 20, 75);

    // Buyers Table Header
    doc.setFontSize(14);
    doc.text("Top Buyers Summary", 20, 95);
    
    doc.setFontSize(10);
    let startY = 105;
    const rowHeight = 10;
    
    // Table Headers
    doc.setFont("helvetica", "bold");
    doc.text(t.reportsBoard.buyer, 20, startY);
    doc.text(t.reportsBoard.location, 70, startY);
    doc.text(t.reportsBoard.orders, 110, startY);
    doc.text(t.reportsBoard.spend, 130, startY);
    doc.text(t.reportsBoard.reliability, 170, startY);
    
    doc.setLineWidth(0.5);
    doc.line(20, startY + 2, 190, startY + 2);
    
    // Table Rows
    doc.setFont("helvetica", "normal");
    buyers.forEach((b) => {
      startY += rowHeight;
      doc.text(b.name.substring(0, 20), 20, startY);
      doc.text(b.location, 70, startY);
      doc.text(b.orders.toString(), 110, startY);
      doc.text(b.spend, 130, startY);
      doc.text(b.reliability + "%", 170, startY);
    });

    doc.save("agri-report.pdf");
    setNotice(t.reportsBoard.pdfDownloaded);
  }

  function downloadCSV() {
    setAction("export");
    
    // Header Data
    const rows = [
      ["Report", "Value"],
      ["Cooperative", reportData.cooperative],
      ["Generated", reportData.generated],
      ["Total Products", reportData.totalProducts.toString()],
      ["Total Stock", reportData.totalStock],
      ["Total Orders", reportData.totalOrders.toString()],
      ["Revenue", reportData.revenue],
      [],
      [t.reportsBoard.buyer, t.reportsBoard.location, t.reportsBoard.orders, t.reportsBoard.spend, t.reportsBoard.reliability]
    ];
    
    // Append Buyer Data
    buyers.forEach((b) => {
      rows.push([b.name, b.location, b.orders.toString(), b.spend, b.reliability + "%"]);
    });

    const csv = rows.map((row) => `"${row.join('","')}"`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "agri-report.csv";
    link.click();
    URL.revokeObjectURL(url);
    
    setNotice(t.reportsBoard.csvDownloaded);
  }

  async function shareReport() {
    const shareData = { title: "AGRI Connect Cooperative Report", text: `Cooperative report generated ${reportData.generated}. Revenue: ${reportData.revenue}.` };
    setAction("share");
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setNotice(t.reportsBoard.shareSheetOpened);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.text);
        setNotice(t.reportsBoard.shareCopied);
      } else {
        setNotice(t.reportsBoard.shareUnavailable);
      }
    } catch (error) {
      if ((error as DOMException).name !== "AbortError") setNotice(t.reportsBoard.shareFailed);
    }
  }

  const actionCopy: Record<Action, { title: string; body: string }> = {
    preview: { title: t.reportsBoard.previewPdfTitle, body: t.reportsBoard.previewPdfBody },
    export: { title: t.reportsBoard.exportCsvTitle, body: t.reportsBoard.exportCsvBody },
    share: { title: t.reportsBoard.shareReportTitle, body: t.reportsBoard.shareReportBody },
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs text-gray-400 dark:text-green-100/50">
            {t.reportsBoard.subtitle}
          </p>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            {t.reportsBoard.title}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={downloadPDF} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-green-100/70 dark:hover:bg-white/5">
            {t.reportsBoard.downloadPdf}
          </button>
          <button onClick={downloadCSV} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-green-100/70 dark:hover:bg-white/5">
            {t.reportsBoard.downloadCsv}
          </button>
          <button onClick={shareReport} className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700">
            {t.reportsBoard.shareReport}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-green-100 bg-green-50/80 px-4 py-3 text-sm text-green-900 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-100">
        {notice || `${actionCopy[action].title} ${t.reportsBoard.readyMessage}`}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-5 dark:bg-[#112d1a] dark:ring-white/10">
          <h2 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white">
            {t.reportsBoard.revenueTrend}
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={dynamicRevenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} unit="M" />
              <Tooltip formatter={(value: number) => [`RWF ${value}M`, "Revenue"]} />
              <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4, fill: "#16a34a" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-5 dark:bg-[#112d1a] dark:ring-white/10">
          <h2 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white">
            {t.reportsBoard.topSellingProducts}
          </h2>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={dynamicTopProducts} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {dynamicTopProducts.map((product, index) => (
                    <Cell key={index} fill={product.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <ul className="w-full space-y-2 text-xs sm:w-auto">
              {dynamicTopProducts.map(product => (
                <li key={product.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: product.color }} />
                  <span className="text-gray-600 dark:text-green-100/70">{product.name}</span>
                  <span className="ml-auto font-semibold text-gray-900 dark:text-white">{product.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-[#112d1a] dark:ring-white/10">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-white">{actionCopy[action].title}</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-green-100/60">{actionCopy[action].body}</p>
        <div className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-gray-400 dark:text-green-100/50">{t.reportsBoard.bestBuyer}</p>
            <p className="font-semibold text-gray-900 dark:text-white">{bestBuyer?.name ?? t.reportsBoard.noBuyersYet}</p>
          </div>
          <div>
            <p className="text-gray-400 dark:text-green-100/50">{t.reportsBoard.topRevenue}</p>
            <p className="font-semibold text-gray-900 dark:text-white">{totalRevenueString}</p>
          </div>
          <div>
            <p className="text-gray-400 dark:text-green-100/50">{t.reportsBoard.activeBuyers}</p>
            <p className="font-semibold text-gray-900 dark:text-white">{activeBuyers.length}</p>
          </div>
        </div>
      </div>

      {/* Desktop / Mobile Buyers */}
      <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 md:block dark:bg-[#112d1a] dark:ring-white/10">
        <div className="grid grid-cols-12 gap-4 border-b border-gray-100 bg-gray-50/50 px-5 py-3 text-xs font-semibold text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-green-100/50">
          <div className="col-span-4">{t.reportsBoard.buyer}</div>
          <div className="col-span-3">{t.reportsBoard.location}</div>
          <div className="col-span-2">{t.reportsBoard.orders}</div>
          <div className="col-span-2">{t.reportsBoard.spend}</div>
          <div className="col-span-1 text-right">{t.reportsBoard.reliability}</div>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-white/10">
          {buyers.map((buyer) => (
            <div key={buyer.name} className="grid grid-cols-12 items-center gap-4 px-5 py-4 text-sm hover:bg-gray-50 dark:hover:bg-white/5">
              <div className="col-span-4 font-semibold text-gray-900 dark:text-white">{buyer.name}</div>
              <div className="col-span-3 text-gray-600 dark:text-green-100/70">{buyer.location}</div>
              <div className="col-span-2 text-gray-600 dark:text-green-100/70">{buyer.orders}</div>
              <div className="col-span-2 font-medium text-gray-900 dark:text-white">{buyer.spend}</div>
              <div className="col-span-1 text-right font-medium text-gray-900 dark:text-white">{buyer.reliability}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {buyers.map((buyer) => (
          <article key={buyer.name} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-[#112d1a] dark:ring-white/10">
            <p className="font-semibold text-gray-900 dark:text-white">{buyer.name}</p>
            <p className="text-xs text-gray-400">{buyer.location}</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-gray-400">{t.reportsBoard.orders}</p>
                <p className="font-semibold">{buyer.orders}</p>
              </div>
              <div>
                <p className="text-gray-400">{t.reportsBoard.spend}</p>
                <p className="font-semibold">{buyer.spend}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
