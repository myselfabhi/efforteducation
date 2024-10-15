import React from 'react';
import Link from 'next/link';
import { Youtube, Facebook, Twitter, Instagram } from 'lucide-react';

interface FooterLink {
  title: string;
  links: { label: string; href: string }[];
}

const footerLinks: FooterLink[] = [
  {
    title: 'Our Courses',
    links: [
      { label: 'Education and Mastery', href: '/courses/education-mastery' },
      { label: 'Graphic Design', href: '/courses/graphic-design' },
      { label: 'Machine Learning', href: '/courses/machine-learning' },
    ],
  },
  {
    title: 'Links',
    links: [
      { label: 'About us', href: '/about' },
      { label: 'Our Team', href: '/team' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
    ],
  },
  {
    title: 'Pages',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Our Courses', href: '/courses' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
];

const socialLinks = [
  { icon: Youtube, href: 'https://www.youtube.com' },
  { icon: Facebook, href: 'https://www.facebook.com' },
  { icon: Twitter, href: 'https://www.twitter.com' },
  { icon: Instagram, href: 'https://www.instagram.com' },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto flex flex-col space-y-14 items-center">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
          {/* Logo and Contact Info */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              {/* Logo */}
              <div className="text-2xl font-bold">
                <span className="text-red-600">effort</span>
                <span className="text-white ml-1">education</span>
              </div>
            </div>
            <div>
              <p>Info@elearning.com</p>
              <p>+00 12354664</p>
            </div>
          </div>

          {/* Map through Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.href} className="hover:text-red-600">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Media Icons */}
        <div className="mt-8 flex justify-center space-x-4">
          {socialLinks.map((social, index) => (
            <Link key={index} href={social.href} className="text-gray-400 hover:text-red-600">
              <social.icon size={20} />
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Effort Education. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
