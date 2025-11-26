"use client";

import { useState } from "react";

interface ProductFormProps {
  product?: {
    id: number;
    name: string;
    description: string | null;
    price: number;
    category: string;
    imageUrl: string;
  };
}

export default function ProductForm({ product }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!product;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);

    const url = isEditing ? `/api/products/${product!.id}` : `/api/products`;
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, { method, body: formData });

    if (res.ok) {
      window.location.href = "/products";
    } else {
      const data = await res.json();
      alert(data?.error || "Failed to save product");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        placeholder="Product Name"
        className="border p-2 w-full"
        required
        defaultValue={product?.name || ""}
      />
      <textarea
        name="description"
        placeholder="Description"
        className="border p-2 w-full"
        defaultValue={product?.description || ""}
      />
      <input
        name="price"
        type="number"
        step="0.01"
        placeholder="Price"
        className="border p-2 w-full"
        required
        defaultValue={product?.price || ""}
      />
      <input
        name="category"
        placeholder="Category"
        className="border p-2 w-full"
        defaultValue={product?.category || ""}
      />
      <input
        name="imageUrl"
        placeholder="Image URL"
        className="border p-2 w-full"
        defaultValue={product?.imageUrl || ""}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Saving..." : isEditing ? "Update Product" : "Save Product"}
      </button>
    </form>
  );
}
