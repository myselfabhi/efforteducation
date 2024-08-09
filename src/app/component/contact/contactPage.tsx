import { NextPage } from 'next';
import React from 'react';
import Image from 'next/image'
import backgroundImage from './backgroundImage.jpg';

const ContactPage: NextPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <Image className="contact-img"  src={backgroundImage} alt="background" fill={true}/>
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 m-6 ml-auto  ">
        <h2 className="text-3xl font-bold text-center mb-6">Contact Us</h2>
        <form action="https://formspree.io/f/mleqlgkb" method="POST">
          <input type="hidden" name="_subject" value="New submission from your website" />
          <input type="hidden" name="_cc" value="efforteducation@gmail.com" />
          <div className="mb-6">
            <label htmlFor="name" className="block text-lg font-semibold mb-2">Your Name</label>
            <input type="text" id="name" name="name" className="w-full border rounded-lg py-2 px-4 focus:outline-none focus:border-blue-400 placeholder-gray-400 text-gray-800" placeholder="Your Name" />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-lg font-semibold mb-2">Your Email</label>
            <input type="email" id="email" name="email" className="w-full border rounded-lg py-2 px-4 focus:outline-none focus:border-blue-400 placeholder-gray-400 text-gray-800" placeholder="Your Email" />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block text-lg font-semibold mb-2">Your Message</label>
            <textarea id="message" name="message" rows={6} className="w-full border rounded-lg py-2 px-4 focus:outline-none focus:border-blue-400 placeholder-gray-400 text-gray-800" placeholder="Your Message"></textarea>
          </div>
          <div className="text-center">
            <button type="submit" className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600 transition duration-300 ease-in-out">Send Message</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactPage;
