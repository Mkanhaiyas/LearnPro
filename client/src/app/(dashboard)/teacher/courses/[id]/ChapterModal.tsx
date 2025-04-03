import { CustomFormField } from "@/components/CustomFormField";
import CustomModal from "@/components/CustomModal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChapterFormData, chapterSchema } from "@/lib/schemas";
import { addChapter, closeChapterModal, editChapter } from "@/state";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const ChapterModal = () => {
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useAppDispatch();
  const {
    isChapterModalOpen,
    selectedSectionIndex,
    selectedChapterIndex,
    sections,
  } = useAppSelector((state) => state.global.courseEditor);

  const chapter: Chapter | undefined =
    selectedSectionIndex !== null && selectedChapterIndex !== null
      ? sections[selectedSectionIndex].chapters[selectedChapterIndex]
      : undefined;

  const methods = useForm<ChapterFormData>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: "",
      content: "",
      video: "",
    },
  });

  const uploadVideoToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); // Replace with your Cloudinary upload preset
    formData.append("cloud_name", "dtgdvbpxk"); // Replace with your Cloudinary cloud name
    setIsUploading(true);
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dtgdvbpxk/video/upload`,
        formData
      );
      setIsUploading(false);
      return response.data.secure_url; // This is the URL of the uploaded video
    } catch (error) {
      setIsUploading(false);
      console.error("Video upload failed:", error);
      throw new Error("Video upload failed");
    }
  };

  useEffect(() => {
    if (chapter) {
      methods.reset({
        title: chapter.title,
        content: chapter.content,
        video: chapter.video || "",
      });
    } else {
      methods.reset({
        title: "",
        content: "",
        video: "",
      });
    }
  }, [chapter, methods]);

  const onClose = () => {
    dispatch(closeChapterModal());
  };

  const onSubmit = async (data: ChapterFormData) => {
    if (isUploading) {
      toast.error("Please wait for the video to finish uploading.");
      return;
    }
    if (selectedSectionIndex === null) return;

    console.log("My Data", data);
    const newChapter: Chapter = {
      chapterId: chapter?.chapterId || uuidv4(),
      title: data.title,
      content: data.content,
      type: data.video ? "Video" : "Text",
      video: data.video,
    };

    if (selectedChapterIndex === null) {
      dispatch(
        addChapter({
          sectionIndex: selectedSectionIndex,
          chapter: newChapter,
        })
      );
    } else {
      dispatch(
        editChapter({
          sectionIndex: selectedSectionIndex,
          chapterIndex: selectedChapterIndex,
          chapter: newChapter,
        })
      );
    }
    toast.success(
      `Chapter added/updated successfully but you need to save the course to apply the changes`
    );
    onClose();
  };

  return (
    <CustomModal isOpen={isChapterModalOpen} onClose={onClose}>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add/Edit Chapter</h2>
          <button
            onClick={onClose}
            className=" text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <CustomFormField
              name="title"
              label="Chapter Title"
              placeholder="Write chapter title here"
              initialValue=""
            />

            <CustomFormField
              name="content"
              label="Chapter Content"
              type="textarea"
              placeholder="Write chapter content here"
              initialValue=""
            />

            <FormField
              control={methods.control}
              name="video"
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel className="text-customgreys-dirtyGrey text-sm">
                    Chapter Video URL
                  </FormLabel>
                  <FormControl>
                    <div>
                      {typeof value === "string" && value && (
                        <div className="mb-2 text-sm text-customgreys-dirtyGrey">
                          Current Video URL: {value}
                        </div>
                      )}

                      <Input
                        type="file"
                        accept="video/*"
                        onChange={async (e) => {
                          e.preventDefault();
                          if (e.target.files && e.target.files[0]) {
                            try {
                              const uploadedUrl = await uploadVideoToCloudinary(
                                e.target.files[0]
                              );
                              console.log("Uploaded URL:", uploadedUrl);
                              onChange(uploadedUrl);
                              methods.setValue("video", uploadedUrl);
                              console.log("Methods", methods);
                            } catch (error) {
                              console.error("Error uploading video:", error);
                              toast.error(
                                "Failed to upload video. Please try again."
                              );
                            }
                          }
                        }}
                        className="border-none bg-customgreys-darkGrey p-4"
                      />

                      {typeof value === "string" && value && (
                        <div className="mt-4">
                          <video src={value} controls className="w-full h-64">
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                    </div>
                  </FormControl>

                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary-700"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </CustomModal>
  );
};

export default ChapterModal;
