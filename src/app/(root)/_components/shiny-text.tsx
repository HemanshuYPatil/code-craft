import React from "react";
import Lottie from "lottie-react";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";
import animationData from "../../../../public/anime.json"; // Your .lottie JSON file

interface ShinyTextProps {
  text: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({ text }) => {
  return (
    <div className="relative">
      {/* AnimatedShinyText Component */}
      {/* <AnimatedShinyText text={text} /> */}

      {/* Lottie animation */}
      <Lottie
        animationData={animationData}
        loop={true}
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
    </div>
  );
};
