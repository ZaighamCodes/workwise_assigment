"use client";
import { useGlobal } from "@/app/layout";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const ProductDetail = ({ params }) => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { token } = useGlobal();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${params.id}`
        );
        setProduct(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(prev + amount, 1));
  };

  const handleAddToCart = async () => {
    if (token) {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cart`,
          {
            productId: product.id,
            quantity: quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Item added to cart.");
      } catch (err) {
        console.error(err);
        toast.error("Failed to add item to cart.");
      }
    } else {
      router.push("/login");
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="parent">
      <div className="container mx-auto px-4 py-8">
        <Toaster />
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg">
          <img
            src={`http://localhost:5000/${product.image}`}
            alt={product.name}
            className="w-full md:w-1/2 h-64 object-cover rounded-t-lg md:rounded-l-lg product-image"
          />
          <div className="p-6 md:w-1/2">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Category: {product.category}
            </p>
            <p className="text-lg font-semibold text-gray-800 mb-2 flex gap-1">
              Price: ₹ <p className="text-gray-500 line-through">{product.price}</p>  {product.price - product.discount}
            </p>
            
             
            
            <p className="text-md text-gray-600 mb-4">{product.description}</p>
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
            <button
              onClick={handleAddToCart}
              className="w-full py-2 px-4 bg-[var(--accent)] text-white btn"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
