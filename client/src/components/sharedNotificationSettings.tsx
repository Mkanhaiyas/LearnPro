"use client";

import {
  NotificationSettingsFormData,
  notificationSettingsSchema,
} from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateUserMutation } from "@/state/api";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { useForm } from "react-hook-form";
import Header from "./Header";
import { Form } from "./ui/form";
import { CustomFormField } from "./CustomFormField";
import { Button } from "./ui/button";
// import { useRouter } from "next/navigation";

const SharedNotificationSettings = ({
  title = "Notification Settings",
  subtitle = "Manage your notification settings",
}: SharedNotificationSettingsProps) => {
  const { user } = useUser();
  // const router = useRouter();
  const [updateUser] = useUpdateUserMutation();

  const currentSettings =
    (user?.publicMetadata as { settings?: UserSettings })?.settings || {};
  const userTypeSettings = user?.publicMetadata as {
    userType?: "teacher" | "student";
  };

  const methods = useForm<NotificationSettingsFormData>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      courseNotifications: currentSettings.courseNotifications || false,
      emailAlerts: currentSettings.emailAlerts || false,
      smsAlerts: currentSettings.smsAlerts || false,
      notificationFrequency: currentSettings.notificationFrequency || "daily",
      userType: userTypeSettings.userType || "student", // Default to student
    },
  });

  const onSubmit = async (data: NotificationSettingsFormData) => {
    console.log("Kans:", data);
    if (!user) return;

    // Only update notification settings and userType when allowed
    const updatedUser = {
      userId: user.id,
      publicMetadata: {
        ...user.publicMetadata,
        settings: {
          ...currentSettings,
          smsAlerts: data.smsAlerts,
          emailAlerts: data.emailAlerts,
          courseNotifications: data.courseNotifications,
          notificationFrequency: data.notificationFrequency,
        },
        // Update userType only if it's allowed (i.e., if userType is 'student')
        ...(userTypeSettings.userType === "student" && {
          userType: data.userType,
        }),
      },
    };

    try {
      await updateUser(updatedUser);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update user settings: ", error);
    }
  };

  if (!user) return <div>Please sign in to manage your settings</div>;

  return (
    <div className="space-y-4">
      <Header title={title} subtitle={subtitle} />
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-6">
            <CustomFormField
              name="courseNotifications"
              label="Course Notification"
              type="switch"
            />
            <CustomFormField
              name="emailAlerts"
              label="Email Alerts"
              type="switch"
            />
            <CustomFormField
              name="smsAlerts"
              label="SMS Alerts"
              type="switch"
            />
            <CustomFormField
              name="notificationFrequency"
              label="Notification Frequency"
              type="select"
              options={[
                { value: "immediate", label: "Immediate" },
                { value: "daily", label: "Daily" },
                { value: "weekly", label: "Weekly" },
              ]}
            />
            {/* Show userType field only for students */}
            {userTypeSettings.userType === "student" && (
              <CustomFormField
                name="userType"
                label="UserType"
                type="select"
                options={[
                  { value: "teacher", label: "Teacher" },
                  { value: "student", label: "Student" },
                ]}
              />
            )}
          </div>

          <Button
            type="submit"
            className="!mt-8 text-gray-100 bg-primary-700 hover:bg-primary-600"
          >
            Update Settings
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SharedNotificationSettings;
