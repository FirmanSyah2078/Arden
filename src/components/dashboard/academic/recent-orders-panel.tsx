"use client"

import React, { useMemo, useState } from "react"
import { Search } from "lucide-react"

const ORDERS = [
  {
    plan: "Premium Plan",
    order: "IPC-PRM-#5374",
    date: "26th Sep, 2024",
    data: "15GB",
    price: "$181.50",
    status: "Delivered",
  },
  {
    plan: "Elite Exclusive Plan",
    order: "IPC-ELTE-#6847",
    date: "21st May, 2024",
    data: "11GB",
    price: "$160.60",
    status: "Awaiting Payment",
  },
  {
    plan: "Core Signature",
    order: "IPC-SGRT-#3699",
    date: "25th July, 2024",
    data: "25GB",
    price: "$217.50",
    status: "Cancelled",
  },
]

const STATUS_STYLES: Record<string, { dot: string; text: string; bg: string }> = {
  Delivered: { dot: "bg-emerald-400", text: "text-emerald-300", bg: "bg-emerald-400/10" },
  "Awaiting Payment": { dot: "bg-amber-400", text: "text-amber-300", bg: "bg-amber-400/10" },
  Cancelled: { dot: "bg-rose-400", text: "text-rose-300", bg: "bg-rose-400/10" },
}

export function RecentOrdersPanel() {
  const [search, setSearch] = useState("")

  const filteredOrders = useMemo(() => {
    if (!search.trim()) return ORDERS
    const q = search.toLowerCase()
    return ORDERS.filter(
      (o) =>
        o.plan.toLowerCase().includes(q) ||
        o.order.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <div className="mt-6 rounded-2xl border border-white/5 bg-[#0f0f12] shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-5 py-3.5">
        <h2 className="flex items-center gap-2 text-sm font-medium text-white">
          Recent Orders
          <span className="text-sm font-normal text-neutral-500">{ORDERS.length} Orders</span>
        </h2>
        <div className="flex w-64 items-center gap-2 rounded-lg border border-white/10 bg-white/3 px-3 py-2">
          <Search size={15} className="text-neutral-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-190 border-collapse text-sm">
          <thead>
            <tr className="bg-white/2 text-left text-xs tracking-wider text-neutral-500 uppercase">
              <th className="px-6 py-4 font-medium">Provider // Plan</th>
              <th className="px-6 py-4 font-medium">Order Number</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Data Amount</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o, i) => {
              const s = STATUS_STYLES[o.status]
              return (
                <tr key={i} className="border-b border-white/5 text-neutral-300 transition-colors last:border-0 hover:bg-white/2">
                  <td className="px-6 py-4">{o.plan}</td>
                  <td className="px-6 py-4 font-mono text-neutral-400">{o.order}</td>
                  <td className="px-6 py-4 text-neutral-400">{o.date}</td>
                  <td className="px-6 py-4 text-neutral-400">{o.data}</td>
                  <td className="px-6 py-4 text-neutral-400">{o.price}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border border-white/5 px-3 py-1.5 text-[11px] font-medium ${s.bg} ${s.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                      {o.status}
                    </span>
                  </td>
                </tr>
              )
            })}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-neutral-600">
                  No orders match "{search}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
