import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-2 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" legacyBehavior>
          <a className="text-xl font-semibold text-black hover:text-green-600">
            Effort Education
          </a>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link href="/component/login" legacyBehavior>
            <a className="text-black hover:text-green-600">Study Material</a>
          </Link>
          <Link href="/component/about" legacyBehavior>
            <a className="text-black hover:text-green-600">About Us</a>
          </Link>
          <Link href="/component/contact" legacyBehavior>
            <a className="text-black hover:text-green-600">Contact</a>
          </Link>
          <button className="bg-green-600 hover:bg-red-700 text-white py-2 px-4 rounded">
            Login
          </button>
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <button className="text-black hover:text-green-600 focus:outline-none">
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
      </div>
    </header>
  );
};

export default Header;
