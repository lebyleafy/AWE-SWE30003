"use client";

interface DeleteButtonProps {
  id: number;
}

export default function DeleteButton({ id }: DeleteButtonProps) {
  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) window.location.href = "/products";
    else {
      const data = await res.json();
      alert(data?.error || "Failed to delete product");
    }
  }

  return (
    <button type="button" className="text-red-600" onClick={handleDelete}>
      Delete
    </button>
  );
}
