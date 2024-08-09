import React from 'react';

interface StudyMaterial {
  title: string;
  driveLink: string;
}

interface StudyMaterialTileProps {
  material: StudyMaterial;
}

const StudyMaterialTile: React.FC<StudyMaterialTileProps> = ({ material }) => {
  return (
    <a href={material.driveLink} target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg shadow-md p-4 border border-black hover:bg-gray-100 transition duration-300">
      <h2 className="text-lg font-semibold mb-2">{material.title}</h2>
      <p className="text-gray-600">Click here to access study material</p>
    </a>
  );
};

export default StudyMaterialTile;
