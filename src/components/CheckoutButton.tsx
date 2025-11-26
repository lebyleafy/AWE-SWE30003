"use client";

import Link from "next/link";

export default function CheckoutButton() {
  return (
    <Link
      href="/checkout"
      className="block w-full bg-blue-600 text-white py-3 rounded mt-6 font-semibold text-center hover:bg-blue-700 transition"
    >
      Proceed to Checkout
    </Link>
  );
}
