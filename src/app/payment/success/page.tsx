import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24 text-center">
      <div className="bg-white p-10 rounded-2xl shadow">
        
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Payment Successful 🎉
        </h1>

        <p className="text-lg text-gray-700 mb-6">
          Thank you for your purchase! Your order has been processed successfully.
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <Link
            href="/customer/orders"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View Your Orders
          </Link>

          <Link
            href="/products"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </main>
  );
}
