"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const classes = scrolled
    ? "bg-opacity-90 backdrop-blur-sm bg-gray-900"
    : "bg-gray-900";

  return (
    <div className={`sticky top-0 z-40 transition-all duration-300 ${classes}`}>
      <nav className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/">
          <span className="text-2xl font-bold">
            <span className="text-red-600">Effort</span>
            <span className="ml-1 text-white">Education</span>
          </span>
        </Link>

        <div className="hidden md:flex space-x-8 text-gray-300">
          <Link href="#features" className="hover:text-red-500">Features</Link>
          <Link href="#courses" className="hover:text-red-500">Courses</Link>
          <Link href="#contact" className="hover:text-red-500">Contact</Link>
        </div>

        <Link href="#enroll" className="bg-red-600 text-white py-2 px-5 rounded-md hover:bg-red-700">
          Enroll Now
        </Link>
      </nav>
    </div>
  );
}


