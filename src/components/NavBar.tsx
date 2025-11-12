"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Brand Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          AWE<span className="text-gray-800">Electronics</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 text-gray-700 font-medium">
          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <Link href="/products" className="hover:text-blue-600 transition">
            Products
          </Link>
          <Link href="/about" className="hover:text-blue-600 transition">
            About
          </Link>
          <Link href="/sign-in" className="hover:text-blue-600 transition">
            sign-in
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-blue-600 transition" />
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
              0
            </span>
          </Link>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="flex flex-col p-4 space-y-2 text-gray-700">
            <Link href="/" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link href="/products" onClick={() => setIsOpen(false)}>
              Products
            </Link>
            <Link href="/about" onClick={() => setIsOpen(false)}>
              About
            </Link>
            <Link href="/sign-in" onClick={() => setIsOpen(false)}>
              sign-in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
