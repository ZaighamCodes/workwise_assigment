"use client";
import md5 from "md5";
import { Inter } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Header from "./(customer)/components/header/Header";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const [token, settoken] = useState(null);
  const [role, setrole] = useState(null);
  useEffect(() => {
    const mytoken = localStorage.getItem("token");
    settoken(mytoken);
    setrole(localStorage.getItem("userRole"));
    if (mytoken) {
      setAuthenticated(true);
    }
  }, [setAuthenticated]);

  useEffect(() => {
    if (authenticated && (pathname === "/login" || pathname === "/signup")) {
      router.push("/");
    }
  }, [authenticated, pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setAuthenticated(false);
    router.push("/");
  };

  useEffect(() => {
    if (authenticated) {
      async function fetchCartItems() {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/cart`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          if (Array.isArray(data)) {
            setCartItems(data.length);
          } else {
            console.error("API response is not an array:", data);
          }
        } catch (error) {
          console.error("Error fetching cart items:", error);
          logout();
        }
      }
      fetchCartItems();
    }
  }, [token, authenticated]);

  // handling routes authentications
  const customerroutes = ["/cart", "/seller"];
  useEffect(() => {
    if (!authenticated && customerroutes.includes(pathname)) {
      router.push("/");
    }
  }, [authenticated, pathname, router]);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole === md5("seller")) {
      if (!pathname.startsWith("/seller")) {
        router.push("/seller");
      }
    } else if (userRole === md5("customer")) {
      if (pathname.startsWith("/seller")) {
        router.push("/");
      }
    }
  }, [pathname, router]);

  return (
    <GlobalContext.Provider
      value={{
        authenticated,
        setAuthenticated,
        role,
        cartItems,
        setCartItems,
        logout,
        token
        ,role
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isSellerRoute = pathname.startsWith("/seller");

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
        <GlobalProvider>
          {!isSellerRoute && <Header />}
          {children}
          <Toaster />
        </GlobalProvider>
      </body>
    </html>
  );
}
