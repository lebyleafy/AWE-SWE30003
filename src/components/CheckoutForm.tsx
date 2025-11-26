"use client";

import { useState } from "react";

export default function CheckoutForm({ total }: { total: number }) {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const placeOrder = async () => {
    setLoading(true);

    if (paymentMethod === "cod") {
      // COD — direct order
      const res = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ address, paymentMethod }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        window.location.href = `/orders/${data.orderId}`;
      } else {
        alert(data.error || "Checkout failed");
      }
    } else {
      // STRIPE PAYMENT
      const res = await fetch("/api/stripe", {
        method: "POST",
        body: JSON.stringify({ address }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        window.location.href = data.url; // Stripe Checkout URL
      } else {
        alert(data.error || "Stripe error");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Shipping */}
      <div>
        <label className="text-sm font-medium">Shipping Address</label>
        <textarea
          className="border rounded p-2 w-full h-24 mt-2"
          placeholder="Enter your address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      {/* Payment Method */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Payment Method</h3>

        <label className="flex items-center gap-3">
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
          />
          <span>Cash on Delivery (COD)</span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="radio"
            name="payment"
            value="stripe"
            checked={paymentMethod === "stripe"}
            onChange={() => setPaymentMethod("stripe")}
          />
          <span>Credit/Debit Card (Stripe — Dev Mode)</span>
        </label>
      </div>

      {/* Place Order */}
      <button
        disabled={loading}
        onClick={placeOrder}
        className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition"
      >
        {loading ? "Processing..." : `Place Order — $${total.toFixed(2)}`}
      </button>
    </div>
  );
}
