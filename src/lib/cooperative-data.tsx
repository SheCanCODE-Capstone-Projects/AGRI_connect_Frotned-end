"use client";

import { createContext, useContext, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";

export type Buyer = {
  initials: string;
  name: string;
  location: string;
  orders: number;
  spend: string;
  reliability: number;
  active: boolean;
};

export type ProductItemType = {
  id: number;
  name: string;
  tag: string;
  price: string;
  weight: string;
  description: string;
  status: "Healthy" | "Low" | "Out";
  published: boolean;
  imageUrl?: string; // base64 data URL from file upload
};

export type InventoryItem = {
  name: string;
  category: string;
  stock: string;
  available: string;
  status: "Healthy" | "Low" | "Out";
  updated: string;
};

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

export type OrderStatus = "Delivered" | "Dispatched" | "Preparing" | "Accepted" | "Pending";

export type OrderItem = {
  id: string;
  buyer: string;
  product: string;
  amount: string;
  date: string;
  status: OrderStatus;
  steps: string[];
  current: number;
};

type CooperativeDataState = {
  buyers: Buyer[];
  products: ProductItemType[];
  inventory: InventoryItem[];
  members: Member[];
  orders: OrderItem[];
};

type CooperativeDataContextValue = CooperativeDataState & {
  addBuyer: (buyer: Buyer) => void;
  updateBuyer: (previousName: string, updatedBuyer: Buyer) => void;
  deleteBuyer: (name: string) => void;
  addProduct: (product: ProductItemType) => void;
  toggleProductPublish: (id: number) => void;
  addInventoryItem: (item: InventoryItem) => boolean;
  updateInventoryItem: (name: string, updatedItem: InventoryItem) => void;
  deleteInventoryItem: (name: string) => void;
  refreshInventoryItem: (name: string) => void;
  addMember: (member: Omit<Member, "id" | "color">) => void;
  setOrders: Dispatch<SetStateAction<OrderItem[]>>;
  addOrder: (order: Omit<OrderItem, "id" | "steps" | "current" | "status">) => void;
  deleteOrder: (id: string) => void;
  advanceOrder: (id: string) => void;
  reverseOrder: (id: string) => void;
};

const STORAGE_KEY = "agriconnect.cooperativeData";

const initialState: CooperativeDataState = {
  buyers: [
    { initials: "AR", name: "ABC Restaurant", location: "Kigali", orders: 12, spend: "RWF 1,148,000", reliability: 96, active: true },
    { initials: "KS", name: "Kigali Serena Hotel", location: "Kigali", orders: 8, spend: "RWF 960,000", reliability: 88, active: true },
    { initials: "SJ", name: "St. Joseph School", location: "Musanze", orders: 5, spend: "RWF 400,000", reliability: 91, active: true },
    { initials: "RG", name: "Rwanda Green Mart", location: "Huye", orders: 21, spend: "RWF 2,120,000", reliability: 76, active: true },
    { initials: "MH", name: "Horizon Hotel", location: "Rubavu", orders: 3, spend: "RWF 280,000", reliability: 61, active: false },
  ],
  products: [
    { id: 1, name: "Premium Beans", tag: "1 kg/pack", price: "RWF 1,990/kg", weight: "850 kg", description: "Fresh premium beans harvested this season.", status: "Healthy", published: true },
    { id: 2, name: "White Rice", tag: "Grains", price: "RWF 10,830/kg", weight: "420 kg", description: "High quality white rice.", status: "Healthy", published: true },
    { id: 3, name: "Sweet Potatoes", tag: "Root Veg", price: "RWF 9,700/kg", weight: "95 kg", description: "Fresh sweet potatoes.", status: "Low", published: true },
    { id: 4, name: "Green Cabbage", tag: "Vegetables", price: "RWF 1,960/kg", weight: "218 kg", description: "Organic green cabbage.", status: "Healthy", published: true },
    { id: 5, name: "Maize Flour", tag: "Grains", price: "RWF 4,150/kg", weight: "18 kg", description: "Fine maize flour.", status: "Low", published: false },
    { id: 6, name: "Tomatoes", tag: "Vegetables", price: "RWF 4,880/kg", weight: "8 kg", description: "Fresh tomatoes.", status: "Out", published: true },
  ],
  inventory: [
    { name: "Premium Beans", category: "Legumes", stock: "850 kg", available: "680 kg", status: "Healthy", updated: "2 hrs ago" },
    { name: "White Rice", category: "Grains", stock: "428 kg", available: "350 kg", status: "Healthy", updated: "1 hr ago" },
    { name: "Sweet Potatoes", category: "Root Veg", stock: "95 kg", available: "50 kg", status: "Low", updated: "1 hr ago" },
    { name: "Green Cabbage", category: "Vegetables", stock: "218 kg", available: "190 kg", status: "Healthy", updated: "1 hr ago" },
    { name: "Maize Flour", category: "Grains", stock: "18 kg", available: "18 kg", status: "Low", updated: "40 mins ago" },
    { name: "Tomatoes", category: "Vegetables", stock: "0 kg", available: "0 kg", status: "Out", updated: "20 mins ago" },
  ],
  members: [
    { id: "M-001", name: "Uwase Marie Claire", phone: "+250 788 111 220", village: "Kinigi", crop: "Potatoes", status: "Active", color: "bg-green-600" },
    { id: "M-002", name: "Habimana Jean Bosco", phone: "+250 788 342 118", village: "Cyuve", crop: "Coffee", status: "Active", color: "bg-emerald-600" },
    { id: "M-003", name: "Nyiraneza Alice", phone: "+250 722 908 441", village: "Gataraga", crop: "Tomatoes", status: "Active", color: "bg-lime-600" },
    { id: "M-004", name: "Mugisha Emmanuel", phone: "+250 788 654 021", village: "Nyange", crop: "Milk", status: "Active", color: "bg-teal-600" },
    { id: "M-005", name: "Ingabire Solange", phone: "+250 733 220 887", village: "Shingiro", crop: "Sweet Potatoes", status: "Pending", color: "bg-green-700" },
    { id: "M-006", name: "Rukundo Patrick", phone: "+250 788 044 512", village: "Musanze", crop: "Beans", status: "Active", color: "bg-emerald-700" },
    { id: "M-007", name: "Mukamana Josephine", phone: "+250 722 771 903", village: "Nkotsi", crop: "Coffee", status: "Active", color: "bg-lime-700" },
    { id: "M-008", name: "Bizimana Eric", phone: "+250 788 559 340", village: "Busogo", crop: "Potatoes", status: "Inactive", color: "bg-gray-500" },
  ],
  orders: [
    { id: "ORD-001", buyer: "St. Joseph School", product: "Maize Flour · 1 kg", amount: "RWF 15,200", date: "Jul 1", status: "Delivered", steps: ["Pending", "Accepted", "Preparing", "Dispatched", "Delivered"], current: 4 },
    { id: "ORD-002", buyer: "Kigali Serena Hotel", product: "Mixed Vegetables · 500 kg", amount: "RWF 420,000", date: "Jul 29", status: "Dispatched", steps: ["Pending", "Accepted", "Preparing", "Dispatched", "Delivered"], current: 3 },
    { id: "ORD-003", buyer: "Rwanda Green Mart", product: "White Rice · 200 kg", amount: "RWF 360,000", date: "Aug 1", status: "Preparing", steps: ["Pending", "Accepted", "Preparing", "Dispatched", "Delivered"], current: 2 },
  ],
};

function makeInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function readStoredState(): CooperativeDataState {
  if (typeof window === "undefined") {
    return initialState;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return initialState;
    }

    const parsed = JSON.parse(raw) as Partial<CooperativeDataState>;
    return {
      buyers: Array.isArray(parsed.buyers)
        ? parsed.buyers.map((buyer) => ({ ...buyer, initials: buyer.initials || makeInitials(buyer.name) }))
        : initialState.buyers,
      products: Array.isArray(parsed.products) ? parsed.products : initialState.products,
      inventory: Array.isArray(parsed.inventory) ? parsed.inventory : initialState.inventory,
      members: Array.isArray(parsed.members) ? parsed.members : initialState.members,
      orders: Array.isArray(parsed.orders) ? parsed.orders : initialState.orders,
    };
  } catch {
    return initialState;
  }
}

