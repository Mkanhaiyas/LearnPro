"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Loading from "@/components/Loading";
import { useGetCoursesQuery } from "@/state/api";
import CourseCardSearch from "@/components/CourseCardSearch";
import SelectedCourse from "./SelectedCourse";
import Toolbar from "@/components/Toolbar";

const SearchContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { data: courses, isLoading, isError } = useGetCoursesQuery({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const router = useRouter();

  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    return courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, selectedCategory]);

  useEffect(() => {
    if (filteredCourses) {
      if (id) {
        const course = filteredCourses.find((c) => c.courseId === id);
        setSelectedCourse(course || filteredCourses[0]);
      } else {
        setSelectedCourse(filteredCourses[0]);
      }
    }
  }, [filteredCourses, id]);

  if (isLoading) return <Loading />;
  if (isError || !courses) return <div>Failed to fetch courses</div>;

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    router.push(`/search?id=${course.courseId}`);
  };

  const handleEnrollNow = (courseId: string) => {
    router.push(`/checkout?step=1&id=${courseId}&showSignUp=false`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col bg-background text-foreground h-full mx-auto mt-10 w-3/4"
    >
      <Toolbar
        isDashboard={false}
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
      />
      <h1 className="font-normal text-2xl mt-5">List of available courses</h1>
      <h2 className="text-gray-500 mb-3">
        {filteredCourses.length} courses available
      </h2>
      <div className="w-full flex flex-col-reverse md:flex-row pb-8 pt-2 gap-8">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="basis-3/5 grid grid-cols-1 xl:grid-cols-2 gap-6 auto-rows-fr"
        >
          {filteredCourses.map((course) => (
            <CourseCardSearch
              key={course.courseId}
              course={course}
              isSelected={selectedCourse?.courseId === course.courseId}
              onClick={() => handleCourseSelect(course)}
            />
          ))}
        </motion.div>

        {selectedCourse && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="basis-2/5 min-w-[350px] h-fit border-2 border-primary-600 bg-customgreys-secondarybg overflow-hidden rounded-lg"
          >
            <SelectedCourse
              course={selectedCourse}
              handleEnrollNow={handleEnrollNow}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const Search = () => {
  return (
    <Suspense fallback={<Loading />}>
      <SearchContent />
    </Suspense>
  );
};

export default Search;
