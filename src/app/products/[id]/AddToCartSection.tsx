// src/app/products/[id]/AddToCartSection.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddToCartSection({ productId }: { productId: number }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const addToCart = async () => {
    if (!session) {
      router.push("/signin");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity: 1 }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    if (res.ok) {
      // optionally show toast
      alert("Added to cart");
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data?.error || "Failed to add to cart");
    }
  };

  const buyNow = async () => {
    if (!session) {
      router.push("/signin");
      return;
    }
    setLoading(true);
    await fetch("/api/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity: 1 }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    router.push("/cart"); // or /checkout
  };

  return (
    <div className="flex items-center gap-4 mt-6">
      <button
        onClick={addToCart}
        disabled={loading}
        className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition shadow"
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>

      <button
        onClick={buyNow}
        disabled={loading}
        className="bg-green-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-green-700 transition shadow"
      >
        {loading ? "Processing..." : "Buy Now"}
      </button>
    </div>
  );
}