const CooperativeDataContext = createContext<CooperativeDataContextValue | null>(null);

export function CooperativeDataProvider({ children }: { children: React.ReactNode }) {
  const [buyers, setBuyers] = useState<Buyer[]>(initialState.buyers);
  const [products, setProducts] = useState<ProductItemType[]>(initialState.products);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialState.inventory);
  const [members, setMembers] = useState<Member[]>(initialState.members);
  const [orders, setOrders] = useState<OrderItem[]>(initialState.orders);

  useEffect(() => {
    const stored = readStoredState();
    setBuyers(stored.buyers);
    setProducts(stored.products);
    setInventory(stored.inventory);
    setMembers(stored.members);
    setOrders(stored.orders);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ buyers, products, inventory, members, orders })
    );
  }, [buyers, products, inventory, members, orders]);

  const value = useMemo<CooperativeDataContextValue>(
    () => ({
      buyers,
      products,
      inventory,
      members,
      orders,
      addBuyer: (buyer) =>
        setBuyers((current) => [
          ...current,
          { ...buyer, initials: buyer.initials || makeInitials(buyer.name) },
        ]),
      updateBuyer: (previousName, updatedBuyer) =>
        setBuyers((current) =>
          current.map((buyer) =>
            buyer.name === previousName
              ? { ...updatedBuyer, initials: updatedBuyer.initials || makeInitials(updatedBuyer.name) }
              : buyer
          )
        ),
      deleteBuyer: (name) => setBuyers((current) => current.filter((buyer) => buyer.name !== name)),
      addProduct: (product) => setProducts((current) => [...current, product]),
      toggleProductPublish: (id) =>
        setProducts((current) =>
          current.map((product) =>
            product.id === id ? { ...product, published: !product.published } : product
          )
        ),
      addInventoryItem: (item) => {
        const exists = inventory.some((existing) => existing.name.toLowerCase() === item.name.toLowerCase());
        if (exists) return false;
        setInventory((current) => [...current, item]);
        return true;
      },
      updateInventoryItem: (name, updatedItem) =>
        setInventory((current) => current.map((item) => (item.name === name ? updatedItem : item))),
      deleteInventoryItem: (name) =>
        setInventory((current) => current.filter((item) => item.name !== name)),
      refreshInventoryItem: (name) =>
        setInventory((current) =>
          current.map((item) => (item.name === name ? { ...item, updated: "Just now" } : item))
        ),
      addMember: (member) =>
        setMembers((current) => {
          const id = `M-${String(current.length + 1).padStart(3, "0")}`;
          return [...current, { ...member, id, color: "bg-green-600" }];
        }),
      setOrders,
      addOrder: ({ buyer, product, amount, date }) =>
        setOrders((current) => {
          const id = `ORD-${String(current.length + 1).padStart(3, "0")}`;
          return [
            ...current,
            {
              id,
              buyer,
              product,
              amount,
              date,
              status: "Preparing",
              steps: ["Pending", "Accepted", "Preparing", "Dispatched", "Delivered"],
              current: 2, // starts at Preparing
            },
          ];
        }),
      deleteOrder: (id) =>
        setOrders((current) => current.filter((o) => o.id !== id)),
      advanceOrder: (id) =>
        setOrders((current) =>
          current.map((o) => {
            if (o.id !== id) return o;
            const next = Math.min(o.current + 1, o.steps.length - 1);
            const statusMap: Record<number, OrderStatus> = {
              0: "Pending",
              1: "Accepted",
              2: "Preparing",
              3: "Dispatched",
              4: "Delivered",
            };
            return {
              ...o,
              current: next,
              status: (statusMap[next] ?? o.status) as OrderStatus,
            };
          })
        ),
      reverseOrder: (id) =>
        setOrders((current) =>
          current.map((o) => {
            if (o.id !== id) return o;
            // Allow reversing down to 'Pending' (index 0)
            const next = Math.max(o.current - 1, 0);
            const statusMap: Record<number, OrderStatus> = {
              0: "Pending",
              1: "Accepted",
              2: "Preparing",
              3: "Dispatched",
              4: "Delivered",
            };
            return {
              ...o,
              current: next,
              status: (statusMap[next] ?? o.status) as OrderStatus,
            };
          })
        ),
    }),
    [buyers, products, inventory, members, orders]
  );

  return <CooperativeDataContext.Provider value={value}>{children}</CooperativeDataContext.Provider>;
}

export function useCooperativeData() {
  const context = useContext(CooperativeDataContext);

  if (!context) {
    throw new Error("useCooperativeData must be used within a CooperativeDataProvider");
  }

  return context;
}
