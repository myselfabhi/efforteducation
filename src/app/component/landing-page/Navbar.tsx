import React from 'react';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Our Courses', href: '/courses' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
];

const Header: React.FC = () => {
  return (
    <header className="bg-black shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" legacyBehavior>
          <a className="text-2xl font-bold">
            <span className="text-red-600" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
              effort
            </span>
            <span className="text-white ml-1" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
              education
            </span>
          </a>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} legacyBehavior>
              <a className="text-gray-300 hover:text-red-600">{item.label}</a>
            </Link>
          ))}
        </nav>

        {/* Call to Action */}
        <Link href="/buy-now" legacyBehavior>
          <a className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700">
            Buy Now
          </a>
        </Link>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <button className="text-gray-300 hover:text-red-600 focus:outline-none">
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
