import ProductCard from "@/components/ProductCard";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function ProductsPage() {
  // Temporary data — later you’ll fetch from Prisma/PostgreSQL
  const products: Product[] = [
    { id: 1, name: "Wireless Headphones", price: 199, image: "/images/headphones.jpg", category: "Audio" },
    { id: 2, name: "Smartwatch Pro", price: 299, image: "/images/smartwatch.jpg", category: "Wearables" },
    { id: 3, name: "Gaming Laptop", price: 1299, image: "/images/laptop.jpg", category: "Laptops" },
    { id: 4, name: "4K Monitor", price: 499, image: "/images/monitor.jpg", category: "Displays" },
    { id: 5, name: "Wireless Mouse", price: 49, image: "/images/mouse.jpg", category: "Accessories" },
    { id: 6, name: "Mechanical Keyboard", price: 89, image: "/images/keyboard.jpg", category: "Accessories" },
  ];

  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">All Products</h1>

      {/* Filter/Search bar placeholder */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
        />
        <select className="w-full sm:w-1/5 px-3 py-2 border border-gray-300 rounded-md">
          <option>All Categories</option>
          <option>Laptops</option>
          <option>Audio</option>
          <option>Wearables</option>
          <option>Accessories</option>
        </select>
      </div>

      {/* Products grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}