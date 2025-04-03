"use client";

import AppSidebar from "@/components/AppSidebar";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ChaptersSidebar from "./user/courses/[courseId]/ChaptersSidebar";
import ChapterSidebar from "./teacher/courses/newcourse/[courseId]/ChaptersSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [courseId, setCourseId] = useState<string | null>(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const { user, isLoaded } = useUser();
  const isCoursePage =
    /^\/user\/courses\/[^\/]+(?:\/chapters\/[^\/]+)?$/.test(pathname) ||
    /^\/teacher\/courses\/newcourse\/[^\/]+(?:\/chapters\/[^\/]+)?$/.test(
      pathname
    );

  useEffect(() => {
    if (isCoursePage) {
      const match = pathname.match(
        /\/(user|teacher)\/courses(?:\/newcourse)?\/([^\/]+)/
      );
      setCourseId(match ? match[2] : null);
      setIsTeacher(match ? match[1] === "teacher" : false);
    } else {
      setCourseId(null);
      setIsTeacher(false);
    }
  }, [isCoursePage, pathname]);

  if (!isLoaded) return <Loading />;
  if (!user) return <div>Please sign in to access this page</div>;
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-customgreys-primarybg flex">
        <AppSidebar />
        <div className="flex flex-1 overflow-hidden">
          {courseId && (
            <>{isTeacher ? <ChapterSidebar /> : <ChaptersSidebar />}</>
          )}
          <div
            className={cn(
              "flex-grow min-h-screen transition-all duration-500 ease-in-out overflow-y-auto bg-customgreys-secondarybg",
              isCoursePage && "bg-customgreys-primarybg"
            )}
            style={{ height: "100vh" }}
          >
            <Navbar isCoursePage={isCoursePage} />
            <main className="px-8 py-4">{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
