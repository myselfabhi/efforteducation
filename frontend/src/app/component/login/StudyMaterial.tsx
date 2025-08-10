import React from 'react';
import StudyMaterialTile from './StudyMaterialTile';

interface StudyMaterial {
  id: number;
  title: string;
  driveLink: string;
}

const CoursePage: React.FC = () => {
  // Define your study materials here
  const studyMaterials: StudyMaterial[] = [
    { id: 1, title: 'Study Material 1', driveLink: 'https://drive.google.com/link-to-material-1' },
    { id: 2, title: 'Study Material 2', driveLink: 'https://drive.google.com/link-to-material-2' },
    { id: 3, title: 'Study Material 2', driveLink: 'https://drive.google.com/link-to-material-2' },
    { id: 4, title: 'Study Material 2', driveLink: 'https://drive.google.com/link-to-material-2' },
    { id: 5, title: 'Study Material 2', driveLink: 'https://drive.google.com/link-to-material-2' },
    { id: 6, title: 'Study Material 2', driveLink: 'https://drive.google.com/link-to-material-2' },
    { id: 7, title: 'Study Material 2', driveLink: 'https://drive.google.com/link-to-material-2' },
    { id: 8, title: 'Study Material 2', driveLink: 'https://drive.google.com/link-to-material-2' },
    { id: 9, title: 'Study Material 2', driveLink: 'https://drive.google.com/link-to-material-2' },
    // Add more study materials as needed
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Course Name</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {studyMaterials.map(material => (
          <StudyMaterialTile key={material.id} material={material} />
        ))}
      </div>
    </div>
  );
};

export default CoursePage;
