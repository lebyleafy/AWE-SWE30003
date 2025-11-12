import Image from "next/image";
import Link from "next/link";

// Props type definition
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white border rounded-xl shadow hover:shadow-lg transition overflow-hidden">
      <div className="relative w-full h-48">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-blue-600 font-bold mt-1">${product.price}</p>
        <Link
          href={`/products/${product.id}`}
          className="inline-block mt-3 w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
