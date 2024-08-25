"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useGlobal } from "@/app/layout";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { authenticated , logout } = useGlobal();
  const toggleMenu = () => setIsOpen(!isOpen);
  return (
    <div className="parent mx-auto mt-2 top-0">
      <nav className="flex justify-between items-center container bg-[var(--accent)] p-2 rounded-sm shadow-lg relative">
        {/* Logo/Title */}
        <Link href="/" className="text-white font-bold text-xl">
          Wo
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/"
            className="text-white hover:bg-[var(--accent2)] px-4 py-2 rounded-md transition"
          >
            Home
          </Link>
          {authenticated && (
            <Link
              href="/cart"
              className="text-white hover:bg-[var(--accent2)] px-4 py-2 rounded-md transition"
            >
              Cart
            </Link>
          )}

          {!authenticated ? (
            <Link
              href="/login"
              className="text-white border border-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
            >
              Login
            </Link>
          ) : (
            <button
              className="text-white border border-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
              onClick={() => logout()}
            >
              Logout
            </button>
          )}
        </div>

        {/* Burger Menu Button */}
        <button
          className="md:hidden text-white p-2 focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 right-0 w-full h-full bg-[var(--accent)] p-4 rounded-sm shadow-lg md:hidden transition-transform transform flex items-center justify-center ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            className="text-white  absolute top-2 right-2"
            onClick={toggleMenu}
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <ul className="space-y-4">
            <li>
              <Link
                href="/"
                className="text-white block px-4 py-2 rounded-md hover:bg-[var(--accent2)]"
                onClick={toggleMenu}
              >
                Home
              </Link>
            </li>
            {
              authenticated &&    
              <li>
              <Link
                href="/cart"
                className="text-white block px-4 py-2 rounded-md hover:bg-[var(--accent2)]"
                onClick={toggleMenu}
              >
                Cart
              </Link>
            </li>
            }
         
            <li>
              {!authenticated ? (
                <Link
                  href="/login"
                onClick={toggleMenu}
                className="text-white border border-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition" 
                >
                  Login
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-white border border-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
                >
                  Logout
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
