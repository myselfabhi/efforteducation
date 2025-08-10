"use client";

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
  { label: "Young Scholars IAS", href: "/young-scholars-ias" },
  { label: "Courses", href: "/courses" },
  { label: "Success Stories", href: "/success-stories" },
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
        <Link href="/">
          <span className="text-2xl font-bold">
            <span
              className="text-red-600"
              style={{ textShadow: "2px 2px 4px rgba(255, 255, 255, 0.3)" }}
            >
              Effort
            </span>
            <span
              className={`ml-1 ${
                isLandingPage ? "text-white" : "text-gray-200"
              }`}
              style={{ textShadow: "2px 2px 4px rgba(255, 255, 255, 0.3)" }}
            >
              Education
            </span>
          </span>
        </Link>

        <div className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={`hover:text-red-600 ${
                  isLandingPage ? "text-gray-300" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        <Link href="/register">
          <span className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700">
            Enroll Now
          </span>
        </Link>

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

        {hamburgerMenuState && (
          <div className="absolute top-full left-0 w-full bg-black border-t border-gray-700 md:hidden">
            <div className="flex flex-col w-full p-4 gap-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span className="text-white hover:text-red-600">
                    {item.label}
                  </span>
                </Link>
              ))}
              <Link href="/register">
                <span className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 text-center">
                  Enroll Now
                </span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
