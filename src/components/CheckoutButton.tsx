"use client";

export default function CheckoutButton() {
  const handleCheckout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (res.ok) {
      window.location.href = `/orders/${data.orderId}`;
    } else {
      alert(data.error || "Checkout failed");
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="w-full bg-blue-600 text-white py-3 rounded mt-6 font-semibold"
    >
      Proceed to Checkout
    </button>
  );
}
