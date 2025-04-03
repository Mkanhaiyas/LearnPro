import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn, courseCategories } from "@/lib/utils";

const Toolbar = ({ onSearch, onCategoryChange, isDashboard }: ToolbarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };
  return (
    <div className="flex items-center justify-between gap-4 w-full mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search courses"
        className={cn(
          "w-full px-5 h-12 placeholder-customgreys-dirtyGrey text-customgreys-dirtyGrey border-none rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          isDashboard
            ? "bg-customgreys-primarybg"
            : "bg-customgreys-secondarybg"
        )}
      />
      <Select onValueChange={onCategoryChange}>
        <SelectTrigger
          className={cn(
            "h-12 w-[180px] text-customgreys-dirtyGrey border-none",
            isDashboard
              ? "bg-customgreys-primarybg"
              : "bg-customgreys-secondarybg"
          )}
        >
          <SelectValue placeholder="Categories" />
        </SelectTrigger>
        <SelectContent
          className={cn(
            isDashboard
              ? "bg-customgreys-primarybg"
              : "bg-customgreys-secondarybg"
          )}
        >
          <SelectItem
            value="all"
            className="cursor-pointer hover:!bg-gray-100 hover:!text-customgreys-darkGrey"
          >
            All Categories
          </SelectItem>
          {courseCategories.map((category) => (
            <SelectItem
              key={category.value}
              value={category.value}
              className="cursor-pointer hover:!bg-gray-100 hover:!text-customgreys-darkGrey"
            >
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Toolbar;
