"use client";

import { Package, CheckCircle, Truck, Clock, XCircle } from "lucide-react";
import { MOCK_ORDERS } from "@/lib/mock";
import { OrderStatus } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";

const statusMeta: Record<OrderStatus, { label: string; icon: React.ReactNode; color: string }> = {
  PENDING: { label: "Pending", icon: <Clock size={13} />, color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20" },
  PROCESSING: { label: "Processing", icon: <Package size={13} />, color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" },
  SHIPPED: { label: "Shipped", icon: <Truck size={13} />, color: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20" },
  DELIVERED: { label: "Delivered", icon: <CheckCircle size={13} />, color: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20" },
  CANCELLED: { label: "Cancelled", icon: <XCircle size={13} />, color: "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20" },
};

export default function OrdersPage() {
  const orders = MOCK_ORDERS;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Orders</h1>
        <p className="text-sm text-neutral-500 mt-1">{orders.length} orders</p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={<Package size={32} />}
          title="No orders yet"
          description="Your orders will appear here after checkout."
          action={
            <Link href="/products" className="mt-1 px-4 py-2 text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity">
              Start shopping
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const meta = statusMeta[order.status];
            return (
              <div key={order.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs text-neutral-400 font-mono">{order.id}</p>
                    <p className="text-sm text-neutral-500 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${meta.color}`}>
                    {meta.icon}
                    {meta.label}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between text-sm">
                      <span className="text-neutral-700 dark:text-neutral-300">
                        {item.productName} <span className="text-neutral-400">×{item.quantity}</span>
                      </span>
                      <span className="font-medium text-neutral-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3 flex items-center justify-between">
                  <div className="text-xs text-neutral-400 truncate max-w-[60%]">
                    Ship to: {order.shippingAddress}
                  </div>
                  <span className="text-sm font-bold text-neutral-900 dark:text-white">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
