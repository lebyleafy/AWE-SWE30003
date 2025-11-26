// src/app/cart/CartItemControls.tsx
"use client";

import { useState } from "react";

export default function CartItemControls({
  cartItemId,
  initialQuantity,
}: {
  cartItemId: number;
  initialQuantity: number;
}) {
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [loading, setLoading] = useState(false);

  const updateQuantity = async (newQty: number) => {
    setLoading(true);
    const res = await fetch("/api/cart", {
      method: "PUT",
      body: JSON.stringify({ cartItemId, quantity: newQty }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    if (res.ok) {
      setQuantity(newQty);
      // optionally refresh or trigger SWR
    } else {
      alert("Failed to update quantity");
    }
  };

  const removeItem = async () => {
    if (!confirm("Remove item from cart?")) return;
    setLoading(true);
    const res = await fetch("/api/cart", {
      method: "DELETE",
      body: JSON.stringify({ cartItemId }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    if (res.ok) {
      // simple approach: reload the page (server-rendered cart)
      window.location.reload();
    } else {
      alert("Failed to remove item");
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border rounded">
        <button
          className="px-3 py-1"
          disabled={loading || quantity <= 1}
          onClick={() => updateQuantity(quantity - 1)}
        >
          -
        </button>
        <div className="px-4 py-1">{quantity}</div>
        <button
          className="px-3 py-1"
          disabled={loading}
          onClick={() => updateQuantity(quantity + 1)}
        >
          +
        </button>
      </div>

      <button onClick={removeItem} disabled={loading} className="text-sm text-red-600 hover:underline">
        Remove
      </button>
    </div>
  );
}
