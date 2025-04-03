"use client";

import { CustomFormField } from "@/components/CustomFormField";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { courseSchema } from "@/lib/schemas";
import { centsToDollars, createCourseFormData } from "@/lib/utils";
import { openSectionModal, setSections } from "@/state";
import { useGetCourseQuery, useUpdateCourseMutation } from "@/state/api";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DroppableComponent from "./Droppable";
import ChapterModal from "./ChapterModal";
import SectionModal from "./SectionModal";
import { Input } from "@/components/ui/input";
import axios from "axios";

const CourseEditor = () => {
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { data: course, isLoading, refetch } = useGetCourseQuery(id);
  const [updateCourse] = useUpdateCourseMutation();

  const dispatch = useAppDispatch();
  const { sections } = useAppSelector((state) => state.global.courseEditor);

  const methods = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseTitle: "",
      courseDescription: "",
      coursePrice: "0",
      courseCategory: "",
      courseStatus: false,
      courseImage: "",
    },
  });

  useEffect(() => {
    if (course) {
      console.log("useEffect:", course);
      methods.reset({
        courseTitle: course.title,
        courseDescription: course.description,
        coursePrice: centsToDollars(course.price),
        courseCategory: course.category,
        courseStatus: course.status === "Published",
        courseImage: course.image || "",
      });
      (() => dispatch(setSections(course.sections || [])))();
    }
  }, [course, methods, dispatch]);

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");
    formData.append("cloud_name", "dtgdvbpxk");

    setIsUploadingImage(true);
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dtgdvbpxk/image/upload",
        formData
      );
      setIsUploadingImage(false);
      return response.data.secure_url;
    } catch (error) {
      setIsUploadingImage(false);
      console.error("Image upload failed:", error);
      throw new Error("Image upload failed");
    }
  };

  const onSubmit = async (data: CourseFormData) => {
    if (isUploadingImage) {
      alert("Please wait for the image upload to complete.");
      return;
    }

    try {
      console.log("Kanhaiya Form data:", data);

      const formData = createCourseFormData(data, sections);
      console.log("FormDATA", formData);
      await updateCourse({
        courseId: id,
        formData,
      }).unwrap();

      refetch();
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };
  return (
    <div>
      <div className="flex items-center gap-5 mb-5">
        <button
          className="flex items-center border border-customgreys-dirtyGrey rounded-lg p-2 gap-2"
          onClick={() => router.push("/teacher/courses")}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </button>
      </div>

      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Header
            title="Course Setup"
            subtitle="Complete all fields and save your course"
            rightElement={
              <div className="flex items-center space-x-4">
                <CustomFormField
                  name="courseStatus"
                  label={methods.watch("courseStatus") ? "Published" : "Draft"}
                  type="switch"
                  className="flex items-center space-x-4"
                  labelClassName={`text-sm font-medium ${
                    methods.watch("courseStatus")
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}
                  inputClassName="data-[state=checked]:bg-green-500"
                />
                <Button
                  type="submit"
                  className="bg-primary-700 hover:bg-primary-600"
                >
                  {methods.watch("courseStatus")
                    ? "Update Published Course"
                    : "Save Draft"}
                </Button>
              </div>
            }
          />

          <div className="flex justify-between md:flex-row flex-col gap-10 mt-5 font-dm-sans">
            <div className="basis-1/2">
              <div className="space-y-4">
                <CustomFormField
                  name="courseTitle"
                  label="Course Title"
                  type="text"
                  placeholder="Write course title here"
                  className="border-none"
                  initialValue={course?.title || ""}
                />

                <CustomFormField
                  name="courseDescription"
                  label="Course Description"
                  type="textarea"
                  placeholder="Write course description here"
                  className="border-none"
                  initialValue={course?.description || ""}
                />

                <CustomFormField
                  name="courseCategory"
                  label="Course Category"
                  type="select"
                  placeholder="Write category here"
                  options={[
                    { value: "technology", label: "Technology" },
                    { value: "science", label: "Science" },
                    { value: "mathematics", label: "Mathematics" },
                    {
                      value: "Artificial Intelligence",
                      label: "Artificial Intelligence",
                    },
                  ]}
                  initialValue={course?.category || ""}
                />

                <CustomFormField
                  name="coursePrice"
                  label="Course Price"
                  type="number"
                  placeholder="0"
                  initialValue={course?.price || ""}
                />

                <FormField
                  control={methods.control}
                  name="courseImage"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormControl>
                        <div>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                try {
                                  const uploadedUrl =
                                    await uploadImageToCloudinary(
                                      e.target.files[0]
                                    );
                                  onChange(uploadedUrl);
                                } catch (error) {
                                  console.error(error);
                                }
                              }
                            }}
                            className="mt-7 p-2"
                          />
                          {isUploadingImage && <p>Uploading image...</p>}
                          {value && (
                            <img
                              src={value}
                              alt="Course"
                              className="mt-2 object-cover rounded-lg self-center w-[50%]"
                            />
                          )}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="bg-customgreys-darkGrey mt-4 md:mt-0 p-4 rounded-lg basis-1/2">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-semibold text-secondary-foreground">
                  Sections
                </h2>

                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    dispatch(openSectionModal({ sectionIndex: null }))
                  }
                  className="border-none text-primary-700 group"
                >
                  <Plus className="mr-1 h-4 w-4 text-primary-700 group-hover:text-white-100" />
                  <span className="text-primary-700 group-hover:text-white-100">
                    Add Section
                  </span>
                </Button>
              </div>

              {isLoading ? (
                <p>Loading course content...</p>
              ) : sections.length > 0 ? (
                <DroppableComponent />
              ) : (
                <p>No sections available</p>
              )}
            </div>
          </div>
        </form>
      </Form>

      <ChapterModal />
      <SectionModal />
    </div>
  );
};

export default CourseEditor;
