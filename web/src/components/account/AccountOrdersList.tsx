"use client";

import Link from "next/link";
import type { Order } from "@/types";
import { formatPrice } from "@/lib/format";
import { getOrderGrandTotal } from "@/lib/order-normalize";
import {
  useRealtimeOrders,
} from "@/lib/firebase/use-realtime-orders";

export function AccountOrdersList({
  userId,
  limit,
}: {
  userId: string;
  limit?: number;
}) {
  const { orders, loading, error } = useRealtimeOrders(userId);
  const visible = limit ? orders.slice(0, limit) : orders;

  if (loading && !orders.length) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-mohasti-cyan border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && !orders.length ? (
        <div className="card-elevated p-8 text-center text-red-700">
          <p>{error}</p>
        </div>
      ) : null}

      {!visible.length && !loading ? (
        <div className="card-elevated p-8 text-center text-gray-600">
          <p>No orders yet.</p>
          <Link
            href="/collections/all"
            className="mt-3 inline-block text-mohasti-teal underline"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {visible.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </ul>
      )}
    </div>
  );
}

function OrderRow({ order }: { order: Order }) {
  const statusColor =
    order.status === "paid" || order.status === "confirmed"
      ? "text-emerald-700 bg-emerald-50"
      : order.status === "failed"
        ? "text-red-700 bg-red-50"
        : "text-amber-700 bg-amber-50";

  const statusLabel =
    order.status === "pending_payment"
      ? "Awaiting payment"
      : order.status === "confirmed"
        ? "COD confirmed"
        : order.status.replace("_", " ");

  return (
    <li className="card-elevated flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="font-semibold text-mohasti-teal-dark">{order.id}</p>
        <p className="text-sm text-gray-600">{order.invoiceNumber}</p>
        <p className="mt-1 text-xs text-gray-500">
          {new Date(order.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColor}`}
        >
          {statusLabel}
        </span>
        <span className="font-semibold text-mohasti-teal">
          {formatPrice(getOrderGrandTotal(order))}
        </span>
        {(order.status === "paid" || order.status === "confirmed") && (
          <Link
            href={`/orders/${order.id}/invoice`}
            className="text-sm font-medium text-mohasti-teal hover:text-mohasti-cyan"
          >
            Invoice →
          </Link>
        )}
        {order.status === "pending_payment" && (
          <Link
            href={`/orders/${order.id}/pay`}
            className="text-sm font-medium text-amber-700 hover:text-amber-900"
          >
            Complete payment →
          </Link>
        )}
      </div>
    </li>
  );
}
