"use client"; // Ensure this is a client-side component

import React, { useState, useEffect } from "react";
import Link from "next/link";

type NavItem = {
  label: string;
  href: string;
};

type Props = {
  isLandingPage: boolean;
};

const navItems: NavItem[] = [
  { label: "About Us", href: "/about" },
  { label: "Our Courses", href: "/courses" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

const Navbar: React.FC<Props> = ({ isLandingPage }) => {
  const [hamburgerMenuState, setHamburgerMenuState] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navbarStyle = `sticky top-0 z-40 transition-all duration-300 ${
    scrolled ? "bg-opacity-90 backdrop-blur-sm bg-gray-900" : "bg-gray-900"
  }`;

  return (
    <div className={navbarStyle}>
      <nav className="container mx-auto lg:mx-16 flex justify-between items-center py-4 px-4 ">
        {/* Logo */}
        <Link href="/" legacyBehavior>
          <a className="text-2xl font-bold">
            <span
              className="text-red-600"
              style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}
            >
              effort
            </span>
            <span
              className={`ml-1 ${
                isLandingPage ? "text-white" : "text-gray-200"
              }`}
              style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}
            >
              education
            </span>
          </a>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} legacyBehavior>
              <a
                className={`hover:text-red-600 ${
                  isLandingPage ? "text-gray-300" : "text-gray-400"
                }`}
              >
                {item.label}
              </a>
            </Link>
          ))}
        </div>

        {/* Sign In Button */}
        <Link href="/sign-in" legacyBehavior>
          <a className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700">
            Sign In
          </a>
        </Link>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <button
            className={`focus:outline-none ${
              isLandingPage ? "text-gray-300" : "text-gray-400"
            } hover:text-red-600`}
            onClick={() => setHamburgerMenuState(!hamburgerMenuState)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Dropdown for Mobile Menu */}
        {hamburgerMenuState && (
          <div className="absolute top-full left-0 w-full bg-gray-900 border-t border-gray-700 md:hidden">
            <div className="flex flex-col w-full p-4 gap-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a className="text-white hover:text-red-600">{item.label}</a>
                </Link>
              ))}
              <Link href="/sign-in">
                <a className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 text-center">
                  Sign In
                </a>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
