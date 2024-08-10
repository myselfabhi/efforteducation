import React from 'react';

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center px-4">
        <p className="text-sm sm:text-base">
          &copy; {new Date().getFullYear()} Effort Education. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
