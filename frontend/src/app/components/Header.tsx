"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Courses", href: "#courses" },
  { label: "Programs", href: "#programs" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const classes = scrolled
    ? "bg-opacity-90 backdrop-blur-sm bg-gray-900"
    : "bg-gray-900";

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${classes}`}>
      <nav className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
        <Link href="#home" className="text-2xl font-bold">
          <span className="text-red-600">Effort</span>
          <span className="ml-1 text-white">Education</span>
        </Link>

        <button
          className="md:hidden text-gray-200"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle Menu"
        >
          <svg className="h-7 w-7" viewBox="0 0 24 24" stroke="currentColor" fill="none">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="hidden md:flex items-center space-x-8 text-gray-300">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-red-500">
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="hidden md:inline-block bg-red-600 text-white py-2 px-5 rounded-md hover:bg-red-700"
        >
          Get in Touch
        </a>
      </nav>

      {open && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-gray-200 hover:text-red-500"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="bg-red-600 text-white py-2 px-5 rounded-md hover:bg-red-700 text-center"
            >
              Get in Touch
            </a>
          </div>
        </div>
      )}
    </header>
  );
}


