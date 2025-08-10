"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface Blog {
  title: string;
  link: string;
  snippet: string;
  image: string;
  date: string;
  category: string;
}

const BlogSection: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetchBlogs();
    // Dynamically load Google CSE script
    const cxScript = document.createElement('script');
    cxScript.src = 'https://cse.google.com/cse.js?cx=f6782ca6dd6574e7b';
    cxScript.async = true;
    document.body.appendChild(cxScript);

    return () => {
      document.body.removeChild(cxScript); 
    };
  }, []);

  const fetchBlogs = async () => {
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const CX_ID = 'f6782ca6dd6574e7b';  

    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?q=government%20exams&cx=${CX_ID}&key=${API_KEY}`
      );
      const data = await response.json();

      const blogData = data.items.map((item: any) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        image: item.pagemap?.cse_image?.[0]?.src || '/default-blog-image.jpg', // Default image if none found
        date: new Date().toLocaleDateString(),
        category: "Category", // This would typically come from the data or be hard-coded
      }));

      setBlogs(blogData);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  return (
    <section className="bg-black py-12 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8">Latest Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {blogs.map((blog, index) => (
            <a key={index} href={blog.link} target="_blank" rel="noopener noreferrer" className="flex space-x-4 hover:bg-gray-800 p-4 rounded-lg transition">
              <Image src={blog.image} alt={blog.title} width={150} height={150} className="rounded-lg" />
              <div>
                <h3 className="text-xl font-semibold">{blog.title}</h3>
                <p className="text-gray-400">{blog.snippet}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs text-gray-400">{blog.date}</span>
                  <span className="bg-red-600 text-xs px-2 py-1 rounded">{blog.category}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <a href="/blogs" className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700">
            Explore Blog
          </a>
        </div>
        {/* Google Custom Search Element */}
        <div className="mt-12">
          <div className="gcse-search"></div>
        </div>
      </div>
    </section>
  );
}

export default BlogSection;
