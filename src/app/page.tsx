import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";

// Define a TypeScript interface for product objects
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function HomePage() {
  // Temporary mock data – later this will come from Prisma + PostgreSQL
  const products: Product[] = [
    { id: 1, name: "Wireless Headphones", price: 199, image: "/images/headphones.jpg" },
    { id: 2, name: "Smartwatch Pro", price: 299, image: "/images/smartwatch.jpg" },
    { id: 3, name: "Gaming Laptop", price: 1299, image: "/images/laptop.jpg" },
    { id: 4, name: "4K Monitor", price: 499, image: "/images/monitor.jpg" },
  ];

  return (
    <div className="flex flex-col gap-16">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-24 text-center rounded-2xl shadow-md">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-extrabold mb-4">
            Welcome to AWE Electronics
          </h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-200">
            Discover the latest electronics and gadgets — delivered straight to your door.
          </p>
          <Link
            href="/products"
            className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>
      <section className="container mx-auto px-4 mt-20">
        <h2 className="text-3xl font-bold text-center mb-10">Shop by Category</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { title: "Laptops", image: "/images/category-laptops.jpg" },
            { title: "Headphones", image: "/images/category-headphones.jpg" },
            { title: "Smartwatches", image: "/images/category-smartwatch.jpg" },
            { title: "Accessories", image: "/images/category-accessories.jpg" },
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

      {/* FEATURED PRODUCTS */}
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

      { /* CALL TO ACTION */}
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
