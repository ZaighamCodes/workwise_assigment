"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useGlobal } from "@/app/layout";
import md5 from "md5";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { setAuthenticated } = useGlobal();
  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });
  const emailRef = useRef(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
        formdata
      );
      console.log("Response data:", response.data);
      if (response.data && response.data.token && response.data.user) {
        localStorage.setItem("token", response.data.token);
        const userRole = md5(response.data.user.role);
        localStorage.setItem("userRole", userRole);
        if (md5("customer") === userRole) {
          router.push("/");
          setAuthenticated(true);
        } else {
          router.push("/seller/products");
          setAuthenticated(true);
        }
      } else {
        console.error("Invalid response data:", response.data);
      }
    } catch (err) {
      console.error("Login error:", err);
      setFormdata({ email: "", password: "" });
      if (emailRef.current) emailRef.current.focus();
      toast.error("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              ref={emailRef}
              type="email"
              value={formdata.email}
              onChange={(e) =>
                setFormdata({ ...formdata, email: e.target.value })
              }
              required
              placeholder="Enter your email"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formdata.password}
              onChange={(e) =>
                setFormdata({ ...formdata, password: e.target.value })
              }
              required
              placeholder="Enter your password"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
        <Link
          href="/signup"
          className="block mt-4 text-center text-blue-700 underline"
        >
          New user? Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
