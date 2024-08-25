import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useGlobal } from "../layout";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
const ProductCard = ({ imageSrc, title, price, id, discount }) => {
  const [quantity, setQuantity] = useState(1);
  const token = localStorage.getItem("token");
  const router = useRouter();
  const { setCartItems, cartItems } = useGlobal();
  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(prev + amount, 1));
  };
  console.log("this is my cart items", cartItems);
  const cartHandler = async () => {
    if (token) {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cart`, // Adjust this endpoint if necessary
          {
            productId: id,
            quantity: quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Item added in cart.");
      } catch (err) {
        console.log(err);
      }
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-[320px]">
      <img
        src={imageSrc}
        alt={title}
        className="w-full h-48 object-cover object-center"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
        <div className="price-div flex justify-between">
          <p className="text-lg font-bold text-gray-800 mb-4">
            ₹ {price - discount}
          </p>
          <p className="text-lg font-bold text-gray-400 mb-4 line-through">
            ₹ {price}
          </p>
        </div>

        <div className="flex items-center mb-4">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-md hover:bg-gray-300 focus:outline-none"
          >
            -
          </button>
          <input
            type="text"
            value={quantity}
            readOnly
            className="w-12 text-center border-t border-b border-gray-300"
          />
          <button
            onClick={() => handleQuantityChange(1)}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-md hover:bg-gray-300 focus:outline-none"
          >
            +
          </button>
        </div>
        <div className="flex gap-2">
          <button
            className="w-full py-2 px-4 bg-[var(--accent)] text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={cartHandler}
          >
            Add to Cart
          </button>
          <Link href={`/productdetail/${id}`} className="w-full py-2 px-4 bg-[var(--accent)] text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center">View</Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
