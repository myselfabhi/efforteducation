import React from 'react';

const YouTubeVideo: React.FC = () => {
  return (
    <div className="max-w-md mx-auto rounded-lg overflow-hidden shadow-lg">
      <div className="relative" style={{ paddingBottom: "56.25%", height: "0" }}>
        <iframe
          title="YouTube Video"
          className="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube.com/embed/1fVgXNsMPf0?autoplay=1&mute=1"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default YouTubeVideo;
