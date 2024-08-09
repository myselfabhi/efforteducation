import React from 'react';
import YouTubeVideo from './YoutubeVideo';
import ReviewsSection from './ReviewSection';
import DirectorMessage from './Directormessage';

const AboutUsPage: React.FC = () => {
  return (
    <div className="bg-gradient-to-b bg-green-600 ">
      {/* About Us Section */}
      <section className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-3xl font-bold text-center mb-6">About Us</h2>
          <div className="text-left">
            <p className="text-lg text-gray-800 mb-6">
              Effort Education is a leading online education platform dedicated to providing high-quality courses and training programs to help individuals excel in their academic and professional endeavors. With a team of experienced instructors and industry experts, we offer a wide range of courses spanning various subjects, including banking exams, competitive exams, programming, and more.
            </p>
            <p className="text-lg text-gray-800 mb-6">
              Our mission is to make learning accessible, engaging, and effective for everyone. Whether you're a student preparing for exams, a working professional looking to enhance your skills, or someone eager to explore new subjects, we have something for you. Our interactive learning platform, personalized support, and practical approach to education ensure that our students receive the best possible learning experience.
            </p>
            <p className="text-lg text-gray-800 mb-6">
              Join us on our journey to empower individuals to reach their full potential and achieve their goals. With Effort Education, the path to success is within reach.
            </p>
          </div>
          {/* YouTube Video */}
          <div className="max-w-lg mx-auto mt-8">
            <YouTubeVideo />
          </div>
        </div>
      </section>

      {/* Director Message */}
      <DirectorMessage />

      {/* Testimonials Section */}
      <section className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-6">What Our Students Say</h2>
        {/* Testimonials carousel or grid can be added here */}
        <ReviewsSection />
      </section>
    </div>
  );
}

export default AboutUsPage;
