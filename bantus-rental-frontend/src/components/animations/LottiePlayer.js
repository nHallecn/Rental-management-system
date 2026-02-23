"use client";

import Lottie from "lottie-react";

// This is the corrected, simplified component.
// It just takes the animationData object and renders it.
export const LottiePlayer = ({ animationData }) => {
  if (!animationData) {
    return (
      <div className="h-64 w-64 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
        <p className="text-gray-500">[Animation data not loaded]</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-64 mx-auto">
      <Lottie 
        animationData={animationData} 
        loop={true} 
      />
    </div>
  );
};
