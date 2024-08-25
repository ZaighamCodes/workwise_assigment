"use client";
import { useGlobal } from "@/app/layout";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const { setCartItems, cartItems , token} = useGlobal();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const router = useRouter()
  useEffect(() => {
    async function fetchCartItems() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setProducts(data);
          calculateTotal(data);
          setCartItems(data.length);
        } else {
          console.error("API response is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCartItems();
  }, [token]);

  const calculateTotal = (products) => {
    const total = products.reduce(
      (total, product) =>
        total +
        (parseInt(product.price) - parseInt(product.discount)) *
          product.quantity,
      0
    );
    setTotalAmount(total);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(cartItems - 1);
      if (response.ok) {
        const updatedProducts = products.filter((product) => product.id !== id);
        setProducts(updatedProducts);
        calculateTotal(updatedProducts);
        toast.success("Item deleted.")
      } else {
        console.error("Failed to delete the product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const paymentGateway = async () => {

    if(products.length > 0) 
    {
      const confirm = window.confirm("Make Payment ?");
      if (confirm) {
        try {
          const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          toast.success("Purchased. Happy Shopping 😊");
          router.push("/")
        } catch (err) {
          console.log(err)
        }
      }
    }
    else 
    {
      toast.error("Please add items in your cart.");
      router.push("/");
    }
    
  };
  return (
    <div className="min-h-screen bg-gray-100 parent">
      <div className="container mx-auto px-4 py-8">
        <h1 className="w-full text-xl pt-3 pb-3 flex font-bold">
          Your Items ({products.length})
        </h1>

        <div className="bg-white shadow-md rounded-lg p-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          ) : (
            <ul>
              {products.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between border-b border-gray-200 py-4"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md">
                      <img
                        src={`http://localhost:5000/${product.productImage}`}
                        className="w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {product.productName}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Quantity: {product.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="text-lg font-semibold text-gray-400 line-through">
                      ₹ {(product.price * product.quantity).toFixed(2)}
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      ₹{" "}
                      {(
                        (product.price - product.discount) *
                        product.quantity
                      ).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 focus:outline-none"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <p className="text-xl font-semibold text-gray-800">
            Total: ₹ {totalAmount.toFixed(2)}
          </p>
          <button className="bg-[var(--accent)] text-white px-4 py-2 rounded-md shadow-md hover:bg-[var(--accent2)] focus:outline-none focus:ring-2 focus:ring-indigo-500" onClick={paymentGateway}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
