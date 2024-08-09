import React from 'react';
import Image from 'next/image';
import profile from './Profile.jpg';

interface Review {
  name: string;
  date: string;
  content: string;
}

interface ReviewTileProps {
  review: Review;
}

const ReviewTile: React.FC<ReviewTileProps> = ({ review }) => {
  const { name, date, content } = review;

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="relative h-10 w-10 rounded-full mr-4 overflow-hidden">
          <Image src={profile} alt="Profile Pic" layout="fill" objectFit="cover" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>
      <p className="text-gray-800">{content}</p>
    </div>
  );
};

export default ReviewTile;
