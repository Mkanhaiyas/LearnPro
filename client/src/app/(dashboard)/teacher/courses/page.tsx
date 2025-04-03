"use client";
import CourseCard from "@/components/CourseCard";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Toolbar from "@/components/Toolbar";
import { Button } from "@/components/ui/button";
import {
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useGetCoursesQuery,
  useGetUserEnrolledCoursesQuery,
  useUpdateUserCourseProgressMutation,
} from "@/state/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

const Courses = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const {
    data: courses,
    isLoading,
    isError,
  } = useGetCoursesQuery({ category: "all" });

  const { data: enrolledCourse } = useGetUserEnrolledCoursesQuery(
    user?.id ?? "",
    {
      skip: !isLoaded || !user,
    }
  );

  const [createCourse] = useCreateCourseMutation();
  const [updateProgress] = useUpdateUserCourseProgressMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const teacherCoursesList = () => {
    if (!courses) return [];

    const matches = courses.filter((course) => course.teacherId === user?.id);
    const combinedCourses = [...matches, ...(enrolledCourse || [])];

    return combinedCourses.filter(
      (course, index, self) =>
        index === self.findIndex((c) => c.courseId === course.courseId)
    );
  };

  const teacherCourses = teacherCoursesList();

  const filteredCourses = useMemo(() => {
    if (!teacherCourses) return [];
    return teacherCourses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [teacherCourses, searchTerm, selectedCategory]);

  console.log(filteredCourses);
  const handleEdit = (course: Course) => {
    router.push(`/teacher/courses/${course.courseId}`);
  };

  const handleDelete = async (course: Course) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      await deleteCourse(course.courseId).unwrap();
    }
  };

  const handleCreateCourse = async () => {
    if (!user) return;

    const result = await createCourse({
      teacherId: user.id,
      teacherName: user.fullName || "Unknown Teacher",
    }).unwrap();

    await updateProgress({
      userId: user.id,
      courseId: result.courseId,
      progressData: {
        sections: [],
      },
    });

    router.push(`/teacher/courses/${result.courseId}`);
  };

  const handleGoToCourse = (course: Course) => {
    if (
      course.sections &&
      course.sections.length > 0 &&
      course.sections[0].chapters.length > 0
    ) {
      const firstChapter = course.sections[0].chapters[0];
      router.push(
        `/teacher/courses/newcourse/${course.courseId}/chapters/${firstChapter.chapterId}`,
        {
          scroll: false,
        }
      );
    } else {
      router.push(`/teacher/courses/newcourse/${course.courseId}`, {
        scroll: false,
      });
    }
  };

  if (isLoading) return <Loading />;
  if (isError || !courses) return <div>Error loading courses</div>;

  return (
    <div className="w-full h-full">
      <Header
        title="Courses"
        subtitle="Browse your courses"
        rightElement={
          <Button
            onClick={handleCreateCourse}
            className="bg-primary-700 hover:bg-primary-600"
          >
            Create Course
          </Button>
        }
      />
      <Toolbar
        isDashboard={true}
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 mt-10 w-full">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.courseId}
            course={course}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isOwner={course.teacherId === user?.id}
            onGoToCourse={handleGoToCourse}
          />
        ))}
      </div>
    </div>
  );
};

export default Courses;
