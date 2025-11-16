import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function ProductsPage() {
  // Fetch data directly from Prisma
  const products = await prisma.product.findMany();

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 text-center space-y-8">
      <h1 className="text-4xl font-bold text-blue-600">All Products 🛍️</h1>

      <p className="text-gray-700 max-w-2xl mx-auto">
        Browse all high-quality electronics available in our store.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {products.map((product) => (
          <Link 
            href={`/products/${product.id}`} 
            key={product.id}
            className="border rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col cursor-pointer"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />

            <h2 className="text-lg font-semibold mb-1">{product.name}</h2>

            {product.description && (
              <p className="text-gray-600 mb-2">{product.description}</p>
            )}

            <p className="font-bold mb-1">${product.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500">{product.category}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
