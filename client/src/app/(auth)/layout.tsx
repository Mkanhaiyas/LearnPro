import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full bg-customgreys-primarybg">
      <main className="w-full flex h-full justify-center items-center">
        {children}
      </main>
    </div>
  );
};

export default layout;
