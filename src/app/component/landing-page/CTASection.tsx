import React from 'react';

type SocialLink = {
  href: string;
  iconClass: string;
};

const socialLinks: SocialLink[] = [
  { href: "https://youtube.com/@selecteffort", iconClass: "fab fa-youtube" },
  { href: "https://www.instagram.com/selecteffort/", iconClass: "fab fa-instagram" },
  { href: "https://www.facebook.com/effort.coaching/", iconClass: "fab fa-facebook" },
  // Add more social media links here as needed
];

const SocialIcon: React.FC<SocialLink> = ({ href, iconClass }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-white hover:text-gray-200 transition duration-300"
  >
    <i className={`${iconClass} fa-2x`}></i>
  </a>
);

const CTASection: React.FC = () => {
  return (
    <section className="bg-green-600 text-white py-12">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-base sm:text-lg mb-8">
          Connect with us on social media for updates, news, and more!
        </p>
        <div className="flex justify-center space-x-4 sm:space-x-6">
          {socialLinks.map(({ href, iconClass }) => (
            <SocialIcon key={href} href={href} iconClass={iconClass} />
          ))}
        </div>
        <button className="bg-white text-black py-2 px-4 sm:px-6 rounded-full uppercase text-sm sm:text-lg font-semibold hover:bg-blue-100 hover:text-blue-700 transition duration-300 mt-8 shadow-2xl">
          Browse Courses
        </button>
      </div>
    </section>
  );
}

export default CTASection;
