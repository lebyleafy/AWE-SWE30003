import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import prisma from "@/lib/prisma";
import { Product } from "@prisma/client";

export default async function HomePage() {
  // Fetch the latest 4 products from your database
  const products: Product[] = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <div className="flex flex-col gap-16">

      <section className="relative w-full h-[60vh] flex items-center justify-center rounded-2xl shadow-md overflow-hidden">
          <img
            src="/images/hero.jpg"
            className="absolute inset-0 w-full h-full object-cover"
            alt="Hero Background"
          />

          <div className="absolute inset-0 bg-black/50"></div>

          <div className="relative z-10 text-white text-center px-6">
            <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">Welcome to AWE Electronics</h1>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-200 drop-shadow">
              Discover the latest electronics and gadgets...
            </p>
            <Link href="/products" className="inline-block bg-white text-blue-700 px-8 py-3 rounded-lg shadow">
              Shop Now
            </Link>
          </div>
        </section>

      {/* CATEGORY SECTION */}
      <section className="container mx-auto px-4 mt-20">
        <h2 className="text-3xl font-bold text-center mb-10">Shop by Category</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { title: "Laptops", image: "/images/category-laptops.jpg" },
            { title: "Headphones", image: "/images/category-headphones.jpg" },
            { title: "Smartwatches", image: "/images/category-smartwatches.jpg" },
            { title: "Appliances", image: "/images/category-appliances.jpg" },
          ].map((cat) => (
            <a
              key={cat.title}
              href={`/products?category=${cat.title.toLowerCase()}`}
              className="relative rounded-xl overflow-hidden group shadow-md"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h3 className="text-xl font-semibold text-white">{cat.title}</h3>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS FROM DATABASE */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">
          Featured Products
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="text-blue-600 font-semibold hover:underline"
          >
            View All Products →
          </Link>
        </div>
      </section>

      {/* WHY SHOP WITH US */}
      <section className="bg-white py-20 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">Why Shop With AWE Electronics?</h2>

          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-xl font-semibold mb-2">🚚 Fast Delivery</h3>
              <p className="text-gray-600">Nationwide shipping within 2–3 business days.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">💳 Secure Payments</h3>
              <p className="text-gray-600">Pay confidently via credit card or bank transfer.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">⭐ Quality Guarantee</h3>
              <p className="text-gray-600">All products come with a 12-month warranty.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA NEWSLETTER */}
      <section className="bg-blue-600 text-white text-center py-16 mt-20 rounded-xl">
        <h2 className="text-3xl font-bold mb-4">Join Our Tech Insider Newsletter</h2>
        <p className="mb-6 text-gray-200">
          Get early access to new arrivals, exclusive offers, and more.
        </p>
        <form className="flex justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-md text-gray-800"
            required
          />
          <button
            type="submit"
            className="bg-white text-blue-700 font-semibold px-5 py-2 rounded-md hover:bg-gray-100 transition"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}
