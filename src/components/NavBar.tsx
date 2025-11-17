"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ShoppingCart, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  // Profile dropdown state & ref for outside click handling
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!profileRef.current) return;
      if (e.target instanceof Node && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }

    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  // Determine destination for Profile icon
  const profilePath = session?.user?.role === "admin"
    ? "/admin"
    : session?.user
    ? "/customer"
    : "/signin";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center px-4 py-3">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.jpg"
            alt="AWE Electronics Logo"
            width={80}
            height={80}
            className="object-contain"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 text-gray-700 font-medium">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/products" className="hover:text-blue-600 transition">Products</Link>
          <Link href="/about" className="hover:text-blue-600 transition">About</Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4">

          {/* Profile Icon + Dropdown */}
          <div className="relative">
            <button
              aria-haspopup="true"
              aria-expanded={Boolean(profileOpen)}
              onClick={() => setProfileOpen((s) => !s)}
              className="hover:text-blue-600 transition"
            >
              <User className="w-6 h-6 text-gray-700 hover:text-blue-600" />
            </button>

            {profileOpen && (
              <div
                ref={profileRef}
                className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow-md z-50"
              >
                <div className="p-2 text-sm text-gray-700">
                  {session ? (
                    <>
                      <Link
                        href={session.user?.role === "admin" ? "/admin" : "/customer"}
                        className="block px-3 py-2 hover:bg-gray-100 rounded"
                        onClick={() => setProfileOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                      >
                        Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/signin"
                        className="block px-3 py-2 hover:bg-gray-100 rounded"
                        onClick={() => setProfileOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        className="block px-3 py-2 hover:bg-gray-100 rounded"
                        onClick={() => setProfileOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <Link href="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-blue-600 transition" />
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              0
            </span>
          </Link>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="flex flex-col p-4 space-y-2 text-gray-700">
            <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/products" onClick={() => setIsOpen(false)}>Products</Link>
            <Link href="/about" onClick={() => setIsOpen(false)}>About</Link>

            {/* Mobile Profile */}
            <Link href={profilePath} onClick={() => setIsOpen(false)}>
              {session ? "Dashboard" : "Sign In"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
