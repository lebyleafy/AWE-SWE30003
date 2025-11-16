import Link from "next/link";
import { Product } from "@prisma/client";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="border rounded-lg shadow hover:shadow-lg transition p-4 cursor-pointer">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-gray-600 text-sm">{product.category}</p>
        <p className="font-bold mt-2">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
