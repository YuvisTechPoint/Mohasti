"use client";

import { Input, Select } from "@/components/ui/Input";
import type { ShippingAddress } from "@/types";

const INDIAN_STATES = [
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "Rajasthan",
  "West Bengal",
  "Uttar Pradesh",
  "Telangana",
  "Kerala",
  "Other",
];

export function CartShippingForm({
  shipping,
  onChange,
  compact = false,
}: {
  shipping: ShippingAddress;
  onChange: (field: keyof ShippingAddress, value: string) => void;
  compact?: boolean;
}) {
  return (
    <div className="card-elevated space-y-4 p-5">
      <div>
        <h2 className="font-display text-lg text-mohasti-teal">
          Delivery details
        </h2>
        <p className="mt-1 text-xs text-gray-600">
          Required to complete payment · saved on this device
        </p>
      </div>

      <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <Input
          label="Full Name"
          required
          value={shipping.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          className={compact ? "" : "sm:col-span-2"}
        />
        <Input
          label="Email"
          type="email"
          required
          value={shipping.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
        <Input
          label="Phone"
          type="tel"
          required
          value={shipping.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          placeholder="+91"
        />
        <Input
          label="Address"
          required
          value={shipping.addressLine1}
          onChange={(e) => onChange("addressLine1", e.target.value)}
          className={compact ? "" : "sm:col-span-2"}
        />
        <Input
          label="City"
          required
          value={shipping.city}
          onChange={(e) => onChange("city", e.target.value)}
        />
        <Select
          label="State"
          required
          value={shipping.state}
          onChange={(e) => onChange("state", e.target.value)}
        >
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Input
          label="Pincode"
          required
          value={shipping.pincode}
          onChange={(e) => onChange("pincode", e.target.value)}
          className={compact ? "" : "sm:col-span-2"}
        />
      </div>
    </div>
  );
}
