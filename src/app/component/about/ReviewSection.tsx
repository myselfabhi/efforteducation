import React from 'react';
import Image from 'next/image';
import Pic from './Director.jpg';

const DirectorMessage: React.FC = () => {
  return (
    <div className="bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Message from the Director</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center mb-2">
              <Image src={Pic} alt="Director" width={100} height={100} className="object-cover" />
            </div>
            <h3 className="text-lg font-semibold">Mr. M.K. Verma</h3>
          </div>
          <p className="text-lg text-gray-800">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed efficitur orci ac nunc blandit tincidunt. Vivamus vestibulum, lorem eu vehicula mattis, mauris quam vestibulum arcu, at consequat lectus orci nec purus. Nulla facilisi. Proin luctus est nec nisi blandit, at efficitur sapien eleifend. Mauris nec odio vel nisi cursus convallis. Ut lacinia aliquet nisl sit amet consequat. Vestibulum rhoncus augue ut nibh ultrices, nec commodo felis aliquam. In hac habitasse platea dictumst.</p>
        </div>
      </div>
    </div>
  );
};

export default DirectorMessage;
