
import React from 'react';
import Icon from '../common/Icon';

const VideoLessons: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Video Lessons</h2>
        <p className="text-sm text-slate-500">Visual learning to supplement your studies.</p>
      </header>

      <div className="flex-1 bg-white rounded-xl shadow-md p-6 overflow-y-auto">
        <div className="text-center text-slate-500 h-full flex flex-col justify-center items-center">
          <Icon name="video" className="w-20 h-20 text-slate-300 mb-4" />
          <h3 className="text-2xl font-bold text-slate-700">Coming Soon!</h3>
          <p className="mt-2 max-w-md">
            We're working hard to bring you engaging video lessons. Stay tuned for updates!
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              {[...Array(4)].map((_, i) => (
                   <div key={i} className="bg-slate-200 rounded-lg aspect-video flex items-center justify-center">
                       <Icon name="video" className="w-10 h-10 text-slate-400"/>
                   </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLessons;
