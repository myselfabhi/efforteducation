'use client';

import { useState } from 'react';
import { Button } from '../../components/ui/button';

export default function CourseFilter() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Courses' },
    { id: 'government', label: 'Government Exams' },
    { id: 'skills', label: 'Skill Development' },
    { id: 'communication', label: 'Communication' }
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-8 justify-center">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? 'default' : 'outline'}
          onClick={() => setActiveFilter(filter.id)}
          className={`px-6 py-2 rounded-full transition-colors ${
            activeFilter === filter.id
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
