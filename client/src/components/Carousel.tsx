import { useCarousel } from "@/hooks/useCarousel";
import Image from "next/image";
import React from "react";

const Carousel = () => {
  const currentImage = useCarousel({ totalImages: 3 });
  return (
    <div className="basis-1/2 h-full relative overflow-hidden rounded-r-lg">
      {["/hero1.jpg", "/hero2.jpg", "/hero3.jpg"].map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Hero Banner ${index + 1}`}
          fill
          priority={index == currentImage}
          sizes="(max-width:768px) 100vw, (max-width: 1200px) 50vw,33vw"
          className={`object-cover transition-opacity duration-500 opacity-0 ${
            index === currentImage ? "opacity-100" : ""
          }`}
        />
      ))}
    </div>
  );
};

export default Carousel;
