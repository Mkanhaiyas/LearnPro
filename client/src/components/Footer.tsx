import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="bg-customgreys-secondarybg bottom-0 w-full py-8 mt-10 text-center text-sm">
      <p>&copy; 2024 LearnPro. All Rights Reserved</p>
      <div className="mt-2">
        {["About", "Privacy Policy", "Licensing", "Contact"].map((item) => (
          <Link
            key={item}
            href="/"
            // href={`/${item.toLowerCase().replace(" ", "-")}`}
            className="text-primary-500 mx-2"
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Footer;
