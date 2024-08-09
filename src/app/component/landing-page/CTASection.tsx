import React from 'react';

const CTASection: React.FC = () => {
  return (
    <section className="bg-green-600 text-white py-12">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg mb-8">Connect with us on social media for updates, news, and more!</p>
        {/* Social media icons */}
        <div className="flex justify-center space-x-6">
          <a href="https://youtube.com/@selecteffort" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200">
            <i className="fab fa-youtube fa-2x"></i>
          </a>
          
          <a href="https://www.instagram.com/selecteffort/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200">
            <i className="fab fa-instagram fa-2x"></i>
          </a>
          <a href="https://www.facebook.com/effort.coaching/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200">
            <i className="fab fa-facebook fa-2x"></i>
          </a>
          {/* Add more social media icons and links as needed */}
        </div>
        {/* Call-to-action button */}
        <button className="bg-white text-black py-2 px-6 rounded-full uppercase text-lg font-semibold hover:bg-blue-100 hover:text-blue-700 transition duration-300 mt-8 shadow-2xl ">
          Browse Courses
        </button>
      </div>
    </section>
  );
}

export default CTASection;
