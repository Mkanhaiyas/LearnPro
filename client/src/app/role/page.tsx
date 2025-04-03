"use client";

import { useUpdateUserMutation } from "@/state/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Rolepage = () => {
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [updateUser] = useUpdateUserMutation();
  const router = useRouter();

  useEffect(() => {
    // Check if userType is not set (first login)
    if (!user?.publicMetadata?.userType) {
      setShowModal(true);
    }
  }, [user]);

  const handleRoleSelection = async (role: string) => {
    if (!user) return;
    const updatedUser = {
      userId: user.id,
      publicMetadata: {
        ...user.publicMetadata,
        userType: role,
      },
    };

    try {
      // Update user metadata with selected role
      await updateUser(updatedUser);

      // Redirect based on role
      if (role === "teacher") {
        router.push("/teacher/courses");
      } else {
        router.push("/user/courses");
      }
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  if (!showModal) return null;

  return (
    <div className="w-screen h-screen fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-96 text-center">
        <h2 className="text-xl font-semibold mb-4">Select Your Role</h2>
        <p className="mb-6">Please choose how you&apos;d like to continue:</p>
        <button
          onClick={() => handleRoleSelection("teacher")}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
        >
          Continue as Teacher
        </button>
        <button
          onClick={() => handleRoleSelection("student")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Continue as Student
        </button>
      </div>
    </div>
  );
};
export default Rolepage;
