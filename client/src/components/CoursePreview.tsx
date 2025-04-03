import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import AccordianSections from "./AccordianSections";

const CoursePreview = ({ course, isSelected = false }: CoursePreviewProps) => {
  const price = formatPrice(course.price);

  return (
    <div className="space-y-10">
      <div className="w-full bg-customgreys-secondarybg py-8 px-10 flex flex-col gap-5 rounded-lg">
        <div className="mb-2 bg-white-50">
          <Image
            src={course.image ? course.image : "/hero1.jpg"}
            alt="Course Preview"
            width={640}
            height={360}
            className="w-full"
            priority
            quality={50}
          />
        </div>
        <div>
          <h2 className="text-white-50 text-3xl font-bold mb-2">
            {course.title}
          </h2>
          <p className="text-gray-400 text-md mb-4">by {course.teacherName}</p>
          <p className="text-sm text-customgreys-dirtyGrey">
            {course.description}
          </p>
        </div>

        <div>
          <h4 className="text-white-50/90 font-semibold mb-2">
            Course Content
          </h4>
          <AccordianSections sections={course.sections} />
        </div>
      </div>

      <div
        className={
          isSelected
            ? "hidden"
            : "w-full bg-customgreys-secondarybg py-8 px-10 flex flex-col gap-5 rounded-lg"
        }
      >
        <h3 className="text-xl mb-4">Price Details (1 item)</h3>
        <div className="flex justify-between mb-4 text-customgreys-dirtyGrey text-base">
          <span className="font-bold">1x {course.title}</span>
          <span className="font-bold">{price}</span>
        </div>
        <div className="flex justify-between border-t border-customgreys-dirtyGrey pt-4">
          <span className="font-bold text-lg">Total Amount</span>
          <span className="font-bold text-lg">{price}</span>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
