import React from 'react';

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className=" py-4">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Effort Education. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
